import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IChangePassword } from '../../interfaces/IChangePassword';
import { ToastService } from '../../../_shared/services/toast.service';
import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule, ToggleButtonComponent],
  providers: [AccountService],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css'
})
export class ChangePasswordPageComponent {
  accountService: AccountService = inject(AccountService);
  toastService: ToastService = inject(ToastService);
  forms: FormGroup = new FormGroup({});
  iChangePassword: IChangePassword = {currentPassword: '', newPassword: '', confirmPassword: ''};
  errors: string[] = [];

  constructor(private FormBuilder: FormBuilder){}

  ngOnInit(){
    this.createForm();
  }

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

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = this.forms.get('newPassword')?.value;
      const confirmPassword = control.value;
  
      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    };
  }

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
      const errorMessage = error.error || 'Ocurrió un error inesperado';
      this.errors.push(errorMessage)
      this.toastService.error(errorMessage);
      console.log('Error in changePassword page', error.error);
    }
  }
}
