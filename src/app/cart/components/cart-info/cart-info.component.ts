import { Component, inject, Input } from '@angular/core';
import { Cart } from '../../interfaces/cart';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { CreatePurchaseComponent } from '../../../purchaseUser/pages/create-purchase/create-purchase.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-info',
  standalone: true,
  imports: [CommonModule, CreatePurchaseComponent],
  templateUrl: './cart-info.component.html',
  styleUrl: './cart-info.component.css'
})
export class CartInfoComponent {
  private cartService = inject(CartServiceService);
  protected cart$ = this.cartService.cart$;

  constructor(private router: Router) {}

  goToCreatePurchase(): void {
    this.router.navigate(['/create-purchase']);  
  }
}
