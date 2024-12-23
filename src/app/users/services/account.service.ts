import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEditProfile } from '../interfaces/IeditProfile';
import { IGetUsers } from '../interfaces/igetUsers';
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
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvczUxMzJmY0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiY2FybG9zNTEzMmZjQGdtYWlsLmNvbSIsIm5hbWVpZCI6ImMyMDVkY2QxLTE5NmEtNGNiMi1hMjZhLTBmMDFmZTM5OWFhYyIsImp0aSI6Ijc4NzBmNWFjLTRlYzMtNGVlNy04NmExLTc5M2JhN2ZiYjQ0MyIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM0NzExODgzLCJleHAiOjE3MzQ3OTgyODMsImlhdCI6MTczNDcxMTg4MywiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.lwwNdptdI6X1sgBRNqjvr2SDK3TsVxWAaxB3v45Daw_tqzaLfg4C-h-qvOhSvMSNgwGIO3IyC8ZmmZexIRFG9g';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await firstValueFrom(this.http.post<{ message: string }>(`${this.baseUrl}/edit-profile`, IEditProfile, { headers: headers }))
      return Promise.resolve(response.message);
    } catch (error) {
      console.log("Error in editProsile service", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(e);
    }
  }

  async changePassword(IChangePassword: IChangePassword): Promise<string> {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvczUxMzJmY0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiY2FybG9zNTEzMmZjQGdtYWlsLmNvbSIsIm5hbWVpZCI6ImMyMDVkY2QxLTE5NmEtNGNiMi1hMjZhLTBmMDFmZTM5OWFhYyIsImp0aSI6Ijc4NzBmNWFjLTRlYzMtNGVlNy04NmExLTc5M2JhN2ZiYjQ0MyIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM0NzExODgzLCJleHAiOjE3MzQ3OTgyODMsImlhdCI6MTczNDcxMTg4MywiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.lwwNdptdI6X1sgBRNqjvr2SDK3TsVxWAaxB3v45Daw_tqzaLfg4C-h-qvOhSvMSNgwGIO3IyC8ZmmZexIRFG9g';
      const headers = new HttpHeaders().set('Authorization', `Beare, ${token}`);
      const response = await firstValueFrom(this.http.post<{ message: string }>(`${this.baseUrl}/change-password`, IChangePassword, { headers: headers }))
      return Promise.resolve(response.message);
    } catch (error) {
      console.log("Error in changePassword service", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(e);
    }
  }
}