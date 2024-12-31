import { Component, inject } from '@angular/core';
import { ManagementProductsPageComponent } from '../../pages/management-products-page/management-products-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  public managementProductsPageComponents: ManagementProductsPageComponent = inject(ManagementProductsPageComponent);
  currentPage: number = 1;
  
    previousPage(){
      if(this.currentPage > 1){
        this.currentPage--;
        this.managementProductsPageComponents.IQueryParams.pageNumber= this.currentPage;
        this.managementProductsPageComponents.getProducts(this.managementProductsPageComponents.textFilterName);
      }
    }
  
    nextPage(){
      if(this.managementProductsPageComponents.productsList.length === 10){
        this.currentPage++;
        this.managementProductsPageComponents.IQueryParams.pageNumber = this.currentPage;
        this.managementProductsPageComponents.getProducts(this.managementProductsPageComponents.textFilterName);
      }else{
        this.managementProductsPageComponents.toastService.info('No hay más productos', 2000);
      }
    }
  
    goToPage(page: number){
      this.currentPage = page;
      this.managementProductsPageComponents.IQueryParams.pageNumber = this.currentPage;
      this.managementProductsPageComponents.getProducts(this.managementProductsPageComponents.textFilterName);
    }


}
