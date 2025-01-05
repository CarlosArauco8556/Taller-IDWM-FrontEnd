import { Component, inject } from '@angular/core';
import { HomePageComponent } from '../../pages/home-page/home-page.component';
import { ToastService } from '../../../_shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { QueryServiceService } from '../../services/query-service.service';

/**
 * Componente de paginación
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  /**
   * Componente de la página de inicio
   */
  homePage: HomePageComponent = inject(HomePageComponent);
  /**
   * Servicio de notificaciones
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Servicio de consulta
   */
  queryService: QueryServiceService = inject(QueryServiceService);
  /**
   * Página actual
   */
  currentPage: number = 1;

  /**
   * Método que sirve para moverse a la página anterior
   */
  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.queryService.updateFilters({ pageNumber: this.currentPage });
    }
  }

  /**
   * Método que sirve para moverse a la página siguiente
   */
  nextPage(){
    if(this.homePage.productsList.length === 10){
      this.currentPage++;
      this.queryService.updateFilters({ pageNumber: this.currentPage });
    }else{
      this.toastService.info('No hay más productos', 2000);
    }
  }

  /**
   * Método que sirve para moverse a una página específica
   * @param page Número de la página a la que se quiere ir
   */
  goToPage(page: number){
    this.currentPage = page;
    this.queryService.updateFilters({ pageNumber: this.currentPage });
  }
}
