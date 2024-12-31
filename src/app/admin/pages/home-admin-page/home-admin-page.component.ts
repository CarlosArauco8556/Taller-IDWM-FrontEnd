import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManagementUsersPageComponent } from '../../../users/pages/management-users-page/management-users-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ManagementProductsPageComponent } from '../../../products/pages/management-products-page/management-products-page.component';
import { EditProductsPageComponent } from '../../../products/pages/edit-products-page/edit-products-page.component';
import { AddProductsPageComponent } from '../../../products/pages/add-products-page/add-products-page.component';

@Component({
  selector: 'app-home-admin-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ManagementUsersPageComponent, ManagementProductsPageComponent, EditProductsPageComponent, AddProductsPageComponent],
  templateUrl: './home-admin-page.component.html',
  styleUrl: './home-admin-page.component.css'
})
export class HomeAdminPageComponent {
  isProductOpen: boolean;
  isUserOpen: boolean;
  isTicketOpen: boolean;
  currentComponent: string = '';
  
  constructor() 
  {
    this.isProductOpen = false;
    this.isUserOpen = false;
    this.isTicketOpen = false;
  }

  loadComponent(component: string) {
    this.currentComponent = component;
  }

  openProductMenu()
  {
    this.isUserOpen = false;
    this.isTicketOpen = false;
    this.isProductOpen = !this.isProductOpen;
  }

  openUserMenu()
  {
    this.isProductOpen = false;
    this.isTicketOpen = false;
    this.isUserOpen = !this.isUserOpen;
  }

  openTicketsMenu()
  {
    this.isProductOpen = false;
    this.isUserOpen = false;
    this.isTicketOpen = !this.isTicketOpen;
  }
}
