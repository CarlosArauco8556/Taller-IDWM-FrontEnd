import { Component, inject } from '@angular/core';
import { CartProductComponent } from "../../components/cart-product/cart-product.component";
import { CartInfoComponent } from "../../components/cart-info/cart-info.component";
import { CartServiceService } from '../../services/cart-service.service';
import { HttpClientModule } from '@angular/common/http';
import { Cart } from '../../interfaces/cart';
import { CartItem } from '../../interfaces/cartItem';
import { UpdateItem } from '../../interfaces/updateItem';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../_shared/components/nav-bar/nav-bar.component';

/**
 * Componente de la página de carrito de compras
 */
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CartProductComponent, CartInfoComponent, CommonModule, HttpClientModule, NavBarComponent],
  providers: [CartServiceService],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  /**
   * Instancia del carrito de compras
   */
  public cart!: Cart;
  /**
   * Lista de productos del carrito
   */
  public productsList: CartItem[] = [];
  /**
   * Servicio de carrito de compras
   */
  private cartService: CartServiceService = inject(CartServiceService);
  /**
   * Servicio de actualización de ítems
   */
  public updateItem!: UpdateItem;

  /**
   * Servicio de eliminación de ítems
   */
  ngOnInit(): void {
    this.getCartProducts();
  }

  /**
   * Método para obtener los productos del carrito
   */
  getCartProducts(): void {
    this.cartService.getCart().subscribe((cart) => {
      console.log(cart);
      this.cart = cart;
      for (let i = 0; i < cart.cartItems.length; i++) {
        console.log(cart.cartItems[i]);
        this.productsList.push(cart.cartItems[i]);
      }
    }, (error) => {
      console.log(error);
    });
  }

}
