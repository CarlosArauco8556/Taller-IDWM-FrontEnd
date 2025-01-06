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
/// <summary>
/// Componente para la tarjeta de producto en la cual se visualiza la información de un producto y se pueden realizar acciones sobre el
/// </summary>
export class ProductCardComponent {
  /// <summary>
  /// Servicio de notificaciones
  /// </summary>
  toastService: ToastService = inject(ToastService);
  /// <summary>
  /// Lista de errores
  /// </summary>
  errors: string[] = [];
  /// <summary>
  /// Parámetros de la consulta
  /// </summary>
  iQueryParams = { textFilter: '', pageNumber: 1, pageSize: 10 };
  /// <summary>
  /// input de tipo IProduct
  /// </summary>
  @Input() product: IProduct;
  /// <summary>
  /// output de tipo IProduct
  /// </summary>
  @Output() onProductUpdated = new EventEmitter<IProduct>();
  /// <summary>
  /// output de tipo number
  /// </summary>
  @Output() onProductDeleted = new EventEmitter<number>();

  /// <summary>
  /// Método constructor
  /// </summary>
  /// <param name="router">Router</param>
  /// <param name="productManagementService">Servicio de gestión de productos</param>
  constructor(private router: Router, private productManagementService: ProductManagementService) { 
    this.product = {
      id: 0, /// Id del producto
      name: '', /// Nombre del producto
      price: 0, /// Precio del producto
      stock: 0, /// Stock del producto
      imageUrl: '', /// Url de la imagen del producto
      productType: { /// Tipo de producto
        id: 0, /// Id del tipo de producto
        name: '' /// Nombre del tipo de producto
      }
    }
    
  }
  /// <summary>
  /// Método para redirigir a la página de edición de producto
  /// </summary>
  /// <param name="productId">Id del producto</param>
  editProduct(productId: number) {
    this.router.navigate([`/edit-product/${productId}`]); /// Se redirige a la página de edición de producto  
  }
  
  /// <summary>
  /// Método para eliminar un producto
  /// </summary>
  /// <param name="productId">Id del producto</param>
  async deleteProduct(productId: number) {
    this.errors = []; /// Se limpian los errores
    try{
      this.onProductDeleted.emit(productId); /// Se emite el evento de eliminación de producto

      const response = await this.productManagementService.deleteProduct(productId); /// Se elimina el producto
      if(response){ /// Si se elimina el producto
        console.log('Producto eliminado con éxito'); /// Se imprime un mensaje de éxito
        this.toastService.success('Producto eliminado con éxito', 2000); /// Se muestra un mensaje de éxito
      }else{
        console.log('Error al eliminar producto', this.productManagementService.errors); /// Se imprime un mensaje de error
        this.errors = this.productManagementService.errors; /// Se asignan los errores del servicio de gestión de productos a la lista de errores
        const lastError = this.errors[this.errors.length - 1]; /// Se obtiene el último error
        this.toastService.error(lastError || 'Error al eliminar producto');  /// Se muestra un mensaje de error
      }
    }catch(error: any){ /// En caso de error
      this.errors = []; /// Se limpian los errores
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Error al eliminar producto';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Error al eliminar producto'); /// Se muestra un mensaje de error
      }
      console.log('Error in delete product page', error.error); /// Se imprime el error
    }
  }
  

}
