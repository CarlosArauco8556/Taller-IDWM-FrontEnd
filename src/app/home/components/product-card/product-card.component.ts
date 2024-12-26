import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product: Product;

  @Output() productForCart = new EventEmitter<Product>();

  showMessage = false;

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

  addProductToCart(): void {
    this.productForCart.emit(this.product);
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

}
