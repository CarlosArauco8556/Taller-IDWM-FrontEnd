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
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvcy5hcmF1Y29AYWx1bW5vcy51Y24uY2wiLCJnaXZlbl9uYW1lIjoiY2FybG9zLmFyYXVjb0BhbHVtbm9zLnVjbi5jbCIsIm5hbWVpZCI6IjY4OGQwY2VmLTE3ODYtNDhkMi04NGIyLTM5YTAzOTI5MzVjOSIsImp0aSI6IjE4MDViMjI5LTVjODYtNGI0ZC1hMzlkLTUyZTM3ZTMyNzhiMiIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM1MzQxOTgwLCJleHAiOjE3MzU0MjgzODAsImlhdCI6MTczNTM0MTk4MCwiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.a0-CNGnwWa4S9o2RlgTelU5gPaFecnJ-6Ry8Yp0syDcQwNdB-2dBYV_VbBc68-ecnTEQu41kWt_ZNuzkTaP8CA';
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
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvcy5hcmF1Y29AYWx1bW5vcy51Y24uY2wiLCJnaXZlbl9uYW1lIjoiY2FybG9zLmFyYXVjb0BhbHVtbm9zLnVjbi5jbCIsIm5hbWVpZCI6IjY4OGQwY2VmLTE3ODYtNDhkMi04NGIyLTM5YTAzOTI5MzVjOSIsImp0aSI6IjE4MDViMjI5LTVjODYtNGI0ZC1hMzlkLTUyZTM3ZTMyNzhiMiIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM1MzQxOTgwLCJleHAiOjE3MzU0MjgzODAsImlhdCI6MTczNTM0MTk4MCwiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.a0-CNGnwWa4S9o2RlgTelU5gPaFecnJ-6Ry8Yp0syDcQwNdB-2dBYV_VbBc68-ecnTEQu41kWt_ZNuzkTaP8CA';
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