import { Component, OnInit, inject } from '@angular/core';
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
import { UsersService } from '../../services/users.service';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from '../../services/file-upload.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink],

  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
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
  userExist = false;
  imageNotSelected = false;
  selectedFile: File | null = null;

  registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );
  userService: UsersService = inject(UsersService);
  fileUploadService: FileUploadService = inject(FileUploadService);
  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      this.userExist = false;
      this.imageNotSelected = false;
    });
  }
  constructor(private fb: FormBuilder, private router: Router) {}
  get username() {
    return this.registerForm.controls['username'];
  }
  get address() {
    return this.registerForm.controls['address'];
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
  imgSrc: string = '';
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.imageNotSelected = false;
    this.imgSrc = URL.createObjectURL(event.target.files[0]);
  }
  registerUser() {
    const { username, email, password, address } = this.registerForm.value;

    if (this.selectedFile !== null) {
      this.userService.getUserByEmail(email ?? '').subscribe({
        next: (user) => {
          if (user) {
            this.userExist = true;
          } else {
            this.selectedFile !== null &&
              this.fileUploadService.uploadFile(this.selectedFile).subscribe({
                next: (response: any) => {
                  const imageUrl = response?.imageUrl;
                  this.userService
                    .addUser({
                      id: uuidv4(),
                      userName: username ?? '',
                      email: email ?? '',
                      password: password ?? '',
                      address: address ?? '',
                      imageUrl: imageUrl ?? '',
                    })
                    .subscribe({
                      next: (user) => {
                        console.log('user added.');
                        this.router.navigate(['/login']);
                      },
                      error: (e) => console.error(e),
                    });
                },
                error: (e) => console.error(e),
              });
          }
        },
        error: (e) => console.error(e),
      });
    } else {
      this.imageNotSelected = true;
    }
  }
}
