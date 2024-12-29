import { Component, inject, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { IGetPurchases } from '../../interfaces/IGetPurchases';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { IQueryParams } from '../../interfaces/IQueryParams';

@Component({
  selector: 'get-purchases-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PaginationComponent],
  providers: [PurchaseService],
  templateUrl: './get-purchases-page.component.html',
  styleUrl: './get-purchases-page.component.css'
})
export class GetPurchasesPageComponent implements OnInit{
  purchaseService: PurchaseService = inject(PurchaseService);
  toastService: ToastService = inject(ToastService);
  purchases: IGetPurchases[] = [];
  textFilterUserName: string = '';
  visibleSaleItems = new Set<number>();
  iQueryParams: IQueryParams = {
    isDescendingDate: null,
    userName: '',
    page: 1,
    pageSize: 10
  };
  errors: string[] = []

  ngOnInit(){
    this.getPurchases('');
  }
  
  async getPurchases(input: string){
    this.errors = [];
    try{
      this.textFilterUserName = input;
      this.iQueryParams.userName = this.textFilterUserName;
      const purchasesObtained = await this.purchaseService.getPurchases(this.iQueryParams);
      if(purchasesObtained){
        this.purchases = purchasesObtained;
        console.log(this.purchases);
        if(this.purchases.length === 0){
          this.toastService.warning('No se encontraron ventas', 2000);
        }
      }else{
        this.purchases = [];
        this.errors = this.purchaseService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Error al obtener las ventas');
      }  
    }catch(error: any){
      this.purchases = [];
      if(error instanceof HttpErrorResponse){
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Error al obtener ventas';
        this.errors.push(errorMessage || 'Error al obtener ventas');
        this.toastService.error(errorMessage);
      }
      console.log('Error in getPurchasesPage', error);
    }
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    switch (value) {
      case 'true':
        this.iQueryParams.isDescendingDate = true;
        this.getPurchases(this.textFilterUserName);
        break;
      case 'false':
        this.iQueryParams.isDescendingDate = false;
        this.getPurchases(this.textFilterUserName);
        break;
      case 'null':
        this.iQueryParams.isDescendingDate = null;
        this.getPurchases(this.textFilterUserName);
        break;
      default:
      break;
    }
  }

  toggleSaleItems(purchaseId: number): void {
    if (this.visibleSaleItems.has(purchaseId)) {
      this.visibleSaleItems.delete(purchaseId);
    } else {
      this.visibleSaleItems.add(purchaseId);
    }
  }

  isSaleItemsVisible(purchaseId: number): boolean {
    return this.visibleSaleItems.has(purchaseId);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  }
}