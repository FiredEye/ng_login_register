import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // async getAllUsers(): Promise<User[]> {
  //   const data = await fetch(this.url);
  //   return (await data.json()) ?? [];
  // }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user list:', error);
        return throwError(() => new Error('Failed to fetch user list'));
      })
    );
  }
  getUserById(id: string): Observable<User | undefined> {
    return this.http.get<User>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Failed to fetch user'));
      })
    );
  }

  getUserByEmail(email: string): Observable<User | undefined> {
    return this.getAllUsers().pipe(
      map((users) => users.find((user) => user.email === email)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Failed to fetch user'));
      })
    );
  }
  checkUser(email: string, password: string): Observable<User | undefined> {
    return this.getAllUsers().pipe(
      map((users) =>
        users.find((user) => user.email === email && user.password === password)
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Failed to fetch user'));
      })
    );
  }
  addUser(userData: User): Observable<User> {
    return this.http
      .post<User>(this.url, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error adding user:', error);
          return throwError(() => new Error('Failed adding user'));
        })
      );
  }
  updateUser(userId: string, updatedUserData: any): Observable<User> {
    const updateUrl = `${this.url}/${userId}`;
    return this.http
      .put<User>(updateUrl, updatedUserData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating user:', error);
          return throwError(() => new Error('Failed updating user'));
        })
      );
  }
  deleteUser(userId: string): Observable<void> {
    const deleteUrl = `${this.url}/${userId}`;
    return this.http
      .delete<void>(deleteUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error deleting user:', error);
          return throwError(() => new Error('Failed deleting user'));
        })
      );
  }
}
