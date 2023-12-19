import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = 'http://localhost:3001'; // Adjust the base URL as needed
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const uploadUrl = `${this.baseUrl}/upload`;

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(uploadUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error uploading file:', error);
        return throwError(() => new Error('Failed adding user'));
      })
    );
  }
  deleteFile(imageUrl: string): Observable<void> {
    const deleteUrl = `${this.baseUrl}/remove?imageUrl=${imageUrl}`;
    return this.http.delete<void>(deleteUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Failed deleting user file'));
      })
    );
  }
  updateFile(file: File, imageUrl: string): Observable<any> {
    const updateUrl = `${this.baseUrl}/update`;
    const formData = new FormData();
    formData.append('imageUrl', imageUrl);
    formData.append('file', file);
    return this.http.put<any>(updateUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating user file:', error);
        return throwError(() => new Error('Failed updating user'));
      })
    );
  }
}
