import { Component, EventEmitter, inject, Output } from '@angular/core';
import { QueryServiceService } from '../../../home/services/query-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../auth/services/auth-service.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Componente que contiene la barra de navegación de la aplicación.
 */
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [AuthServiceService],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  /**
   * Servicio de autenticación.
   */
  authService: AuthServiceService = inject(AuthServiceService);
  /**
   * Servicio de notificaciones.
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Lista de errores.
   */
  errors: string[] = [];
  /**
   * Valor del filtro de texto.
   */
  public textFilterValue: string = '';
  /**
   * Indica si el carrito está siendo seleccionado.
   */
  public cartisHovered = false;
  /**
   * Indica si el perfil está siendo seleccionado.
   */
  public profileisHovered = false;
  /**
   * Servicio de consulta.
   */
  private queryService: QueryServiceService = inject(QueryServiceService);
  /**
   * Indica si el menú está abierto.
   */
  menuOpen = false;
  /**
   * Evento que indica si el formulario de inicio de sesión está abierto.
   */
  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * Evento que indica si el formulario de registro está abierto.
   */
  @Output() signUpFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Constructor de la clase.
   * @param router Servicio de enrutamiento.
   */
  constructor(private router: Router) {}

  /**
   * Método que se encarga de buscar productos.
   */
  searchProducts(): void {
    this.router.navigate(['/home']);
    this.queryService.updateFilters({ textFilter: this.textFilterValue }); 
  }

  /**
   * Método que se encarga de abrir el menú.
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Método que se encarga de cerrar el menú.
   */
  openLogInForm(): void {
    this.logInFormIsOpen.emit(true);
  }

  /**
   * Método que se encarga de abrir el formulario de registro.
   */
  openSignUpForm(): void {
    this.signUpFormIsOpen.emit(true);
  }

  /**
   * Método que se encarga de cerrar la sesión.
   */
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
