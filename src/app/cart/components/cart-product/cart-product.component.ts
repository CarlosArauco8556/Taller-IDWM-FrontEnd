import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartItem } from '../../interfaces/cartItem';
import { CommonModule } from '@angular/common';
import { UpdateItem } from '../../interfaces/updateItem';
import { Observable } from 'rxjs';
import { CartServiceService } from '../../services/cart-service.service';

/**
 * Componente que muestra la información de un producto en el carrito.
 */
@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-product.component.html',
  styleUrl: './cart-product.component.css'
})
export class CartProductComponent {
  /**
   * Servicio que se encarga de gestionar el carrito.
   */
  private cartService = inject(CartServiceService);
  /**
   * Carrito del usuario.
   */
  protected cart$ = this.cartService.cart$;
  
  /**
   * 
   */
  constructor() {
    this.cartService.getCart().subscribe();
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param cartItem Producto a actualizar.
   * @param isIncrease Indica si la cantidad se incrementa o decrementa.
   */
  protected updateQuantity = (cartItem: CartItem, isIncrease: boolean): void => {
    this.cartService.updateProductQuantity(
      cartItem.id,
      isIncrease
    ).subscribe({
      error: (error) => console.error('Error updating quantity:', error)
    });
  }

  /**
   * Método que elimina un producto del carrito.
   * @param cartItem Producto a eliminar.
   */
  protected removeItem = (cartItem: CartItem): void => {
    this.cartService.removeProductFromCart(cartItem.id).subscribe({
      error: (error) => console.error('Error removing item:', error)
    });
  }
}
