import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  userService: UsersService = inject(UsersService);
  userNotExist = false;
  passwordNotMatch = false;
  resetUser() {
    this.userNotExist = false;
    this.passwordNotMatch = false;
  }
  constructor(private fb: FormBuilder, private router: Router) {}
  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.resetUser();
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
    console.log(email);
    this.userService.getUserByEmail(email ?? '').then((user) => {
      if (user) {
        this.userService.checkUser(email ?? '', password ?? '').then((user) => {
          if (user) {
            this.router.navigate(['/home']);
          } else {
            this.passwordNotMatch = true;
          }
        });
      } else {
        this.userNotExist = true;
      }
    });
  }
}