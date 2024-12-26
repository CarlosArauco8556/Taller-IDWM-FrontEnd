import { Component, inject } from '@angular/core';
import { CartProductComponent } from "../../components/cart-product/cart-product.component";
import { CartInfoComponent } from "../../components/cart-info/cart-info.component";
import { CartServiceService } from '../../../home/services/cart-service.service';
import { HttpClientModule } from '@angular/common/http';
import { Cart } from '../../../home/interfaces/cart';
import { CartItem } from '../../interfaces/cartItem';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CartProductComponent, CartInfoComponent, CommonModule, HttpClientModule],
  providers: [CartServiceService],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  public cart!: Cart;
  public productsList: CartItem[] = [];
  private cartService: CartServiceService = inject(CartServiceService);

  ngOnInit(): void {
    this.getCartProducts();
  }

  getCartProducts(): void {
    this.cartService.getCart().then((cart) => {
      console.log(cart);
      this.cart = cart;
      for (let i = 0; i < cart.cartItems.length; i++) {
        console.log(cart.cartItems[i]);
        this.productsList.push(cart.cartItems[i]);
      }
        
    }).catch((error) => {
      console.log(error);
    });
  }
}
