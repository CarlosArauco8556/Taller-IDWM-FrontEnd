import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IGetUsers } from '../interfaces/IGetUsers';
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
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjA3ZTIyNzU0LWNhMjItNDQ5My1iMmZhLTM3ODZjNDRjNWE4MiIsImp0aSI6ImU2MDQ5YzUwLThkMTQtNGQ4Mi04MWNjLTIyMDIwYjg4MDFiOSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNDk2ODE0MSwiZXhwIjoxNzM1MDU0NTQxLCJpYXQiOjE3MzQ5NjgxNDEsImlzcyI6ImhodHBzOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJoaHRwczovL2xvY2FsaG9zdDo1MDAifQ.MQr5GjJS_1CyVi5EGEa0ItT1XiXTho-kzbsNINS00-dZggZUKeRsI902XKEeN4VDDjQRuhyZ0l6qLt8PsF2_SQ';
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
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjA3ZTIyNzU0LWNhMjItNDQ5My1iMmZhLTM3ODZjNDRjNWE4MiIsImp0aSI6ImU2MDQ5YzUwLThkMTQtNGQ4Mi04MWNjLTIyMDIwYjg4MDFiOSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNDk2ODE0MSwiZXhwIjoxNzM1MDU0NTQxLCJpYXQiOjE3MzQ5NjgxNDEsImlzcyI6ImhodHBzOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJoaHRwczovL2xvY2FsaG9zdDo1MDAifQ.MQr5GjJS_1CyVi5EGEa0ItT1XiXTho-kzbsNINS00-dZggZUKeRsI902XKEeN4VDDjQRuhyZ0l6qLt8PsF2_SQ';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await firstValueFrom(this.http.post<IGetUsers>(`${this.baseUrl}/ChangeStateUser/${email}`, { headers: headers }))
      return Promise.resolve(response);
    } catch (error) {
      console.log("Error in changeState service.", error);

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