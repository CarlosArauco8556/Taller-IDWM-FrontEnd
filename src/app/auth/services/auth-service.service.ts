import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LogIn } from '../interfaces/LogIn';
import { AuthInfo } from '../interfaces/AuthInfo';
import { firstValueFrom } from 'rxjs';
import { SignUp } from '../interfaces/SignUp';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  public localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  public token: string = this.localStorageServiceService.getVariable('token') ||'';
  private baseUrl = 'http://localhost:5012/api/Auth';
  private httpclient: HttpClient = inject(HttpClient);
  public errors: string[] = [];


  async login(logIn: LogIn): Promise<AuthInfo> {
    try {
      const response = await firstValueFrom(this.httpclient.post<AuthInfo>(`${this.baseUrl}/login`, logIn));
      return Promise.resolve(response);
    } catch (error) {
      console.log("Error in login service", error);
      this.errors.push((error as any).message);
      return Promise.reject(error);
    }
  }

  async signUp(signUp: SignUp): Promise<AuthInfo> {
    try {
      const response = await firstValueFrom(this.httpclient.post<AuthInfo>(`${this.baseUrl}/register`, signUp));
      return Promise.resolve(response);
    } catch (error) {
      console.log("Error in signUp service", error);
      this.errors.push((error as any).message);
      return Promise.reject(error);
    }
  }

  async logout(): Promise<string> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const response = await firstValueFrom(
        this.httpclient.post<{ message: string }>(`${this.baseUrl}/logout`, {}, { headers: headers })
      );
      
      this.clearAuthData();
      
      return Promise.resolve(response.message);
    } catch (error) {
      console.log("Error in logout service", error);
      
      this.clearAuthData();
      
      if (error instanceof HttpErrorResponse) {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  private clearAuthData(): void {
    this.localStorageServiceService.removeVariable('token');
    this.token = '';
    this.errors = [];
  }
}
