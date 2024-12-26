import { Component } from '@angular/core';
import { CartProductComponent } from "../../components/cart-product/cart-product.component";
import { CartInfoComponent } from "../../components/cart-info/cart-info.component";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CartProductComponent, CartInfoComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {

}
