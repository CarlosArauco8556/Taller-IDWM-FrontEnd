import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IGetUsers } from '../interfaces/igetUsers';
import { IQueryParams } from '../interfaces/IQueryParams';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  baseUrl: string = "http://localhost:5012/api/UserManagement";
  private http = inject(HttpClient);
  public errors: string[] = [];

  async getUsers(IQueryParams: IQueryParams): Promise<IGetUsers[]> {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvczUxMzJmY0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiY2FybG9zNTEzMmZjQGdtYWlsLmNvbSIsIm5hbWVpZCI6ImMyMDVkY2QxLTE5NmEtNGNiMi1hMjZhLTBmMDFmZTM5OWFhYyIsImp0aSI6Ijc4NzBmNWFjLTRlYzMtNGVlNy04NmExLTc5M2JhN2ZiYjQ0MyIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM0NzExODgzLCJleHAiOjE3MzQ3OTgyODMsImlhdCI6MTczNDcxMTg4MywiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.lwwNdptdI6X1sgBRNqjvr2SDK3TsVxWAaxB3v45Daw_tqzaLfg4C-h-qvOhSvMSNgwGIO3IyC8ZmmZexIRFG9g';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      let params = new HttpParams()
      if (IQueryParams.name) params = params.set('name', IQueryParams.name);
      if (IQueryParams.page) params = params.set('page', IQueryParams.page.toString());
      if (IQueryParams.pageSize) params = params.set('pageSize', IQueryParams.pageSize.toString());

      const response = await firstValueFrom(this.http.get<IGetUsers[]>(`${this.baseUrl}/GetUsers`, { params: params, headers: headers }))
      return Promise.resolve(response);
    } catch (error) {
      console.log("Error in getUsers service", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(e);
    }

  }

  async changeState(email: string): Promise<IGetUsers> {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcmxvczUxMzJmY0BnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiY2FybG9zNTEzMmZjQGdtYWlsLmNvbSIsIm5hbWVpZCI6ImMyMDVkY2QxLTE5NmEtNGNiMi1hMjZhLTBmMDFmZTM5OWFhYyIsImp0aSI6Ijc4NzBmNWFjLTRlYzMtNGVlNy04NmExLTc5M2JhN2ZiYjQ0MyIsInJvbGUiOiJVc2VyIiwibmJmIjoxNzM0NzExODgzLCJleHAiOjE3MzQ3OTgyODMsImlhdCI6MTczNDcxMTg4MywiaXNzIjoiaGh0cHM6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6ImhodHBzOi8vbG9jYWxob3N0OjUwMCJ9.lwwNdptdI6X1sgBRNqjvr2SDK3TsVxWAaxB3v45Daw_tqzaLfg4C-h-qvOhSvMSNgwGIO3IyC8ZmmZexIRFG9g';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await firstValueFrom(this.http.post<IGetUsers>(`${this.baseUrl}/ChangeStateUser/${email}`, { headers: headers }))
      return Promise.resolve(response);
    } catch (error) {
      console.log("Error in changeState service", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(e)
    }
  }
}