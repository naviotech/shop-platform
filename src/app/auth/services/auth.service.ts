import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthStatus, LoginProps, RegisterProps, User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

const baseUrl = environment.BASEURL;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #authStatus = signal<AuthStatus>(AuthStatus.CHECKING);
  #user = signal<User | null>(null);
  #token = signal<string | null>(localStorage.getItem('token'));
  isAdmin = computed(()=>{
    return  this.user()?.roles.includes('admin') ?? false
  })
  #http = inject(HttpClient);

  resourceStatus = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed(() => {
    if (this.#authStatus() === AuthStatus.CHECKING) return AuthStatus.CHECKING;
    if (this.#user()) return AuthStatus.AUTHENTICATED;

    return AuthStatus.NOTAUTHENTICATED;
  });

  user = computed(() => this.#user());
  token = computed(() => this.#token());

  login({ email, password }: LoginProps): Observable<boolean> {
    return this.#http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map(this.#handleAuthSucces.bind(this)),
        catchError((error: any) => this.#handleAuthError(error))
      );
  }

  register({email, password, username}:RegisterProps):Observable<boolean>{
    return this.#http.post<AuthResponse>(`${baseUrl}/auth/register`,{
      fullName : username,
      email,
      password
    }).pipe(
      map(this.#handleAuthSucces.bind(this)),
      catchError((error: any) => this.#handleAuthError(error))
    )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.#handleAuthError(null);
    }

    return this.#http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .pipe(
        map(this.#handleAuthSucces.bind(this)),
        catchError((error: any) => this.#handleAuthError(error))
      );
  }

  logout() {
    this.#user.set(null);
    this.#authStatus.set(AuthStatus.NOTAUTHENTICATED);
    this.#token.set(null);
    localStorage.removeItem('token');
  }

  #handleAuthSucces({ token, user }: AuthResponse) {
    this.#user.set(user);
    this.#authStatus.set(AuthStatus.AUTHENTICATED);
    this.#token.set(token);
    localStorage.setItem('token', token);
    return true;
  }

  #handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
