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

@Component({
  selector: 'app-home-admin-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ManagementUsersPageComponent, ManagementProductsPageComponent, AddProductsPageComponent, GetPurchasesPageComponent],
  providers: [AuthServiceService],
  templateUrl: './home-admin-page.component.html',
  styleUrl: './home-admin-page.component.css'
})
export class HomeAdminPageComponent {
  authService: AuthServiceService = inject(AuthServiceService);
  toastService: ToastService = inject(ToastService);
  router: Router = inject(Router);
  errors: string[] = [];
  isProductOpen: boolean;
  isUserOpen: boolean;
  isPurchaseOpen: boolean;
  currentComponent: string = '';
  
  constructor() 
  {
    this.isProductOpen = false;
    this.isUserOpen = false;
    this.isPurchaseOpen = false;
  }

  loadComponent(component: string) {
    this.currentComponent = component;
  }

  openProductMenu()
  {
    this.isUserOpen = false;
    this.isPurchaseOpen = false;
    this.isProductOpen = !this.isProductOpen;
  }

  openUserMenu()
  {
    this.isProductOpen = false;
    this.isPurchaseOpen = false;
    this.isUserOpen = !this.isUserOpen;
  }

  openPurchasesMenu()
  {
    this.isProductOpen = false;
    this.isUserOpen = false;
    this.isPurchaseOpen = !this.isPurchaseOpen;
  }

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
