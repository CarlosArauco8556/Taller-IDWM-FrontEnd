import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IGetUsers } from '../interfaces/IGetUsers';
import { IQueryParams } from '../interfaces/IQueryParams';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  baseUrl: string = "http://localhost:5012/api/UserManagement";
  private http = inject(HttpClient);
  public errors: string[] = [];
  token = this.localStorageServiceService.getVairbel('token');

  async getUsers(IQueryParams: IQueryParams): Promise<IGetUsers[]> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
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
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const response = await firstValueFrom(this.http.post<IGetUsers>(`${this.baseUrl}/ChangeStateUser/${email}`, {}, { headers: headers }))
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