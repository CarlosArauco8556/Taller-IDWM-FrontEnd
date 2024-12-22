import { Component, inject } from '@angular/core';
import { QueryServiceService } from '../../services/query-service.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  private queryService: QueryServiceService = inject(QueryServiceService);

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
