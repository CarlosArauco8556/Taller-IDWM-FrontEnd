import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ManagementUsersPageComponent } from '../../../users/pages/management-users-page/management-users-page.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ManagementProductsPageComponent } from '../../../products/pages/management-products-page/management-products-page.component';
import { AddProductsPageComponent } from '../../../products/pages/add-products-page/add-products-page.component';
import { GetPurchasesPageComponent } from '../../../purchases/pages/get-purchases-page/get-purchases-page.component';
import { AuthServiceService } from '../../../auth/services/auth-service.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { Router } from '@angular/router';
/**
 * Componente que representa la página principal del administrador
 */
@Component({
  selector: 'app-home-admin-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ManagementUsersPageComponent, ManagementProductsPageComponent, AddProductsPageComponent, GetPurchasesPageComponent],
  providers: [AuthServiceService],
  templateUrl: './home-admin-page.component.html',
  styleUrl: './home-admin-page.component.css'
})
export class HomeAdminPageComponent {
  /**
   * Servicio de autenticación
   */
  authService: AuthServiceService = inject(AuthServiceService);
  /**
   * Servicio de notificaciones
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Router
   */
  router: Router = inject(Router);
  /**
   * Lista de errores
   */
  errors: string[] = [];
  /**
   * Indica si el menú de productos está abierto
   */
  isProductOpen: boolean;
  /**
   * Indica si el menú de usuarios está abierto
   */
  isUserOpen: boolean;
  /**
   * Indica si el menú de compras está abierto
   */
  isPurchaseOpen: boolean;
  /**
   * Componente actual
   */
  currentComponent: string = '';
  
  /**
   * Constructor del componente
   */
  constructor() 
  {
    this.isProductOpen = false;
    this.isUserOpen = false;
    this.isPurchaseOpen = false;
  }

  /**
   * Carga un componente
   * @param component Nombre del componente
   */
  loadComponent(component: string) {
    this.currentComponent = component;
  }

  /**
   * Metodo que abre el menú de productos
   */
  openProductMenu()
  {
    this.isUserOpen = false;
    this.isPurchaseOpen = false;
    this.isProductOpen = !this.isProductOpen;
  }

  /**
   * Metodo que abre el menú de usuarios
   */
  openUserMenu()
  {
    this.isProductOpen = false;
    this.isPurchaseOpen = false;
    this.isUserOpen = !this.isUserOpen;
  }

  /**
   * Metodo que abre el menú de compras
   */
  openPurchasesMenu()
  {
    this.isProductOpen = false;
    this.isUserOpen = false;
    this.isPurchaseOpen = !this.isPurchaseOpen;
  }

  /**
   * Metodo que cierra la sesión del usuario
   */
  async logout(){
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
