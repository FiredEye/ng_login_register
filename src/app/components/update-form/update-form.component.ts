import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from '../../services/file-upload.service';
import { User } from '../../interfaces/user';
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

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.imgSrc = URL.createObjectURL(event.target.files[0]);
  }
  updateUser() {
    const { username, email, address } = this.updateForm.value;
    if (this.selectedFile !== null) {
      this.user &&
        this.fileUploadService
          .updateFile(this.selectedFile, this.user?.imageUrl)
          .then((response: any) => {
            const imageUrl = response?.imageUrl;

            this.user &&
              this.userService
                .updateUser(this.user.id, {
                  userName: username,
                  email,
                  password: this.user.password,
                  address,
                  imageUrl,
                })
                .then(() => {
                  console.log('user updated.');
                  this.user &&
                    this.router.navigate([`/detail/${this.user.id}`]);
                })
                .catch((err) => console.log(err));
          });
    } else {
      this.user &&
        this.userService
          .updateUser(this.user.id, {
            userName: username,
            email,
            password: this.user.password,
            address,
            imageUrl: this.user.imageUrl,
          })
          .then(() => {
            console.log('user updated.');
            this.user && this.router.navigate([`/detail/${this.user.id}`]);
          })
          .catch((err) => console.log(err));
    }
  }
}
