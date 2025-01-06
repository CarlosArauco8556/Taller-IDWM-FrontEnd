import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IQueryParams } from '../interfaces/IQueryParams';
import { firstValueFrom } from 'rxjs';
import { IGetPurchases } from '../interfaces/IGetPurchases';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

/**
 * Servicio de compras
 */
@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  /**
   * Servicio de almacenamiento local
   */
  localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  /**
   * Url base de la API
   */
  baseUrl =  'http://localhost:5012/api/SaleDisplay/SaleDisplay';
  /**
   * Cliente HTTP
   */
  private http = inject(HttpClient);
  /**
   * Lista de errores
   */
  public errors: string[] = [];
  /**
   * Token de autenticación
   */
  token = this.localStorageServiceService.getVariable('token');

  /**
   * Método para obtener las compras
   * @param iQueryParams Parámetros de la consulta
   * @returns Lista de compras
   */
  async getPurchases(iQueryParams: IQueryParams): Promise<IGetPurchases[]>{
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      let params = new HttpParams()
        if(iQueryParams.isDescendingDate) params = params.set('isDescendingDate', iQueryParams.isDescendingDate.toString());
        if(iQueryParams.userName) params = params.set('userName', iQueryParams.userName);
        if(iQueryParams.page) params = params.set('page', iQueryParams.page.toString());
        if(iQueryParams.pageSize) params = params.set('pageSize', iQueryParams.pageSize.toString());

        const response = await firstValueFrom(this.http.get<IGetPurchases[]>(this.baseUrl, { params: params, headers: headers }));
        return Promise.resolve(response);

    }catch(error: any){
      console.log('Error in getPurchases service', error);

      if(error instanceof HttpErrorResponse){
        const errorMessage =
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Unknown Server Error in getPurchases service';
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }
}
