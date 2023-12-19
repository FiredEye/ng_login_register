import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { FileUploadService } from '../../services/file-upload.service';

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
  fileUploadService: FileUploadService = inject(FileUploadService);

  imgBaseUrl = 'http://localhost:3001';
  user: User | undefined;
  constructor(private router: Router) {
    const userId = String(this.route.snapshot.params['id']);
    this.userService.getUserById(userId).subscribe({
      next: (user) => (this.user = user),
      error: (e) => console.error(e),
    });
  }
  visible = false;
  showDialog(visible: boolean) {
    this.visible = visible;
  }

  deleteUser(id: string, imageUrl: string) {
    if (id && imageUrl) {
      this.fileUploadService.deleteFile(imageUrl).subscribe({
        next: (res) => {
          this.userService.deleteUser(id).subscribe({
            next: () => {
              console.log('user deleted.');
              this.router.navigate(['']);
            },
            error: (e) => console.error(e),
          });
        },
        error: (e) => console.error(e),
      });
    }
  }
}
