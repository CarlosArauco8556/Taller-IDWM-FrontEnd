import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { IEditProfile } from '../../interfaces/IEditProfile';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';
import { NavBarComponent } from '../../../_shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule, ToggleButtonComponent, NavBarComponent],
  providers: [AccountService],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.css'
})
export class EditProfilePageComponent {
  accountService: AccountService = inject(AccountService);
  toastService: ToastService = inject(ToastService);
  iEditProfile: IEditProfile = {name: '', dateOfBirth: null, gender: null};
  errors: string[] = [];
  forms: FormGroup = new FormGroup({});

  constructor(private FormBuilder: FormBuilder){}

  ngOnInit(){
    this.createForm();
  }

  createForm(){
    this.forms = this.FormBuilder.group({
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), 
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
      dateOfBirth: ['', [Validators.required, this.ageValidator()]],
      gender: ['', [Validators.required]]
    });
  }

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

  protected getFieldError(fieldName: keyof IEditProfile): string {
    const control = this.forms.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'Solo se permiten letras y espacios',
      futureDate: 'La fecha de nacimiento no puede ser mayor a la fecha actual',
      validGender: 'El género debe ser Masculino, Femenino, Prefiero no decirlo u Otro'
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }

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
      const errorMessage = error.error || 'Ocurrió un error inesperado';
      this.errors.push(errorMessage);
      this.toastService.error(errorMessage);
      console.log('Error in editProfile page', errorMessage);
    }
  }
}
