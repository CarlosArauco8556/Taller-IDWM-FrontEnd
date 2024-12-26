import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart, CartItem } from '../interfaces/cart';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private baseUrl = 'http://localhost:5012/api/ShoppingCart';
  private http: HttpClient = inject(HttpClient);
  private errors: string[] = [];

  // BehaviorSubject para mantener el estado del carrito
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
    return this.http.get<Cart>(
      `${this.baseUrl}/ProductsInCart`, 
      this.httpOptions
    ).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  addProductToCart(productId: number, quantity: number): Observable<string> {
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
    return this.http.put(
      `${this.baseUrl}/UpdateCart/${productId}/${1}?isIncrement=${isIncrement}`,
      null,
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