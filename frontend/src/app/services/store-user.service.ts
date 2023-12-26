import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreUserService {
  constructor() {}
  private userKey = 'user';

  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any | null {
    const data = localStorage.getItem(this.userKey);

    return data ? JSON.parse(data) : null;
  }
  updateUser(updatedData: any): void {
    const existingData = this.getUser();
    const mergedData = { ...existingData, ...updatedData };

    localStorage.setItem(this.userKey, JSON.stringify(mergedData));
  }
  clearUser(): void {
    localStorage.removeItem(this.userKey);
  }
}
