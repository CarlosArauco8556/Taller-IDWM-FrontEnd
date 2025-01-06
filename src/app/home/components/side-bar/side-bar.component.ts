import { Component, inject } from '@angular/core';
import { QueryServiceService } from '../../services/query-service.service';

/**
 * Componente que representa la barra lateral de filtros
 */
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  /**
   * Servicio de consulta de productos
   */
  private queryService: QueryServiceService = inject(QueryServiceService);

  /**
   * Método que se ejecuta al cambiar un filtro
   * @param event Evento que se dispara al cambiar un filtro
   * @param filterType Filtro que se está cambiando
   */
  onFilterChange(event: Event, filterType: string): void {
    const value = (event.target as HTMLSelectElement).value;

    switch (filterType) {
      case 'productType':
        this.queryService.updateFilters({ productType: value });
        break;
      case 'sortByPrice':
        // Convertir el valor de "Ascendente" o "Descendente" a booleano
        const isDescending = value === 'true'; // "true" es Descendente, "false" es Ascendente
        this.queryService.updateFilters({
          sortByPrice: 'price',
          IsDescending: isDescending,
        });
        break;
      default:
        break;
    }
  }
}
