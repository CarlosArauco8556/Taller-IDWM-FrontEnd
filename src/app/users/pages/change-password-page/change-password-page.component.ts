import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IChangePassword } from '../../interfaces/IChangePassword';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [AccountService],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css'
})
export class ChangePasswordPageComponent {
  accountService: AccountService = inject(AccountService);
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
      Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }
  protected loading = false;

  protected getFieldError(fieldName: keyof IChangePassword): string {
    const control = this.forms.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'Solo se permiten letras y números',
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }

  async changePassword(){
    this.errors = [];
    if(this.forms.invalid)return;

    try{
      this.iChangePassword.currentPassword = this.forms.value.currentPassword;
      this.iChangePassword.newPassword = this.forms.value.newPassword;
      this.iChangePassword.confirmPassword = this.forms.value.confirmPassword;

      const changePassword = await this.accountService.changePassword(this.iChangePassword);
      if(changePassword){
        // TO DO: Add message confirmation
        this.forms.reset();
      } else {
        // TO DO: Add messag error
        this.errors = this.accountService.errors;
      }
    }catch(error: any){
      // TO DO: Add messag error
      this.errors.push(error.error)
      console.log('Error in changePassword page', error.error);
    }
  }
}
