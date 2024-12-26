import { Component, Input } from '@angular/core';
import { Cart } from '../../../home/interfaces/cart';

@Component({
  selector: 'app-cart-info',
  standalone: true,
  imports: [],
  templateUrl: './cart-info.component.html',
  styleUrl: './cart-info.component.css'
})
export class CartInfoComponent {
  @Input() cart!: Cart;
}
