// api documentaion
// https://documenter.getpostman.com/view/31954976/2s9Ykt5yyv
import { Injectable } from '@angular/core';
import { LoginResponse, User } from '../interfaces/user';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // async getAllUsers(): Promise<User[]> {
  //   const data = await fetch(this.url);
  //   return (await data.json()) ?? [];
  // }
  getAllUsers(
    token: string,
    page: number
  ): Observable<{ data: User[]; totalPages: number }> {
    const headers = new HttpHeaders().set('Authorization', token);

    // Include headers in the request
    const params = new HttpParams().set('page', page.toString());
    return this.http
      .get<{ data: User[]; totalPages: number }>(
        `${this.baseUrl}/getAllUsers`,
        { headers, params }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching user list:', error);
          return throwError(() => new Error('Failed to fetch user list'));
        })
      );
  }
  getAllUsersForChart(token: string): Observable<User[]> {
    const headers = new HttpHeaders().set('Authorization', token);

    // Include headers in the request
    return this.http
      .get<User[]>(`${this.baseUrl}/getAllUsersForChart`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching user list:', error);
          return throwError(() => new Error('Failed to fetch user list'));
        })
      );
  }

  searchUsers(
    search: string,
    token: string,
    page: number
  ): Observable<{ data: User[]; totalPages: number }> {
    const headers = new HttpHeaders().set('Authorization', token);

    // Include headers in the request
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<{ data: User[]; totalPages: number }>(
      `${this.baseUrl}/search/${search}`,
      { headers, params }
    );
  }

  getUserById(id: string, token: string): Observable<{ userDetails: User }> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<{ userDetails: User }>(
      `${this.baseUrl}/getUserDetail/${id}`,
      {
        headers,
      }
    );
  }

  loginUser(
    email: string,
    password: string
  ): Observable<LoginResponse | undefined> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.baseUrl}/userLogin`, body);
  }

  registerUser(userData: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/userRegister`,
      userData
    );
  }

  updateUser(
    userId: string,
    updatedUserData: FormData,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);
    const updateUrl = `${this.baseUrl}/updateUserDetail/${userId}`;
    return this.http.patch(updateUrl, updatedUserData, { headers });
  }

  deactivateUser(
    userId: string,
    userData: FormData,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);
    const updateUrl = `${this.baseUrl}/deactivateUser/${userId}`;
    return this.http.patch(updateUrl, userData, { headers });
  }
}
