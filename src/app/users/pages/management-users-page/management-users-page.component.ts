import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { IGetUsers } from '../../interfaces/IGetUsers';
import { IQueryParams } from '../../interfaces/IQueryParams';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ToastService } from '../../../_shared/services/toast.service';
/**
 * Componente que se encarga de la página de gestión de usuarios.
 */
@Component({
  selector: 'management-users-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PaginationComponent, DatePipe],
  providers: [UserManagementService],
  templateUrl: './management-users-page.component.html',
  styleUrl: './management-users-page.component.css'
})
export class ManagementUsersPageComponent implements OnInit {
  /**
   * Servicio que gestiona las operaciones del admin sobre los usuarios.
   */
  userManagementService: UserManagementService = inject(UserManagementService);
  /**
   * Servicio que gestiona los mensajes emergentes.
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Parametros de la consulta.
   */
  iQueryParams: IQueryParams = { name: '', page: 1, pageSize: 10 };
  /**
   * Lista de usuarios obtenidos.
   */
  users: IGetUsers[] = [];
  /**
   * Filtro de nombre de usuario.
   */
  textFilterName: string = '';
  /**
   * Lista de errores que se pueden producir al realizar la gestión de usuarios.
   */
  errors: string[] = [];
  /**
   * Cabeceras de la tabla de usuarios.
   */
  tableHeaders = [
    { key: 'userName', label: 'Nombre de usuario' },
    { key: 'rut', label: 'RUT' },
    { key: 'name', label: 'Nombre' },
    { key: 'dateOfBirth', label: 'Fecha de nacimiento' },
    { key: 'gender', label: 'Género' },
    { key: 'email', label: 'Correo electrónico' },
    { key: 'isActive', label: 'Activo' }
  ];

  /**
   * Metodo que se encarga de inicializar la página
   */
  ngOnInit(){
    this.getUsers('');
  }

  /**
   * Metodo que se encarga de obtener los usuarios
   * @param input Filtro de nombre de usuario
   */
  async getUsers(input: string){
    this.errors = [];
    try{
      this.textFilterName = input;
      this.iQueryParams.name = this.textFilterName;
      const usersObtained = await this.userManagementService.getUsers(this.iQueryParams);
      if(usersObtained){
        this.users = usersObtained;
        console.log(this.users);
        if (this.users.length === 0){
          this.toastService.warning('No se encontraron usuarios', 2000);
        }
      }else{
        this.users = [];
        this.errors = this.userManagementService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Error al obtener los usuarios');
      }
    }catch(error: any){
      this.users = [];
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Error al obtener usuarios';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Error al obtener usuarios');
      }
      console.log('Error in get users page', error.error);
    }

  }

  /**
   * Metodo que se encarga de cambiar el estado de un usuario
   * @param email Correo electrónico del usuario
   */
  async changeState(email: string){
    this.errors = [];
    try{
      const changeState = await this.userManagementService.changeState(email);
      if(changeState){
        this.getUsers(this.textFilterName);
        this.toastService.success('Estado cambiado correctamente', 2000);
      }else{
        this.errors = this.userManagementService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Error al cambiar el estado');
      }
    } catch (error: any) {
      const errorMessage = error.error || 'Error al cambiar el estado';
      this.errors.push(errorMessage);
      this.toastService.error(errorMessage);
      console.log('Error in change state page', errorMessage);
    }
  }

  /**
   * Metodo que cambia el formato del estado de un usuario
   * @param input Estado del usuario
   * @returns Estado del usuario en formato de mensaje
   */
  showMessageIsActive(input: number | null): string{
    if(input === 1){
      return 'Sí';
    }
    if (input === 0){
      return 'No';
    } else{
      return '-';
    }  
  }
}
