import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';

/**
 * Componente que representa la tarjeta de un producto
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  /**
   * Producto a mostrar en la tarjeta
   */
  @Input() product: Product;
  /**
   * Evento que se emite cuando se agrega un producto al carrito
   */
  @Output() productForCart = new EventEmitter<Product>();
  /**
   * Indica si se muestra el mensaje de producto agregado al carrito
   */
  showMessage = false;

  /**
   * Constructor del componente
   */
  constructor() { 
    this.product = {
      id: 0,
      name: '',
      price: 0,
      stock: 0,
      imageUrl: '',
      productType: {
        id: 0,
        name: ''
      }
    } 
  }

  /**
   * Método que se ejecuta cuando se agrega un producto al carrito
   */
  addProductToCart(): void {
    this.productForCart.emit(this.product);
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

}
