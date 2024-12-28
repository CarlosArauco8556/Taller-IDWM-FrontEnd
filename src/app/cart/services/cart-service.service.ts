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

  getCart(): Observable<Cart> {

    const token = this.localStorageService.getVairbel('token');

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
        catchError(this.handleError)
      );
    }

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

    const token = this.localStorageService.getVairbel('token');

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
        catchError(this.handleError)
      );
    }

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

    const token = this.localStorageService.getVairbel('token');

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
        catchError(this.handleError)
      );
    }

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

    const token = this.localStorageService.getVairbel('token');

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
        catchError(this.handleError)
      );
    }

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