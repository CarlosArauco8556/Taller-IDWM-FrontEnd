import { Component, inject, OnInit } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProduct } from '../../interfaces/IProduct';
import { IQueryParams } from '../../interfaces/IQueryParams';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'app-management-products-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PaginationComponent, ProductCardComponent],
  providers: [ProductManagementService],
  templateUrl: './management-products-page.component.html',
  styleUrl: './management-products-page.component.css'
})
/// <summary>
/// Componente para la página de gestión de productos en la cual se visualizan los productos y se pueden realizar acciones sobre ellos
/// </summary>
export class ManagementProductsPageComponent implements OnInit {
  /// <summary>
  /// Lista de productos
  /// </summary>
  productsList: IProduct[] = [];
  /// <summary>
  /// Servicio de gestión de productos
  /// </summary>
  productManagementService: ProductManagementService = inject(ProductManagementService);
  /// <summary>
  /// Parámetros de la consulta
  /// </summary>
  IQueryParams: IQueryParams = { textFilter: '', pageNumber: 1, pageSize: 10 };
  /// <summary>
  /// Servicio de notificaciones
  /// </summary>
  toastService: ToastService = inject(ToastService);
  /// <summary>
  /// Filtro de nombre de producto
  /// </summary>
  textFilterName: string = '';
  /// <summary>
  /// Lista de errores
  /// </summary
  errors: string[] = [];
  
  /// <summary>
  /// Método que se ejecuta al iniciar el componente
  /// </summary
  ngOnInit() {
    this.getProducts('');
  }
  
  /// <summary>
  /// Método para obtener los productos
  /// </summary>
  /// <param name="input">Filtro de nombre de producto</param>
  async getProducts(input: string){
    this.errors = [];
    try{
      this.textFilterName = input; /// Se asigna el filtro de nombre de producto
      this.IQueryParams.textFilter = this.textFilterName; /// Se asigna el filtro de nombre de producto a los parámetros de la consulta
      const productsObtained = await this.productManagementService.getProducts(this.IQueryParams); /// Se obtienen los productos
      if(productsObtained){ /// Si se obtienen los productos
        this.productsList = productsObtained; /// Se asignan los productos a la lista de productos
        console.log(this.productsList); /// Se imprime la lista de productos
        if (this.productsList.length === 0){ /// Si la lista de productos está vacía
          this.toastService.warning('No se encontraron productos', 2000); /// Se muestra un mensaje de advertencia
        }
      }else{ /// Si no se obtienen los productos
        this.productsList = []; /// Se asigna una lista vacía a la lista de productos
        this.errors = this.productManagementService.errors; /// Se asignan los errores del servicio de gestión de productos a la lista de errores
        const lastError = this.errors[this.errors.length - 1]; /// Se obtiene el último error
        this.toastService.error(lastError || 'Error al obtener los productos'); /// Se muestra un mensaje de error
      }
    }catch(error: any){ /// En caso de error
      this.productsList = []; /// Se asigna una lista vacía a la lista de productos
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Error al obtener usuarios';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Error al obtener usuarios'); /// Se muestra un mensaje de error
      }
      console.log('Error in get users page', error.error); /// Se imprime el error
    }

  }
}
