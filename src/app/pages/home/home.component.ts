import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userList: User[] = [];
  userService: UsersService = inject(UsersService);

  constructor(private router: Router) {
    this.userService.getAllUsers().subscribe({
      next: (userList: User[]) => {
        this.userList = userList;
      },
      error: (e) => console.error(e),
    });
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
