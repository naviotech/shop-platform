import { AuthService } from '@/auth/services/auth.service';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  authService = inject(AuthService);
  router= inject(Router)

  isError = signal(false);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
    ],
    password: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.passwordPattern)],
    ],
  });

  onSumit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const {
      username = '',
      email = '',
      password = '',
    } = this.registerForm.getRawValue();
    this.authService.register({
      username: String(username),
      email: String(email),
      password: String(password),
    }).subscribe((isAuth)=>{
      if (isAuth) {
        this.router.navigateByUrl('/');
        return;
      }
      this.registerForm.reset({
        email: '',
        password: '',
        username: ''
      });
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 5000);
    });
  }
}
