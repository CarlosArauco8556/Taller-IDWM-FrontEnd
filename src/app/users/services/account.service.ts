import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEditProfile } from '../interfaces/IEditProfile';
import { IGetUsers } from '../interfaces/IGetUsers';
import { firstValueFrom } from 'rxjs';
import { IChangePassword } from '../interfaces/IChangePassword';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  locaStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  baseUrl: string = "http://localhost:5012/api/Account";
  private http = inject(HttpClient);
  public errors: string[] = [];
  token = this.locaStorageServiceService.getVariable('token');

  async editProfile(IEditProfile: IEditProfile): Promise<string> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
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
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
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