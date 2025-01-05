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
  imports: [HttpClientModule, CommonModule, PaginationComponent, ProductCardComponent, DatePipe],
  providers: [ProductManagementService],
  templateUrl: './management-products-page.component.html',
  styleUrl: './management-products-page.component.css'
})
export class ManagementProductsPageComponent implements OnInit {
  productsList: IProduct[] = [];
  productManagementService: ProductManagementService = inject(ProductManagementService);
  IQueryParams: IQueryParams = { textFilter: '', pageNumber: 1, pageSize: 10 };
  toastService: ToastService = inject(ToastService);
  textFilterName: string = '';
  errors: string[] = [];
  

  ngOnInit() {
    this.getProducts('');
  }

  async getProducts(input: string){
    this.errors = [];
    try{
      this.textFilterName = input;
      this.IQueryParams.textFilter = this.textFilterName;
      const productsObtained = await this.productManagementService.getProducts(this.IQueryParams);
      if(productsObtained){
        this.productsList = productsObtained;
        console.log(this.productsList);
        if (this.productsList.length === 0){
          this.toastService.warning('No se encontraron productos', 2000);
        }
      }else{
        this.productsList = [];
        this.errors = this.productManagementService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Error al obtener los productos');
      }
    }catch(error: any){
      this.productsList = [];
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Error al obtener usuarios';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Error al obtener usuarios');
      }
      console.log('Error in get users page', error.error);
    }

  }
}
