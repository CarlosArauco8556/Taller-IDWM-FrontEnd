import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IQueryParams } from '../interfaces/IQueryParams';
import { IProduct } from '../interfaces/IProduct';
import { firstValueFrom } from 'rxjs';
import { IProductEdit } from '../interfaces/IProductEdit';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  private baseUrl = 'http://localhost:5012/api';
  private errors: string[] = [];
  private http: HttpClient = inject(HttpClient);

  

  async getProducts(IQueryParams: IQueryParams): Promise<IProduct[]> {
    try{
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6Ijg0NjkwNTBjLTMyMmMtNDJkZC05MDNjLTNmYTc4YjRkNzU5ZSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTMyODk2MywiZXhwIjoxNzM1NDE1MzYzLCJpYXQiOjE3MzUzMjg5NjMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.ipUb5FNrHbb_nYm66uTRbHO8mXD0NO5wWpC7Wppyzznozjr2Xo6QWgUfYXeN71Djw8qrYF2IVxOYVEV5UQA8gQ';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      let params = new HttpParams()
      if(IQueryParams.textFilter) params = params.set('textFilter', IQueryParams.textFilter);
      if(IQueryParams.pageNumber) params = params.set('pageNumber', IQueryParams.pageNumber.toString());
      if(IQueryParams.pageSize) params = params.set('pageSize', IQueryParams.pageSize.toString());

      const response = await firstValueFrom( this.http.get<IProduct[]>(`${this.baseUrl}/ProductManagement`, {params: params, headers: headers }))
      return Promise.resolve(response);
      
    } catch (error) {
      console.log('Error en getProducts', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async postProduct(formData: FormData): Promise<IProductEdit[]> {
    try{
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6Ijg0NjkwNTBjLTMyMmMtNDJkZC05MDNjLTNmYTc4YjRkNzU5ZSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTMyODk2MywiZXhwIjoxNzM1NDE1MzYzLCJpYXQiOjE3MzUzMjg5NjMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.ipUb5FNrHbb_nYm66uTRbHO8mXD0NO5wWpC7Wppyzznozjr2Xo6QWgUfYXeN71Djw8qrYF2IVxOYVEV5UQA8gQ';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const response = await firstValueFrom( this.http.post<IProductEdit[]>(`${this.baseUrl}/ProductManagement`, formData, {headers: headers}))
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en postProduct', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async putProduct(id: number, formData: FormData): Promise<IProductEdit> {
    try{
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6Ijg0NjkwNTBjLTMyMmMtNDJkZC05MDNjLTNmYTc4YjRkNzU5ZSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTMyODk2MywiZXhwIjoxNzM1NDE1MzYzLCJpYXQiOjE3MzUzMjg5NjMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.ipUb5FNrHbb_nYm66uTRbHO8mXD0NO5wWpC7Wppyzznozjr2Xo6QWgUfYXeN71Djw8qrYF2IVxOYVEV5UQA8gQ';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const response = await firstValueFrom( this.http.put<IProductEdit>(`${this.baseUrl}/ProductManagement/${id}`, formData, {headers: headers}))
      return response;
    } catch (error) {
      console.log('Error en putProduct', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6Ijg0NjkwNTBjLTMyMmMtNDJkZC05MDNjLTNmYTc4YjRkNzU5ZSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTMyODk2MywiZXhwIjoxNzM1NDE1MzYzLCJpYXQiOjE3MzUzMjg5NjMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.ipUb5FNrHbb_nYm66uTRbHO8mXD0NO5wWpC7Wppyzznozjr2Xo6QWgUfYXeN71Djw8qrYF2IVxOYVEV5UQA8gQ';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

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
