import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEditProfile } from '../interfaces/IEditProfile';
import { IGetUsers } from '../interfaces/IGetUsers';
import { firstValueFrom } from 'rxjs';
import { IChangePassword } from '../interfaces/IChangePassword';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';
/**
 * Servicio que se encarga de las operaciones de la cuenta de usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  /**
   * Servicio que gestiona el almacenamiento local.
   */
  locaStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  /**
   * Url base de la API.
   */
  baseUrl: string = "http://localhost:5012/api/Account";
  /**
   * Cliente HTTP.
   */
  private http = inject(HttpClient);
  /**
   * Lista de errores que se pueden producir al realizar las operaciones de la cuenta de usuario.
   */
  public errors: string[] = [];
  /**
   * Token de autenticación.
   */
  token = this.locaStorageServiceService.getVariable('token');

  /**
   * Metodo que se encarga de obtener los usuarios.
   * @param IEditProfile Interfaz que representa los datos necesarios para realizar la edición de perfil.
   * @returns Mensaje de éxito o error.
   */
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

  /**
   *  Metodo que se encarga de cambiar la contraseña de un usuario.
   * @param IChangePassword Interfaz que representa los datos necesarios para realizar el cambio de contraseña.
   * @returns Mensaje de éxito o error.
   */
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