import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IGetUsers } from '../interfaces/IGetUsers';
import { IQueryParams } from '../interfaces/IQueryParams';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';
/**
 * Servicio que se encarga de las operaciones de gestión de usuarios del admin.
 */
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  /**
   * Servicio que gestiona el almacenamiento local.
   */
  localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  /**
   * Url base de la API.
   */
  baseUrl: string = "http://localhost:5012/api/UserManagement";
  /**
   * Cliente HTTP.
   */
  private http = inject(HttpClient);
  /**
   * Lista de errores que se pueden producir al realizar las operaciones de gestión de usuarios.
   */
  public errors: string[] = [];
  /**
   * Token de autenticación.
   */
  token = this.localStorageServiceService.getVariable('token');

  /**
   * Metodo que se encarga de obtener los usuarios. 
   * @param IQueryParams Interfaz que representa los datos necesarios para realizar la consulta de usuarios.
   * @returns Lista de usuarios obtenidos.
   */
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

  /**
   * Metodo que se encarga de cambiar el estado de un usuario.
   * @param email Correo electrónico del usuario.
   * @returns Usuario con el estado cambiado.
   */
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