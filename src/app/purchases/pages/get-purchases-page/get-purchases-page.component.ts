import { Component, inject, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { IGetPurchases } from '../../interfaces/IGetPurchases';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { IQueryParams } from '../../interfaces/IQueryParams';
/**
 * Componente para obtener las ventas
 */
@Component({
  selector: 'get-purchases-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PaginationComponent],
  providers: [PurchaseService],
  templateUrl: './get-purchases-page.component.html',
  styleUrl: './get-purchases-page.component.css'
})
export class GetPurchasesPageComponent implements OnInit{
  /**
   * Servicio de compras
   */
  purchaseService: PurchaseService = inject(PurchaseService);
  /**
   * Servicio de notificaciones
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Lista de compras
   */
  purchases: IGetPurchases[] = [];
  /**
   * Filtro de nombre de usuario
   */
  textFilterUserName: string = '';
  /**
   * Set de compras visibles
   */
  visibleSaleItems = new Set<number>();
  /**
   * Parámetros de la consulta
   */
  iQueryParams: IQueryParams = {
    isDescendingDate: null,
    userName: '',
    page: 1,
    pageSize: 10
  };
  /**
   * Lista de errores
   */
  errors: string[] = []

  /**
   * Método para inicializar el componente
   */
  ngOnInit(){
    this.getPurchases('');
  }
  
  /**
   * Método para obtener las ventas
   * @param input Filtro de nombre de usuario
   */
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

  /**
   * Método para cambiar el filtro de orden
   * @param event Evento de cambio de filtro
   */
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

  /**
   *  Método para mostrar u ocultar los items de venta
   * @param purchaseId ID de la compra
   */
  toggleSaleItems(purchaseId: number): void {
    if (this.visibleSaleItems.has(purchaseId)) {
      this.visibleSaleItems.delete(purchaseId);
    } else {
      this.visibleSaleItems.add(purchaseId);
    }
  }

  /**
   * Método para verificar si los items de venta son visibles
   * @param purchaseId ID de la compra
   * @returns Si los items de venta son visibles
   */
  isSaleItemsVisible(purchaseId: number): boolean {
    return this.visibleSaleItems.has(purchaseId);
  }

  /**
   * Método para formatear la moneda
   * @param value Valor a formatear
   * @returns Valor formateado
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  }
}