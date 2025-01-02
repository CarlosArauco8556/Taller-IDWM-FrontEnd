import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IProduct } from '../../interfaces/IProduct';
import { ProductManagementService } from '../../services/product-management.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../_shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  providers: [ProductManagementService],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  toastService: ToastService = inject(ToastService);
  errors: string[] = [];
  iQueryParams = { textFilter: '', pageNumber: 1, pageSize: 10 };
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
  

  async deleteProduct(productId: number) {
    this.errors = [];
    try{
      this.onProductDeleted.emit(productId);

      const response = await this.productManagementService.deleteProduct(productId);
      if(response){
        console.log('Producto eliminado con éxito');
        this.toastService.success('Producto eliminado con éxito', 2000);
      }else{
        console.log('Error al eliminar producto', this.productManagementService.errors);
        this.errors = this.productManagementService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Error al eliminar producto');
      }
    }catch(error: any){
      this.errors = [];
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Error al eliminar producto';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Error al eliminar producto');
      }
      console.log('Error in delete product page', error.error);
    }
  }
  

}
