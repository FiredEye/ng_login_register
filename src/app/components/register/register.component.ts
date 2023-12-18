import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink],

  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };

  registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );
  constructor(private fb: FormBuilder, private router: Router) {}
  get username() {
    return this.registerForm.controls['username'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  registerUser() {
    const { username, email, password } = this.registerForm.value;
    console.log(username, email);
    this.router.navigate(['/login']);
  }
}
