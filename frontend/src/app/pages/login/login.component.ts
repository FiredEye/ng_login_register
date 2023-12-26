import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { UsersService } from '../../services/users.service';
import { StoreUserService } from '../../services/store-user.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  minPasswordLengthValidator(control: AbstractControl) {
    const minLength = 5;
    const password = control.value as string;

    if (password && password.length < minLength) {
      return { minLength: true };
    }

    return null;
  }
  emailValidator(control: AbstractControl) {
    const email = control.value as string;

    // Check if the email contains @ and .com
    if (!/.*@.*\.com$/.test(email)) {
      return { invalidEmail: true };
    }

    return null;
  }
  loginForm = this.fb.group({
    email: ['', [Validators.required, this.emailValidator]],
    password: ['', [Validators.required, this.minPasswordLengthValidator]],
  });
  userService: UsersService = inject(UsersService);
  storeUserService: StoreUserService = inject(StoreUserService);
  error = '';

  constructor(private fb: FormBuilder, private router: Router) {}
  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
  loginUser() {
    const { email, password } = this.loginForm.value;
    this.userService.loginUser(email ?? '', password ?? '').subscribe({
      next: (user) => {
        this.storeUserService.setUser(user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error = err.error.error;
      },
    });
  }
}
