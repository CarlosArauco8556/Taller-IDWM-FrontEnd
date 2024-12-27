import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../interfaces/IProduct';
import { ProductManagementService } from '../../services/product-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  providers: [ProductManagementService],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product: IProduct;
  @Output() onProductUpdated = new EventEmitter<IProduct>();
  @Output() onProductDeleted = new EventEmitter<number>();

  constructor(private router: Router, private productManagementService: ProductManagementService) { 
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
  editProduct(productId: number) {
    this.router.navigate([`/edit-product/${productId}`]);  
  }
  

  deleteProduct(productId: number) {
  
    this.onProductDeleted.emit(productId);

    this.productManagementService.deleteProduct(productId)
      .then(response => {
        console.log('Producto eliminado exitosamente:', response);
      })
      .catch(error => {
        console.log('Error al eliminar el producto:', error);
      });
  }
  

}
