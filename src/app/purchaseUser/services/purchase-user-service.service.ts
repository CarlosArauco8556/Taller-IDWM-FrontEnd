import { inject, Injectable } from '@angular/core';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { INewPurchase } from '../interfaces/INewPurchase';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/// <summary>
/// Servicio para la gestión de compras de usuario
/// Este servicio se encarga de realizar las peticiones al servidor para la gestión de compras de usuario
/// </summary>
export class PurchaseUserServiceService {
  /// <summary>
  /// Clase que se encarga de la gestión de los datos en el local storage
  /// </summary>
  localStorageServiceService: LocalStorageServiceService = new LocalStorageServiceService();
  /// <summary>
  /// Url base de la api
  /// </summary>
  baseUrl = 'http://localhost:5012/api';
  /// <summary>
  /// Cliente http
  /// </summary>
  private http = inject(HttpClient);
  /// <summary>
  /// Lista de errores
  /// </summary>
  public errors: string[] = [];
  /// <summary>
  /// Se obtiene el token del local storage
  /// </summary
  token = this.localStorageServiceService.getVairbel('token');

  /// <summary>
  /// Método para realizar una compra de un producto
  /// </summary>
  /// <param name="newPurchase">Datos de la compra</param>
  async postPurchaseUser(newPurchase: INewPurchase): Promise<number> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`) /// Se crea un objeto de tipo HttpHeaders para enviar el token de autorización
      
      const response = await firstValueFrom(this.http.post<number>(`${this.baseUrl}/Purchase/NewPurchase`, newPurchase, { headers : headers })); /// Se realiza la petición a la api para realizar la compra
      return Promise.resolve(response); /// Se retorna la respuesta
    } catch (error) { /// En caso de error
      if (error instanceof HttpErrorResponse) { /// Si el error es de tipo HttpErrorResponse
        const errorMessage =
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage); /// Se agrega el mensaje de error al array de errores
      }
      return Promise.reject(error); /// Se retorna el error
    }
  }
  /// <summary>
  /// Método para obtener las compras de un usuario
  /// </summary>
  ///param name="purchaseId">Id de la compra</param>
  async getPurchaseUser(purchaseId: number): Promise<Blob> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); /// Se crea un objeto de tipo HttpHeaders para enviar el token de autorización
      const response = await firstValueFrom(this.http.get(`${this.baseUrl}/Purchase/GetPurchaseRecipt/${purchaseId}`, /// Se realiza la petición a la api para obtener la compra
        {headers: headers, responseType: 'blob'})); /// Se indica que el tipo de respuesta es un blob
      return Promise.resolve(response); /// Se retorna la respuesta
    } catch (error) { /// En caso de error
      console.log("Error en getPurchaseUser", error); /// Se imprime el error
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.message;
          this.errors.push(errorMessage); /// Se agrega el mensaje de error al array de errores
        }
        return Promise.reject(error); /// Se retorna el error
    }
  }
  /// <summary>
  /// guarda los errores
  /// </summary>
  getErrors(): string[] {
    return this.errors;
  }


    
}
