import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  protected userList: User[] = [
    { id: 1, userName: 'user1', email: 'user1@example.com' },
    { id: 2, userName: 'user2', email: 'user2@example.com' },
    { id: 3, userName: 'user3', email: 'user3@example.com' },
    { id: 4, userName: 'user4', email: 'user4@example.com' },
    { id: 5, userName: 'user5', email: 'user5@example.com' },
    { id: 6, userName: 'user6', email: 'user6@example.com' },
    { id: 7, userName: 'user7', email: 'user7@example.com' },
    { id: 8, userName: 'user8', email: 'user8@example.com' },
    { id: 9, userName: 'user9', email: 'user9@example.com' },
    { id: 10, userName: 'user10', email: 'user10@example.com' },
    { id: 11, userName: 'user11', email: 'user11@example.com' },
    { id: 12, userName: 'user12', email: 'user12@example.com' },
    { id: 13, userName: 'user13', email: 'user13@example.com' },
    { id: 14, userName: 'user14', email: 'user14@example.com' },
    { id: 15, userName: 'user15', email: 'user15@example.com' },
  ];

  constructor() {}

  getAllUsers(): User[] {
    return this.userList;
  }
}
