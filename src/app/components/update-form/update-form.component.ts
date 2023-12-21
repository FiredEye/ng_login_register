import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';

import { FileUploadService } from '../../services/file-upload.service';
import { User } from '../../interfaces/user';
import { finalize, switchMap } from 'rxjs';
@Component({
  selector: 'app-update-form',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.css',
})
export class UpdateFormComponent implements OnInit {
  @Input() user: User | undefined;
  imgBaseUrl = 'http://localhost:3001';
  userExist = false;
  selectedFile: File | null = null;

  updateForm = this.fb.group({
    username: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    age: [0, Validators.required],
    gender: ['', Validators.required],
  });
  userService: UsersService = inject(UsersService);
  fileUploadService: FileUploadService = inject(FileUploadService);
  imgSrc: string = '';
  ngOnInit() {
    // If a user is provided, pre-fill the form with user data
    if (this.user) {
      this.updateForm.patchValue({
        username: this.user.userName,
        address: this.user.address,
        email: this.user.email,
        age: Number(this.user.age),
        gender: this.user.gender,
      });
      this.imgSrc = this.imgBaseUrl + this.user.imageUrl;
    }

    this.updateForm.valueChanges.subscribe(() => {
      this.userExist = false;
    });
  }
  constructor(private fb: FormBuilder, private router: Router) {}
  get username() {
    return this.updateForm.controls['username'];
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
    const { username, address, age, gender } = this.updateForm.value;
    const updateUserParams = {
      userName: username,
      address,
      age,
      gender,
    };
    const updateObservable =
      this.selectedFile !== null
        ? this.fileUploadService.updateFile(
            this.selectedFile,
            this.user?.imageUrl ?? ''
          )
        : null;

    if (updateObservable) {
      updateObservable
        .pipe(
          switchMap((response: any) => {
            const imageUrl = response?.imageUrl;
            return this.userService.updateUser(this.user?.id || '', {
              ...updateUserParams,
              imageUrl,
            });
          }),
          finalize(() => this.onUpdateComplete())
        )
        .subscribe({
          next: () => console.log('User updated.'),
          error: (e) => console.error(e),
        });
    } else {
      this.userService
        .updateUser(this.user?.id || '', updateUserParams)
        .pipe(finalize(() => this.onUpdateComplete()))
        .subscribe({
          next: () => console.log('User updated.'),
          error: (e) => console.error(e),
        });
    }
  }
  onUpdateComplete() {
    if (this.user) {
      this.router.navigate([`/detail/${this.user.id}`]);
    }
  }
}
