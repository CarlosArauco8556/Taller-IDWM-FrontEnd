import { Component, inject } from '@angular/core';
import { HomePageComponent } from '../../pages/home-page/home-page.component';
import { ToastService } from '../../../_shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { QueryServiceService } from '../../services/query-service.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  homePage: HomePageComponent = inject(HomePageComponent);
  toastService: ToastService = inject(ToastService);
  queryService: QueryServiceService = inject(QueryServiceService);
  currentPage: number = 1;

  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.queryService.updateFilters({ pageNumber: this.currentPage });
    }
  }

  nextPage(){
    if(this.homePage.productsList.length === 10){
      this.currentPage++;
      this.queryService.updateFilters({ pageNumber: this.currentPage });
    }else{
      this.toastService.info('No hay más productos', 2000);
    }
  }

  goToPage(page: number){
    this.currentPage = page;
    this.queryService.updateFilters({ pageNumber: this.currentPage });
  }
}
