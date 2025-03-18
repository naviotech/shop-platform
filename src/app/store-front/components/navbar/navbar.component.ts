import { AuthStatus } from '@/auth/interfaces/user.interface';
import { AuthService } from '@/auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  authService = inject(AuthService)

  userAuth = computed(()=>{
    if(this.authService.authStatus() === AuthStatus.AUTHENTICATED) return true
    return false
  })
}
