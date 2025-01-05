import { Component, inject, Input } from '@angular/core';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
/**
 * Componente que muestra la información del carrito
 */
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
  /**
   * Carrito de compras
   */
  protected cart$ = this.cartService.cart$;

  /**
   * Constructor del componente
   * @param router Servicio de enrutamiento de Angular
   */
  constructor(private router: Router) {}

  /**
   * Método que redirige a la página de creación de compra
   */
  goToCreatePurchase(): void {
    this.router.navigate(['/create-purchase']);  
  }
}
