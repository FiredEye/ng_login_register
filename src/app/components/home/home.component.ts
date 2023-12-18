import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userList: User[] = [];
  userService: UsersService = inject(UsersService);
  constructor() {
    this.userList = this.userService.getAllUsers();
  }
}
