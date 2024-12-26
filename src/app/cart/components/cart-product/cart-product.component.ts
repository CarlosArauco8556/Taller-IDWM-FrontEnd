import { Component, Input } from '@angular/core';
import { Cart } from '../../interfaces/cart';
import { CartItem } from '../../interfaces/cartItem';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-product.component.html',
  styleUrl: './cart-product.component.css'
})
export class CartProductComponent {
  @Input() products!: CartItem[];
}
