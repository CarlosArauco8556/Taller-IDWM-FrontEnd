import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManagementUsersPageComponent } from '../../../users/pages/management-users-page/management-users-page.component';

@Component({
  selector: 'app-home-admin-page',
  standalone: true,
  imports: [CommonModule, ManagementUsersPageComponent],
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
