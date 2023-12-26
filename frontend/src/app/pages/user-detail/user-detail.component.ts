import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { FileUploadService } from '../../services/file-upload.service';
import { StoreUserService } from '../../services/store-user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  userService: UsersService = inject(UsersService);
  storeUserService: StoreUserService = inject(StoreUserService);
  user: User | undefined;
  imgBaseUrl = 'http://localhost:5000';
  error = '';
  show = true;
  constructor(private router: Router) {
    const userId = String(this.route.snapshot.params['id']);
    this.userService
      .getUserById(userId, this.storeUserService.getUser()?.token)
      .subscribe({
        next: (user) => {
          this.user = user?.userDetails;
          this.show =
            this.storeUserService.getUser()?.email === user?.userDetails.email;
        },
        error: (err) => {
          this.error = err.error.error;
        },
      });
  }
  visible = false;
  showDialog(visible: boolean) {
    this.visible = visible;
  }

  deleteUser(id: string) {
    if (id) {
      const formData = new FormData();

      formData.append('account', 'deActivated');
      this.userService
        .deactivateUser(id, formData, this.storeUserService.getUser()?.token)
        .subscribe({
          next: (res) => {
            if (res) {
              console.log(res.message);
              this.storeUserService.clearUser();
              this.router.navigate([`/login`]);
            }
          },
          error: (err) => {
            this.error = err.error.error;
          },
        });
      this.visible = false;
    }
  }
}
