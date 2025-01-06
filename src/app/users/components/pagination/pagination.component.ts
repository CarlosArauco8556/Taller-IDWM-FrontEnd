import { Component, inject } from '@angular/core';
import { ManagementUsersPageComponent } from '../../pages/management-users-page/management-users-page.component';
import { CommonModule } from '@angular/common';
/**
 * Componente que se encarga de la paginación de la tabla de usuarios
 */
@Component({
  selector: 'users-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  /**
   * Inyección del componente de la página de gestión de usuarios
   */
  managementUsersPageComponent: ManagementUsersPageComponent = inject(ManagementUsersPageComponent);
  /**
   * Página actual
   */
  currentPage: number = 1;

  /**
   * Metodo que se encarga de ir a la página anterior
   */
  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.managementUsersPageComponent.iQueryParams.page = this.currentPage;
      this.managementUsersPageComponent.getUsers(this.managementUsersPageComponent.textFilterName);
    }
  }

  /**
   * Metodo que se encarga de ir a la página siguiente
   */
  nextPage(){
    if(this.managementUsersPageComponent.users.length === 10){
      this.currentPage++;
      this.managementUsersPageComponent.iQueryParams.page = this.currentPage;
      this.managementUsersPageComponent.getUsers(this.managementUsersPageComponent.textFilterName);
    }else{
      this.managementUsersPageComponent.toastService.info('No hay más usuarios', 2000);
    }
  }

  /**
   * Metodo que se encarga de ir a una página específica
   * @param page Número de la página a la que se quiere ir
   */
  goToPage(page: number){
    this.currentPage = page;
    this.managementUsersPageComponent.iQueryParams.page = this.currentPage;
    this.managementUsersPageComponent.getUsers(this.managementUsersPageComponent.textFilterName);
  }

}