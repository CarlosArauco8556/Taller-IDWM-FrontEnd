import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../interfaces/cart';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private baseUrl = 'http://localhost:5012/api/ShoppingCart';
  private http: HttpClient = inject(HttpClient);
  private errors: string[] = [];

  private httpOptions = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Opciones específicas para respuestas de texto
  private textHttpOptions = {
    ...this.httpOptions,
    responseType: 'text' as 'text'  // Esto es crucial para manejar respuestas de texto
  };

  async getCart(): Promise<Cart> {
    try {
      const response = await firstValueFrom(
        this.http.get<Cart>(
          `${this.baseUrl}/ProductsInCart`, 
          this.httpOptions
        )
      );
      return response;
    } catch (error) {
      console.log('Error en getCart', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async addProductToCart(productId: number, quantity: number): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/AddTocart/${productId}/${quantity}`,
          null,
          this.textHttpOptions  // Usamos las opciones para texto
        )
      );
      return response;
    } catch (error) {
      console.log('Error en addProductToCart', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
}
