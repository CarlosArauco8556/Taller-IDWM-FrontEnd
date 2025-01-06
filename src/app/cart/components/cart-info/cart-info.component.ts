import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Cart } from '../../interfaces/cart';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { CreatePurchaseComponent } from '../../../purchaseUser/pages/create-purchase/create-purchase.component';
import { Router } from '@angular/router';
import { LocalStorageServiceService } from '../../../_shared/services/local-storage-service.service';

@Component({
  selector: 'app-cart-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-info.component.html',
  styleUrl: './cart-info.component.css'
})
export class CartInfoComponent {
  private cartService = inject(CartServiceService);
  private localStorageServiceService = inject(LocalStorageServiceService);
  protected cart$ = this.cartService.cart$;
  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  goToCreatePurchase(): void {
    const token = this.localStorageServiceService.getVariable('token');

    if (!token) {
      this.localStorageServiceService.setVariable('redirectAfterLogin', '/create-purchase');
      this.logInFormIsOpen.emit(true);
      return;
    }

    this.router.navigate(['/create-purchase']);  
  }
}
