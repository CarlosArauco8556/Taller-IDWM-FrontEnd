import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartItem } from '../../interfaces/cartItem';
import { CommonModule } from '@angular/common';
import { UpdateItem } from '../../interfaces/updateItem';
import { Observable } from 'rxjs';
import { CartServiceService } from '../../services/cart-service.service';

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-product.component.html',
  styleUrl: './cart-product.component.css'
})
export class CartProductComponent {
  private cartService = inject(CartServiceService);
  protected cart$ = this.cartService.cart$;

  constructor() {
    this.cartService.getCart().subscribe();
  }

  protected updateQuantity = (cartItem: CartItem, isIncrease: boolean): void => {
    this.cartService.updateProductQuantity(
      cartItem.id,
      isIncrease
    ).subscribe({
      error: (error) => console.error('Error updating quantity:', error)
    });
  }
}
