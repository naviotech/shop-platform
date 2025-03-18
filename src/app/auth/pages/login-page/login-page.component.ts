import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { AuthService } from '@/auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  authService = inject(AuthService);
  router = inject(Router);
  
  unauthoritzed = signal(false);

  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
    ],
    password: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.passwordPattern)],
    ],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email = '', password = '' } = this.loginForm.getRawValue();
    this.authService
      .login({ email: String(email), password: String(password) })
      .subscribe((isAuth) => {
        if (isAuth) {
          this.router.navigateByUrl('/');
          return;
        }
        this.loginForm.reset({
          email: '',
          password: '',
        });
        this.unauthoritzed.set(true);
        setTimeout(() => {
          this.unauthoritzed.set(false);
        }, 5000);
      });
  }
}
