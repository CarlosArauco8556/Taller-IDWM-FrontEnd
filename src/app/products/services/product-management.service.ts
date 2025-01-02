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
      if(error instanceof HttpErrorResponse)
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.message;
          this.errors.push(errorMessage);
        }
        return Promise.reject(error);
    }
  }

  async postProduct(iProductAdd: IProductEdit): Promise<IProduct> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const response = await firstValueFrom( this.http.post<IProduct>(`${this.baseUrl}/ProductManagement`, iProductAdd, {headers: headers}))
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en postProduct service', error);
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  async putProduct(id: number, iProductEdit: IProductEdit): Promise<IProduct> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const response = await firstValueFrom( this.http.put<IProduct>(`${this.baseUrl}/ProductManagement/${id}`, iProductEdit, {headers: headers}))
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en putProduct service', error);
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  async deleteProduct(id: number): Promise<IProduct> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const response = await firstValueFrom(this.http.delete<IProduct>(`${this.baseUrl}/ProductManagement/${id}`, { headers: headers }));
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en deleteProduct service', error);
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  getErrors(): string[] {
    return this.errors;
  }
}
