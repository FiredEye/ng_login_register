import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = 'http://localhost:3001'; // Adjust the base URL as needed

  async uploadFile(file: File): Promise<any> {
    const uploadUrl = `${this.baseUrl}/upload`;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  async deleteFile(imageUrl: string): Promise<any> {
    const deleteUrl = `${this.baseUrl}/remove?imageUrl=${imageUrl}`;

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  async updateFile(file: File, imageUrl: string): Promise<any> {
    const updateUrl = `${this.baseUrl}/update`;
    const formData = new FormData();
    console.log(imageUrl);
    formData.append('imageUrl', imageUrl);
    formData.append('file', file);

    try {
      const response = await fetch(updateUrl, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}
