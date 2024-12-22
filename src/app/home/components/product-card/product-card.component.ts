import { Component, Input } from '@angular/core';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product: Product;

  constructor() { 
    this.product = {
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

}
