import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Cart } from '../../interfaces/cart';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule } from '@angular/common';
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
  /**
   * Inyección del servicio de carrito
   */
  private cartService = inject(CartServiceService);
  private localStorageServiceService = inject(LocalStorageServiceService);
  protected cart$ = this.cartService.cart$;
  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Constructor del componente
   * @param router Servicio de enrutamiento de Angular
   */
  constructor(private router: Router) {}

  /**
   * Método que redirige a la página de creación de compra
   */
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
