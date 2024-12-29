import { Component, inject } from '@angular/core';
import { GetPurchasesPageComponent } from '../../pages/get-purchases-page/get-purchases-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'purchases-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  getPurchasesPage: GetPurchasesPageComponent = inject(GetPurchasesPageComponent);
  currentPage: number = 1;

  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.getPurchasesPage.iQueryParams.page = this.currentPage;
      this.getPurchasesPage.getPurchases(this.getPurchasesPage.textFilterUserName);
    }
  }

  nextPage(){
    if(this.getPurchasesPage.purchases.length === 10){
      this.currentPage++;
      this.getPurchasesPage.iQueryParams.page = this.currentPage;
      this.getPurchasesPage.getPurchases(this.getPurchasesPage.textFilterUserName);
    }else{
      this.getPurchasesPage.toastService.info('No hay más ventas', 2000);
    }
  }

  async goToPage(page: number){
    this.currentPage = page;
    this.getPurchasesPage.iQueryParams.page = this.currentPage;
    this.getPurchasesPage.getPurchases(this.getPurchasesPage.textFilterUserName);
  }
}
