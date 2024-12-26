import { Component, inject } from '@angular/core';
import { CartProductComponent } from "../../components/cart-product/cart-product.component";
import { CartInfoComponent } from "../../components/cart-info/cart-info.component";
import { CartServiceService } from '../../services/cart-service.service';
import { HttpClientModule } from '@angular/common/http';
import { Cart } from '../../interfaces/cart';
import { CartItem } from '../../interfaces/cartItem';
import { UpdateItem } from '../../interfaces/updateItem';
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

  public updateItem!: UpdateItem;

  ngOnInit(): void {
    this.getCartProducts();
  }

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
