import { Component, EventEmitter, inject, Output } from '@angular/core';
import { QueryServiceService } from '../../../home/services/query-service.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  public textFilterValue: string = '';
  public cartisHovered = false;
  public profileisHovered = false;

  private queryService: QueryServiceService = inject(QueryServiceService);

  searchProducts(): void {
    this.queryService.updateFilters({ textFilter: this.textFilterValue }); 
  }

}
