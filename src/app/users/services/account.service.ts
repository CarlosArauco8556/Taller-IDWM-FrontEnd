import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEditProfile } from '../interfaces/IEditProfile';
import { IGetUsers } from '../interfaces/IGetUsers';
import { firstValueFrom } from 'rxjs';
import { IChangePassword } from '../interfaces/IChangePassword';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl: string = "http://localhost:5012/api/Account";
  private http = inject(HttpClient);
  public errors: string[] = [];

  async editProfile(IEditProfile: IEditProfile): Promise<string> {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvczUxMzJmY0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiY2FybG9zNTEzMmZjQGdtYWlsLmNvbSIsIm5hbWVpZCI6IjNhNzA4YzJjLTI2NzEtNDg5Ni04NjVmLTE5YTcxODU0MDBkMiIsImp0aSI6IjlkODlmZmIyLTM4NDEtNDk5MC1iYjk0LWFlNTQ3ZTNhMDE1OCIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM1MTU5OTEwLCJleHAiOjE3MzUyNDYzMTAsImlhdCI6MTczNTE1OTkxMCwiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.c4IxAQ6rCZ2GDGRgPd5gflg-TY2MsZU8IStjSUJK2W6jv_vFGotAVq0Sfqi1A-KJnv9Bpu_SA6My5Y9QmH1Bjg';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await firstValueFrom(this.http.post<{ message: string }>(`${this.baseUrl}/edit-profile`, IEditProfile, { headers: headers }))
      return Promise.resolve(response.message);
    } catch (error) {
      console.log("Error in editProfile service.", error);

      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  async changePassword(IChangePassword: IChangePassword): Promise<string> {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvczUxMzJmY0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiY2FybG9zNTEzMmZjQGdtYWlsLmNvbSIsIm5hbWVpZCI6IjNhNzA4YzJjLTI2NzEtNDg5Ni04NjVmLTE5YTcxODU0MDBkMiIsImp0aSI6IjZjZjYyZjRjLWMxN2UtNDI1NC1hNGIxLWZmMmE1OTUxYWQzZSIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM1MTY5MDQ4LCJleHAiOjE3MzUyNTU0NDgsImlhdCI6MTczNTE2OTA0OCwiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.qhEI2OtqfZ5iN1pO-MoFem3mRC56S5nIufyeH56VQ3Iuy-O7VYmZ1sGvbfYfBXnJs_O27dgB2L6E5m1P95Bwzw';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await firstValueFrom(this.http.post<{ message: string }>(`${this.baseUrl}/change-password`, IChangePassword, { headers: headers }))
      return Promise.resolve(response.message);
    } catch (error) {
      console.log("Error in changePassword service.", error);

      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }
}