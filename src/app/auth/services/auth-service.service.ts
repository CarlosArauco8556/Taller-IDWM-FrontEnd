import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LogIn } from '../interfaces/LogIn';
import { AuthInfo } from '../interfaces/AuthInfo';
import { firstValueFrom } from 'rxjs';
import { SignUp } from '../interfaces/SignUp';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

/**
 * Servicio de autenticación orientado a la autenticación de los usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  /**
   * Servicio de almacenamiento local.
   */
  public localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  /**
   * Token de autenticación.
   */
  public token: string = this.localStorageServiceService.getVariable('token') ||'';
  /**
   * URL base del servicio de autenticación del backend.
   */
  private baseUrl = 'http://localhost:5012/api/Auth';
  /**
   * Cliente HTTP para realizar solicitudes HTTP..
   */
  private httpclient: HttpClient = inject(HttpClient);
  /**
   * Lista de errores.
   */
  public errors: string[] = [];

  /**
   * Método para realizar la autenticación de un usuario mediante una llamada al endpoint de inicio de sesión del backend.
   * @param logIn Objeto con las credenciales del usuario.
   * @returns Una promesa con la información de autenticación.
   */
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

  /**
   * Método para realizar el registro de un usuario mediante una llamada al endpoint de registro del backend.
   * @param signUp Objeto con los datos del usuario a registrar.
   * @returns Una promesa con la información de autenticación.
   */
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

  /**
   * Método para cerrar la sesión de un usuario mediante una llamada al endpoint de cierre de sesión del backend.
   * @returns Una promesa con el mensaje de cierre de sesión.
   */
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

  /**
   * Método para limpiar los datos de autenticación.
   */
  private clearAuthData(): void {
    this.localStorageServiceService.removeVariable('token');
    this.token = '';
    this.errors = [];
  }
}
