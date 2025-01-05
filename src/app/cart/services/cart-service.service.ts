import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../interfaces/cart';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private baseUrl = 'http://localhost:5012/api/ShoppingCart';
  private authBaseUrl = 'http://localhost:5012/api/ShoppingCartForUsers';
  private http: HttpClient = inject(HttpClient);
  private localStorageService: LocalStorageServiceService = inject(LocalStorageServiceService);
  private errors: string[] = [];

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  private httpOptions = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  private textHttpOptions = {
    ...this.httpOptions,
    responseType: 'text' as 'text'
  };

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

  private getValidToken(): string | null {
    const token = this.localStorageService.getVariable('token');
    if (token && this.isTokenValid(token)) {
      return token;
    }
    // Si el token no es válido, se elimina automáticamente en isTokenValid
    return null;
  }

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

  private removeProductFromCartUnauthenticated(productId: number): Observable<string> {
    return this.http.delete(
      `${this.baseUrl}/RemoveFromCart/${productId}`,
      this.textHttpOptions
    ).pipe(
      tap(() => this.refreshCart()),
      catchError(this.handleError)
    );
  }

  private refreshCart(): void {
    this.getCart().subscribe();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    this.errors.push(error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}