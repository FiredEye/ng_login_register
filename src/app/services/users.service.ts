import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url = 'http://localhost:3000/users';

  constructor() {}

  async getAllUsers(): Promise<User[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
  async getUserById(id: string): Promise<User | undefined> {
    const users = await this.getAllUsers();
    return users.find((user) => user.id === id);
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getAllUsers();
    return users.find((user) => user.email === email);
  }
  async checkUser(email: string, password: string): Promise<User | undefined> {
    const users = await this.getAllUsers();
    return users.find(
      (user) => user.email === email && user.password === password
    );
  }
  async addUser(userData: User): Promise<User> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  }
  async updateUser(userId: string, updatedUserData: any): Promise<User> {
    const updateUrl = `${this.url}/${userId}`;

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUserData),
    });

    return response.json();
  }
  async deleteUser(userId: string): Promise<void> {
    const deleteUrl = `${this.url}/${userId}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
}
