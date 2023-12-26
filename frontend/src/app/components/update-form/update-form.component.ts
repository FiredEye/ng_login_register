import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';

import { User } from '../../interfaces/user';
import { StoreUserService } from '../../services/store-user.service';
@Component({
  selector: 'app-update-form',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.css',
})
export class UpdateFormComponent implements OnInit {
  @Input() user: User | undefined;
  userExist = false;
  selectedFile: File | null = null;
  imgBaseUrl = 'http://localhost:5000';
  updateForm = this.fb.group({
    userName: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    age: ['', Validators.required],
    gender: ['', Validators.required],
  });
  userService: UsersService = inject(UsersService);
  storeUserService: StoreUserService = inject(StoreUserService);
  imgSrc: string = '';
  error = '';
  ngOnInit() {
    // If a user is provided, pre-fill the form with user data
    if (this.user) {
      this.updateForm.patchValue({
        userName: this.user.userName,
        address: this.user.address,
        email: this.user.email,
        age: this.user.age.toString(),
        gender: this.user.gender,
      });
      this.imgSrc = this.imgBaseUrl + this.user.imageUrl;
    }

    this.updateForm.valueChanges.subscribe(() => {
      this.userExist = false;
      this.error = '';
    });
  }
  constructor(private fb: FormBuilder, private router: Router) {}
  get userName() {
    return this.updateForm.controls['userName'];
  }
  get address() {
    return this.updateForm.controls['address'];
  }
  get email() {
    return this.updateForm.controls['email'];
  }
  get age() {
    return this.updateForm.controls['age'];
  }
  get gender() {
    return this.updateForm.controls['gender'];
  }
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.imgSrc = URL.createObjectURL(event.target.files[0]);
  }
  updateUser() {
    const { userName, address, age, gender } = this.updateForm.value;
    const formData = new FormData();

    // Append form values to FormData
    formData.append('userName', userName || '');
    formData.append('address', address || '');
    formData.append('age', age || '5');
    formData.append('gender', gender || '');
    if (this.selectedFile && this.user?.imageUrl) {
      formData.append('old_imgPath', this.user?.imageUrl);

      formData.append('imageFile', this.selectedFile);
    }
    this.userService
      .updateUser(
        this.user?.id ?? '',
        formData,
        this.storeUserService.getUser()?.token
      )
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('user updated sucessfully!');
            this.storeUserService.updateUser(res);
            this.router.navigate([`/detail/${this.user?.id}`]);
          }
        },
        error: (err) => {
          this.error = err.error.error;
        },
      });
  }
  onUpdateComplete() {
    if (this.user) {
      this.router.navigate([`/detail/${this.user.id}`]);
    }
  }
}
