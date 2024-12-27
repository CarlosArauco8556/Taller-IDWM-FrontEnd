import { Component, inject } from '@angular/core';
import { ManagementUsersPageComponent } from '../../pages/management-users-page/management-users-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'users-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  managementUsersPageComponent: ManagementUsersPageComponent = inject(ManagementUsersPageComponent);
  currentPage: number = 1;

  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.managementUsersPageComponent.iQueryParams.page = this.currentPage;
      this.managementUsersPageComponent.getUsers(this.managementUsersPageComponent.textFilterName);
    }
  }

  nextPage(){
    if(this.managementUsersPageComponent.users.length === 10){
      this.currentPage++;
      this.managementUsersPageComponent.iQueryParams.page = this.currentPage;
      this.managementUsersPageComponent.getUsers(this.managementUsersPageComponent.textFilterName);
    }else{
      this.managementUsersPageComponent.toastService.info('No hay más usuarios', 2000);
    }
  }

  goToPage(page: number){
    this.currentPage = page;
    this.managementUsersPageComponent.iQueryParams.page = this.currentPage;
    this.managementUsersPageComponent.getUsers(this.managementUsersPageComponent.textFilterName);
  }

}
