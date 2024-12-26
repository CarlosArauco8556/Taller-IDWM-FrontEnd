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
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6ImIyMDEwMzM5LWUyOGYtNDhlMy1iMDllLTU3ZWY2MjVlMWY2ZiIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTI0MTU1OCwiZXhwIjoxNzM1MzI3OTU4LCJpYXQiOjE3MzUyNDE1NTgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.Nb-k78wO65VVj9ATw_tSaBqxQtlnVfqWAOtskmqXCo_xZ6sFPbZT6bnu7ZrmNGckZfEpLRHEPlmIcU1zpgvu3Q';
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

  async postProduct(IProductEdit: IProductEdit): Promise<IProductEdit[]> {
    try{
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6ImIyMDEwMzM5LWUyOGYtNDhlMy1iMDllLTU3ZWY2MjVlMWY2ZiIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTI0MTU1OCwiZXhwIjoxNzM1MzI3OTU4LCJpYXQiOjE3MzUyNDE1NTgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.Nb-k78wO65VVj9ATw_tSaBqxQtlnVfqWAOtskmqXCo_xZ6sFPbZT6bnu7ZrmNGckZfEpLRHEPlmIcU1zpgvu3Q';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const response = await firstValueFrom( this.http.post<IProductEdit[]>(`${this.baseUrl}/ProductManagement`, IProductEdit, {headers: headers}))
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en postProduct', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async putProduct(id: number): Promise<IProductEdit[]> {
    try{
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6ImIyMDEwMzM5LWUyOGYtNDhlMy1iMDllLTU3ZWY2MjVlMWY2ZiIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTI0MTU1OCwiZXhwIjoxNzM1MzI3OTU4LCJpYXQiOjE3MzUyNDE1NTgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.Nb-k78wO65VVj9ATw_tSaBqxQtlnVfqWAOtskmqXCo_xZ6sFPbZT6bnu7ZrmNGckZfEpLRHEPlmIcU1zpgvu3Q';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const response = await firstValueFrom( this.http.put<IProductEdit[]>(`${this.baseUrl}/ProductManagement/${id}`,{}, {headers: headers}))
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en putProduct', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjZhOWZkODY1LWIzYjQtNGQ3Yy1iODY4LTM3MTgwZDBiMTBlNyIsImp0aSI6ImIyMDEwMzM5LWUyOGYtNDhlMy1iMDllLTU3ZWY2MjVlMWY2ZiIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTI0MTU1OCwiZXhwIjoxNzM1MzI3OTU4LCJpYXQiOjE3MzUyNDE1NTgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwIn0.Nb-k78wO65VVj9ATw_tSaBqxQtlnVfqWAOtskmqXCo_xZ6sFPbZT6bnu7ZrmNGckZfEpLRHEPlmIcU1zpgvu3Q';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/ProductManagement/${id}`, { headers: headers }));
    } catch (error) {
      console.log('Error en deleteProduct', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
}
