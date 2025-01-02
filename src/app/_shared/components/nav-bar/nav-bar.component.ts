import { Component, EventEmitter, inject, Output } from '@angular/core';
import { QueryServiceService } from '../../../home/services/query-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogInComponent } from "../../../auth/components/log-in/log-in.component";
import { AuthServiceService } from '../../../auth/services/auth-service.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [AuthServiceService],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  authService: AuthServiceService = inject(AuthServiceService);
  toastService: ToastService = inject(ToastService);
  errors: string[] = [];
  public textFilterValue: string = '';
  public cartisHovered = false;
  public profileisHovered = false;

  private queryService: QueryServiceService = inject(QueryServiceService);
  menuOpen = false;

  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() signUpFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  openSignUpForm(): void {
    this.signUpFormIsOpen.emit(true);
  }

  async logOut(){
    try {
      const response = await this.authService.logout();
      if(response){
        this.toastService.success("Cierre de sesión exitoso");
        this.router.navigate(['/home']);
      }else{
        this.errors = this.authService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || "No se pudo cerrar sesión");
      }
    }catch (error: any){
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'No se pudo cerrar sesión';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'No se pudo cerrar sesión');
      }
      console.log('Error in home-admin page logout', error.error);
    }
  }
}
