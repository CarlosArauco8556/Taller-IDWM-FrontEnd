import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { QueryParams } from '../interfaces/queryParams';

/**
 * Servicio para obtener productos.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  /**
   * URL base de la API.
   */
  private baseUrl = 'http://localhost:5012/api/Product';
  /**
   * Lista de errores.
   */
  private errors: string[] = [];
  /**
   * Cliente HTTP para realizar solicitudes HTTP.
   */
  private http: HttpClient = inject(HttpClient);

  /**
   * Método para obtener todos los productos disponibles.
   * @param queryParamsI Objeto con los parámetros de consulta. 
   * @returns Retorna una promesa con la lista de productos.
   */
  async getAll(queryParamsI: QueryParams): Promise<Product[]> {
    try {
      // Asegúrate de inicializar correctamente HttpParams
      let queryParams = new HttpParams();
      
      if (queryParamsI.textFilter) queryParams = queryParams.set('textFilter', queryParamsI.textFilter);
      if (queryParamsI.sortByPrice) queryParams = queryParams.set('sortByPrice', queryParamsI.sortByPrice);
      
      if (queryParamsI.IsDescending !== null && queryParamsI.IsDescending !== undefined) {
        queryParams = queryParams.set('IsDescending', queryParamsI.IsDescending.toString());
      }

      if (queryParamsI.productType) queryParams = queryParams.set('productType', queryParamsI.productType);
      if (queryParamsI.pageNumber) queryParams = queryParams.set('pageNumber', queryParamsI.pageNumber.toString());
      if (queryParamsI.pageSize) queryParams = queryParams.set('pageSize', queryParamsI.pageSize.toString());

      const response = await firstValueFrom(this.http.get<Product[]>(`${this.baseUrl}/getAvailableProducts`, { params: queryParams }));
      return response;
      
    } catch (error) {
      console.log('Error en getAll', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
}
