import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { IChangePassword } from '../../interfaces/IChangePassword';
import { ToastService } from '../../../_shared/services/toast.service';
import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';
import { NavBarComponent } from '../../../_shared/components/nav-bar/nav-bar.component';
/**
 * Componente que se encarga de la página de cambio de contraseña de un usuario.
 */
@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule, ToggleButtonComponent, NavBarComponent],
  providers: [AccountService],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css'
})
export class ChangePasswordPageComponent {
  /**
   * Servicio que gestiona las operaciones de la cuenta de usuario.
   */
  accountService: AccountService = inject(AccountService);
  /**
   * Servicio que gestiona los mensajes emergentes.
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Formulario de cambio de contraseña
   */
  forms: FormGroup = new FormGroup({});
  /**
   * Interfaz que representa los datos necesarios para realizar el cambio de contraseña.
   */
  iChangePassword: IChangePassword = {currentPassword: '', newPassword: '', confirmPassword: ''};
  /**
   * Lista de errores que se pueden producir al realizar el cambio de contraseña.
   */
  errors: string[] = [];

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
      currentPassword: ['', [Validators.required, Validators.minLength(8), 
      Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]],
      newPassword: ['', [Validators.required, Validators.minLength(8), 
      Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), 
      Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$'), this.passwordMatchValidator()]]
    });
  }

  /**
   * Metodo que se encarga de validar que la contraseña de confirmación coincida con la nueva contraseña.
   * @returns Validador de la contraseña de confirmación.
   */
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = this.forms.get('newPassword')?.value;
      const confirmPassword = control.value;
  
      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  /**
   * Metodo que se encarga de obtener el mensaje de error de un campo del formulario.
   * @param fieldName Nombre del campo del formulario.
   * @returns Mensaje de error del campo del formulario.
   */
  protected getFieldError(fieldName: keyof IChangePassword): string {
    const control = this.forms.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'Solo se permiten letras y números',
      passwordMismatch: 'No coincide con la contraseña nueva',
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }

  /**
   * Metodo que se encarga de realizar el cambio de contraseña.
   * @returns Promesa con el resultado de la operación.
   */
  async changePassword(){
    this.errors = [];
    if(this.forms.invalid){
      this.toastService.error('Por favor, revisa los campos del formulario');
      return;
    }

    try{
      this.iChangePassword.currentPassword = this.forms.value.currentPassword;
      this.iChangePassword.newPassword = this.forms.value.newPassword;
      this.iChangePassword.confirmPassword = this.forms.value.confirmPassword;

      const changePassword = await this.accountService.changePassword(this.iChangePassword);
      if(changePassword){
        this.toastService.success('Contraseña cambiada con éxito');
        this.forms.reset();
      } else {
        this.errors = this.accountService.errors;
        const lastError = this.errors[this.errors.length - 1]
        this.toastService.error(lastError || 'Ocurrió un error desconocido');
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
