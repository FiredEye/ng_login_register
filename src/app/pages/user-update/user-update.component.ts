import { Component, inject } from '@angular/core';
import { UpdateFormComponent } from '../../components/update-form/update-form.component';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [UpdateFormComponent],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css',
})
export class UserUpdateComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  userService: UsersService = inject(UsersService);
  user: User | undefined;
  constructor() {
    const userId = String(this.route.snapshot.params['id']);
    this.userService.getUserById(userId).subscribe({
      next: (user) => (this.user = user),
      error: (e) => console.error(e),
    });
  }
}
