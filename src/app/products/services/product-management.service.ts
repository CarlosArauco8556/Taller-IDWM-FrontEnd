import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IQueryParams } from '../interfaces/IQueryParams';
import { IProduct } from '../interfaces/IProduct';
import { firstValueFrom } from 'rxjs';
import { IProductEdit } from '../interfaces/IProductEdit';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {
  public localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  private baseUrl = 'http://localhost:5012/api';
  public errors: string[] = [];
  private http: HttpClient = inject(HttpClient);
  token = this.localStorageServiceService.getVairbel('token');

  

  async getProducts(IQueryParams: IQueryParams): Promise<IProduct[]> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      let params = new HttpParams()
      if(IQueryParams.textFilter) params = params.set('textFilter', IQueryParams.textFilter);
      if(IQueryParams.pageNumber) params = params.set('pageNumber', IQueryParams.pageNumber.toString());
      if(IQueryParams.pageSize) params = params.set('pageSize', IQueryParams.pageSize.toString());

      const response = await firstValueFrom( this.http.get<IProduct[]>(`${this.baseUrl}/ProductManagement`, {params: params, headers: headers }))
      return Promise.resolve(response);
      
    } catch (error) {
      console.log('Error en getProducts service', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(e);
    }
  }
  async validateProductNameAndType(name: string, productTypeId: number): Promise<boolean> {
    try {
      const queryParams: IQueryParams = {
        textFilter: '',
        pageNumber: 1,
        pageSize: 1000
      };

      const products = await this.getProducts(queryParams);
      
      return products.some(product => 
        product.name.toLowerCase() === name.toLowerCase() && 
        product.productType.id === productTypeId
      );
    } catch (error) {
      console.error('Error validating product:', error);
      throw error;
    }
  }
  
  

  async postProduct(formData: FormData): Promise<IProductEdit[]> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      const response = await firstValueFrom( this.http.post<IProductEdit[]>(`${this.baseUrl}/ProductManagement`, formData, {headers: headers}))
      return response;
    } catch (error) {
      if(error instanceof HttpErrorResponse)
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.message;
          this.errors.push(errorMessage);
        }
        return Promise.reject(error);
      }
  }

  async putProduct(id: number, formData: FormData): Promise<IProductEdit> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      const response = await firstValueFrom( this.http.put<IProductEdit>(`${this.baseUrl}/ProductManagement/${id}`, formData, {headers: headers}))
      return response;
    } catch (error) {
      if(error instanceof HttpErrorResponse)
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.message;
          this.errors.push(errorMessage);
        }
        return Promise.reject(error);
      }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/ProductManagement/${id}`, { headers: headers }));
    } catch (error) {
      console.log('Error en deleteProduct', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
  getErrors(): string[] {
    return this.errors;
  }
}
