import { Component, inject } from '@angular/core';
import { GetPurchasesPageComponent } from '../../pages/get-purchases-page/get-purchases-page.component';
import { CommonModule } from '@angular/common';
/**
 * Componente que representa la paginación de las ventas.
 */
@Component({
  selector: 'purchases-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  /**
   * Componente de la página de ventas
   */
  getPurchasesPage: GetPurchasesPageComponent = inject(GetPurchasesPageComponent);
  /**
   * Página actual
   */
  currentPage: number = 1;

  /**
   * Método para ir a la página anterior.
   */
  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.getPurchasesPage.iQueryParams.page = this.currentPage;
      this.getPurchasesPage.getPurchases(this.getPurchasesPage.textFilterUserName);
    }
  }

  /**
   * Método para ir a la página siguiente.
   */
  nextPage(){
    if(this.getPurchasesPage.purchases.length === 10){
      this.currentPage++;
      this.getPurchasesPage.iQueryParams.page = this.currentPage;
      this.getPurchasesPage.getPurchases(this.getPurchasesPage.textFilterUserName);
    }else{
      this.getPurchasesPage.toastService.info('No hay más ventas', 2000);
    }
  }

  /**
   * Método para ir a una página específica.
   * @param page Página a la que se quiere ir.
   */
  async goToPage(page: number){
    this.currentPage = page;
    this.getPurchasesPage.iQueryParams.page = this.currentPage;
    this.getPurchasesPage.getPurchases(this.getPurchasesPage.textFilterUserName);
  }
}
