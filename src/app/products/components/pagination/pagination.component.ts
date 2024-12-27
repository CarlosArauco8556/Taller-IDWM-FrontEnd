import { Component, inject } from '@angular/core';
import { QueryProductService } from '../../services/query-service.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  private queryProductService: QueryProductService = inject(QueryProductService);
  textFilterValue: string | undefined;

  searchProductAdmin(): void {
    this.queryProductService.updateFilters({ textFilter: this.textFilterValue });
  }



}
