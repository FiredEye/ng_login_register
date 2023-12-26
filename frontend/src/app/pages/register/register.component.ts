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
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink],

  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  userExist = false;
  imageNotSelected = false;
  selectedFile: File | null = null;
  error = '';
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
  registerForm = this.fb.group(
    {
      userName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required, this.minPasswordLengthValidator]],
      confirmPassword: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );
  userService: UsersService = inject(UsersService);
  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      this.userExist = false;
      this.imageNotSelected = false;
      this.error = '';
    });
  }
  constructor(private fb: FormBuilder, private router: Router) {}
  get userName() {
    return this.registerForm.controls['userName'];
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
  get age() {
    return this.registerForm.controls['age'];
  }
  get gender() {
    return this.registerForm.controls['gender'];
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
    const { userName, email, password, address, age, gender, confirmPassword } =
      this.registerForm.value;

    if (this.selectedFile !== null) {
      const formData = new FormData();

      // Append form values to FormData
      formData.append('userName', userName || '');
      formData.append('email', email || '');
      formData.append('password', password || '');
      formData.append('address', address || '');
      formData.append('age', age || '5');
      formData.append('gender', gender || '');
      formData.append('confirmPassword', confirmPassword || '');
      formData.append('imageFile', this.selectedFile);

      this.userService.registerUser(formData).subscribe({
        next: (res) => {
          if (res) {
            console.log(res.message);
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.error = err.error.error;
        },
      });
    } else {
      this.imageNotSelected = true;
    }
  }
}
