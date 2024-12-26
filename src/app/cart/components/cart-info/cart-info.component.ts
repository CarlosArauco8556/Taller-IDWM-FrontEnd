import { Component, inject, Input } from '@angular/core';
import { Cart } from '../../interfaces/cart';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-info.component.html',
  styleUrl: './cart-info.component.css'
})
export class CartInfoComponent {
  private cartService = inject(CartServiceService);
  protected cart$ = this.cartService.cart$;
}
