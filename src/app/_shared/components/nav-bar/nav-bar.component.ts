import { Component, EventEmitter, inject, Output } from '@angular/core';
import { QueryServiceService } from '../../../home/services/query-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogInComponent } from "../../../auth/components/log-in/log-in.component";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  public textFilterValue: string = '';
  public cartisHovered = false;
  public profileisHovered = false;

  private queryService: QueryServiceService = inject(QueryServiceService);
  menuOpen = false;

  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  searchProducts(): void {
    this.router.navigate(['/home']);
    this.queryService.updateFilters({ textFilter: this.textFilterValue }); 
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  openLogInForm(): void {
    this.logInFormIsOpen.emit(true);
  }
}
