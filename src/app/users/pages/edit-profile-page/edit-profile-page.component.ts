import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { IEditProfile } from '../../interfaces/IEditProfile';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';
import { NavBarComponent } from '../../../_shared/components/nav-bar/nav-bar.component';
/**
 * Componente que se encarga de la página de edición de perfil de un usuario.
 */
@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule, ToggleButtonComponent, NavBarComponent],
  providers: [AccountService],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.css'
})
export class EditProfilePageComponent {
  /**
   * Servicio que gestiona las operaciones de la cuenta de usuario.
   */
  accountService: AccountService = inject(AccountService);
  /**
   * Servicio que gestiona los mensajes emergentes.
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Interfaz que representa los datos necesarios para realizar la edición de perfil.
   */
  iEditProfile: IEditProfile = {name: '', dateOfBirth: null, gender: null};
  /**
   * Lista de errores que se pueden producir al realizar la edición de perfil.
   */
  errors: string[] = [];
  /**
   * Formulario de edición de perfil
   */
  forms: FormGroup = new FormGroup({});

  /**
   * Constructor que inyecta el FormBuilder
   * @param FormBuilder FormBuilder de la aplicación
   */
  constructor(private FormBuilder: FormBuilder){}

  /**
   * Metodo que se encarga de inicializar el formulario
   */
  ngOnInit(){
    this.createForm();
  }

  /**
   * Metodo que se encarga de crear el formulario
   */
  createForm(){
    this.forms = this.FormBuilder.group({
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), 
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
      dateOfBirth: ['', [Validators.required, this.ageValidator()]],
      gender: ['', [Validators.required]]
    });
  }

  /**
   * Metodo que se encarga de validar que las contraseñas coincidan
   * @returns ValidatorFn
   */
  private ageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();

      if (birthDate > today){
        return { futureDate: true };
      }

      return null;
    };
  }

  /**
   * Metodo que se encarga de obtener el error de un campo
   * @param fieldName Nombre del campo del fomrulario
   * @returns Mensaje de error del campo del formulario
   */
  protected getFieldError(fieldName: keyof IEditProfile): string {
    const control = this.forms.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'Solo se permiten letras y espacios',
      futureDate: 'La fecha de nacimiento no puede ser mayor a la fecha actual',
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }

  /**
   * Metodo que se encarga de editar el perfil del usuario
   * @returns Promesa que indica si se pudo editar el perfil
   */
  async editProfile(){
    this.errors = [];
    if(this.forms.invalid){
      this.toastService.error('Por favor, revisa los campos del formulario');
      return;
    }

    try{
      this.iEditProfile.name = this.forms.value.name;
      this.iEditProfile.dateOfBirth = this.forms.value.dateOfBirth;
      this.iEditProfile.gender = this.forms.value.gender;

      const profileEdited = await this.accountService.editProfile(this.iEditProfile);
      if(profileEdited){
        this.toastService.success('Perfil actualizado correctamente');
        this.forms.reset();
      } else{
        this.errors = this.accountService.errors;
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Ocurrio un error desconocido');
      }
    }catch(error: any){
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Ocurrió un error inesperado';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Ocurrió un error inesperado');
      }
      console.log('Error in changePassword page', error.error);
    }
  }
}
