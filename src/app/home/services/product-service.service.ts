import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  private baseUrl = 'http://localhost:5012/api/Product';
  private errors: string[] = [];
  private http: HttpClient = inject(HttpClient);

  async getAll(): Promise<Product[]> {
    try {
      const response = await firstValueFrom(this.http.get<Product[]>(`${this.baseUrl}/getAvailableProducts`));
      return Promise.resolve(response);
    } catch (error) {
      console.log('Error en getAll', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
}
