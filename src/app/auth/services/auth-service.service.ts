import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LogIn } from '../interfaces/LogIn';
import { AuthInfo } from '../interfaces/AuthInfo';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

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
}
