import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../interfaces/cart';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

/**
 * Servicio para manejar el carrito de compras.
 */
@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  /**
   * URL base para las peticiones al servidor para usuarios no autenticados.
   */
  private baseUrl = 'http://localhost:5012/api/ShoppingCart';
  /**
   * URL base para las peticiones al servidor para usuarios autenticados.
   */
  private authBaseUrl = 'http://localhost:5012/api/ShoppingCartForUsers';
  /**
   * Instancias de servicios necesarios.
   */
  private http: HttpClient = inject(HttpClient);
  /**
   * Servicio para manejar el almacenamiento local.
   */
  private localStorageService: LocalStorageServiceService = inject(LocalStorageServiceService);
  /**
   * Errores ocurridos durante las peticiones.
   */
  private errors: string[] = [];
  /**
   * Subject para emitir el carrito de compras.
   */
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  /**
   * Observable para obtener el carrito de compras.
   */
  cart$ = this.cartSubject.asObservable();
  
  /**
   * Opciones para las peticiones HTTP.
   */
  private httpOptions = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  /**
   * Opciones para las peticiones HTTP que esperan una respuesta de texto.
   */
  private textHttpOptions = {
    ...this.httpOptions,
    responseType: 'text' as 'text'
  };

  /**
   * Método para verificar si un token es válido.
   * @param token Objeto token a verificar.
   * @returns Verdadero si el token es válido, falso en caso contrario.
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && currentTime > payload.exp) {
        this.localStorageService.removeVariable('token');
        return false;
      }
      
      return true;
    } catch {
      this.localStorageService.removeVariable('token');
      return false;
    }
  }

  /**
   * Método para obtener un token válido.
   * @returns Token válido o nulo si no hay token o no es válido.
   */
  private getValidToken(): string | null {
    const token = this.localStorageService.getVariable('token');
    if (token && this.isTokenValid(token)) {
      return token;
    }
    // Si el token no es válido, se elimina automáticamente en isTokenValid
    return null;
  }

  /**
   * Método para obtener el carrito de compras.
   * @returns Observable con el carrito de compras.
   */
  getCart(): Observable<Cart> {
    const token = this.getValidToken();

    if (token) {
      console.log('autenticado:', token);
      return this.http.get<Cart>(
        `${this.authBaseUrl}/ProductsInCart`,
        {
          ...this.httpOptions,
          headers: {
            ...this.httpOptions.headers,
            'Authorization': `Bearer ${token}`
          }
        }
      ).pipe(
        tap(cart => this.cartSubject.next(cart)),
        catchError(error => {
          // Si hay un error de autorización, intentamos la versión sin autenticar
          if (error.status === 401) {
            return this.getUnauthenticatedCart();
          }
          return this.handleError(error);
        })
      );
    }

    return this.getUnauthenticatedCart();
  }

  /**
   * Método para obtener el carrito de compras sin autenticación.
   * @returns Observable con el carrito de compras.
   */
  private getUnauthenticatedCart(): Observable<Cart> {
    console.log('no autenticado');
    return this.http.get<Cart>(
      `${this.baseUrl}/ProductsInCart`, 
      this.httpOptions
    ).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  /**
   * Método para agregar un producto al carrito de compras.
   * @param productId Id del producto a agregar.
   * @param quantity Cantidad del producto a agregar.
   * @returns Observable con la respuesta del servidor.
   */
  addProductToCart(productId: number, quantity: number): Observable<string> {
    const token = this.getValidToken();

    if (token) {
      console.log('autenticado:', token);
      return this.http.post(
        `${this.authBaseUrl}/AddTocart/${productId}/${quantity}`,
        null,
        {
          ...this.textHttpOptions,
          headers: {
            ...this.textHttpOptions.headers,
            'Authorization': `Bearer ${token}`
          }
        }
      ).pipe(
        tap(() => this.refreshCart()),
        catchError(error => {
          if (error.status === 401) {
            return this.addProductToCartUnauthenticated(productId, quantity);
          }
          return this.handleError(error);
        })
      );
    }

    return this.addProductToCartUnauthenticated(productId, quantity);
  }

  /**
   * Método para agregar un producto al carrito de compras sin autenticación.
   * @param productId Id del producto a agregar.
   * @param quantity Cantidad del producto a agregar.
   * @returns Observable con la respuesta del servidor.
   */
  private addProductToCartUnauthenticated(productId: number, quantity: number): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/AddTocart/${productId}/${quantity}`,
      null,
      this.textHttpOptions
    ).pipe(
      tap(() => this.refreshCart()),
      catchError(this.handleError)
    );
  }

  /**
   * Método para actualizar la cantidad de un producto en el carrito de compras.
   * @param productId Id del producto a actualizar.
   * @param isIncrement Booleano que indica si se incrementa o decrementa la cantidad.
   * @returns Observable con la respuesta del servidor.
   */
  updateProductQuantity(productId: number, isIncrement: boolean): Observable<string> {
    const token = this.getValidToken();

    if (token) {
      console.log('autenticado:', token);
      return this.http.put(
        `${this.authBaseUrl}/UpdateCart/${productId}/${1}?isIncrement=${isIncrement}`,
        null,
        {
          ...this.textHttpOptions,
          headers: {
            ...this.textHttpOptions.headers,
            'Authorization': `Bearer ${token}`
          }
        }
      ).pipe(
        tap(() => this.refreshCart()),
        catchError(error => {
          if (error.status === 401) {
            return this.updateProductQuantityUnauthenticated(productId, isIncrement);
          }
          return this.handleError(error);
        })
      );
    }

    return this.updateProductQuantityUnauthenticated(productId, isIncrement);
  }

  /**
   * Método para actualizar la cantidad de un producto en el carrito de compras sin autenticación.
   * @param productId Id del producto a actualizar.
   * @param isIncrement Booleano que indica si se incrementa o decrementa la cantidad.
   * @returns Observable con la respuesta del servidor.
   */
  private updateProductQuantityUnauthenticated(productId: number, isIncrement: boolean): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/UpdateCart/${productId}/${1}?isIncrement=${isIncrement}`,
      null,
      this.textHttpOptions
    ).pipe(
      tap(() => this.refreshCart()),
      catchError(this.handleError)
    );
  }

  /**
   * Método para eliminar un producto del carrito de compras.
   * @param productId Id del producto a eliminar.
   * @returns Observable con la respuesta del
   */
  removeProductFromCart(productId: number): Observable<string> {
    const token = this.getValidToken();

    if (token) {
      console.log('autenticado:', token);
      return this.http.delete(
        `${this.authBaseUrl}/RemoveFromCart/${productId}`,
        {
          ...this.textHttpOptions,
          headers: {
            ...this.textHttpOptions.headers,
            'Authorization': `Bearer ${token}`
          }
        }
      ).pipe(
        tap(() => this.refreshCart()),
        catchError(error => {
          if (error.status === 401) {
            return this.removeProductFromCartUnauthenticated(productId);
          }
          return this.handleError(error);
        })
      );
    }

    return this.removeProductFromCartUnauthenticated(productId);
  }

  /**
   * Método para eliminar un producto del carrito de compras sin autenticación.
   * @param productId Id del producto a eliminar.
   * @returns Observable con la respuesta del servidor.
   */
  private removeProductFromCartUnauthenticated(productId: number): Observable<string> {
    return this.http.delete(
      `${this.baseUrl}/RemoveFromCart/${productId}`,
      this.textHttpOptions
    ).pipe(
      tap(() => this.refreshCart()),
      catchError(this.handleError)
    );
  }

  /**
   * Método para refrescar el carrito de compras.
   * @returns Observable con la respuesta del servidor.
   */
  private refreshCart(): void {
    this.getCart().subscribe();
  }

  /**
   * Método para manejar errores en las peticiones HTTP.
   * @param error Error ocurrido. 
   * @returns Arrojar un error.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    this.errors.push(error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}