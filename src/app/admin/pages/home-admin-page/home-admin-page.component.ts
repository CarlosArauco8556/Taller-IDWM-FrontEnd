import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManagementUsersPageComponent } from '../../../users/pages/management-users-page/management-users-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ManagementProductsPageComponent } from '../../../products/pages/management-products-page/management-products-page.component';
import { EditProductsPageComponent } from '../../../products/pages/edit-products-page/edit-products-page.component';
import { AddProductsPageComponent } from '../../../products/pages/add-products-page/add-products-page.component';
import { GetPurchasesPageComponent } from '../../../purchases/pages/get-purchases-page/get-purchases-page.component';

@Component({
  selector: 'app-home-admin-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ManagementUsersPageComponent, ManagementProductsPageComponent, EditProductsPageComponent, AddProductsPageComponent, GetPurchasesPageComponent],
  templateUrl: './home-admin-page.component.html',
  styleUrl: './home-admin-page.component.css'
})
export class HomeAdminPageComponent {
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
}
