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

    this.userService.getUserByEmail(email ?? '').subscribe({
      next: (user) => {
        if (user) {
          this.userService.checkUser(email ?? '', password ?? '').subscribe({
            next: (user) => {
              if (user) {
                this.userService
                  .increseLogCount(user.id, {
                    loggedInCount: Number(user.loggedInCount) + 1,
                  })
                  .subscribe({
                    next: () => {
                      sessionStorage.setItem(
                        'user',
                        JSON.stringify({ email, isAdmin: user.isAdmin })
                      );

                      this.router.navigate(['/home']);
                    },
                  });
              } else {
                this.passwordNotMatch = true;
              }
            },
            error: (e) => console.error(e),
          });
        } else {
          this.userNotExist = true;
        }
      },
      error: (e) => console.error(e),
    });
  }
}
