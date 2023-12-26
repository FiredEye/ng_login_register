import { Component, inject } from '@angular/core';
import { UpdateFormComponent } from '../../components/update-form/update-form.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';
import { StoreUserService } from '../../services/store-user.service';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [UpdateFormComponent, RouterLink],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css',
})
export class UserUpdateComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  userService: UsersService = inject(UsersService);

  storeUserService: StoreUserService = inject(StoreUserService);
  user: User | undefined;
  error = '';
  constructor(private router: Router) {
    const userId = String(this.route.snapshot.params['id']);
    this.userService
      .getUserById(userId, this.storeUserService.getUser()?.token)
      .subscribe({
        next: (user) => {
          this.user = user?.userDetails;
        },
        error: (err) => {
          this.error = err.error.error;
        },
      });
  }
}
