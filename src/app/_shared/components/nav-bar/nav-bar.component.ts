import { Component, EventEmitter, inject, Output } from '@angular/core';
import { QueryServiceService } from '../../../home/services/query-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  public textFilterValue: string = '';

  private queryService: QueryServiceService = inject(QueryServiceService);

  searchProducts(): void {
    this.queryService.updateTextFilter(this.textFilterValue); 
  }

}
