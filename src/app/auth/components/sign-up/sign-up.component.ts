import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { LocalStorageServiceService } from '../../../_shared/services/local-storage-service.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthServiceService, LocalStorageServiceService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  private authService: AuthServiceService = inject(AuthServiceService);
  private localStorageService: LocalStorageServiceService = inject(LocalStorageServiceService);
  private toastService: ToastService = inject(ToastService);
  forms!: FormGroup;
  public confirmMessage: string = '';

  @Output() signUpFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forms = this.formBuilder.group({
      rut: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      birthdate: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
    });
  }

  closeSignUpForm(): void {
    this.signUpFormIsOpen.emit(false);
  }

  async onSubmit() {
    console.log('Formulario válido:', this.forms.valid);
    if (this.forms.invalid) {
      console.log('Formulario inválido, no se enviará');
    }

    try {
      const signUpDto = this.forms.value;
      const response = await this.authService.signUp(signUpDto);

      if (response) {
        if (response.token) {
          this.authService.errors = [];
          this.localStorageService.setVairbel('token', response.token);
          this.localStorageService.setVairbel('user', response.email);
          console.log('usuario:', this.localStorageService.getVairbel('user'));
          console.log(response);
          this.confirmMessage = 'Usuario registrado correctamente.';
          this.closeSignUpForm();
          this.toastService.success('Usuario registrado correctamente.');
        } else {
          console.log('Error al registrar el usuario', this.authService.errors);
          this.toastService.error('Error al registrar el usuario.');
        } 
      } else {
        console.log('Error al registrar el usuario', this.authService.errors);
        this.toastService.error('Error al registrar el usuario.');
      }
    } catch (error) {
      console.log('Error al registrar el usuario', this.authService.errors);
      this.toastService.error('Error al registrar el usuario.');
    }
  }

  get RutErrors() {
    const rut = this.forms.get('rut');
    if (rut?.invalid && rut?.touched) {
      if (rut.hasError('required')) {
        return 'El rut es obligatorio.';
      }
      if (rut.hasError('minlength') || rut.hasError('maxlength')) {
        return 'El rut debe tener 9 caracteres.';
      }
    }
    return null;
  }

  get NameErrors() {
    const name = this.forms.get('name');
    if (name?.invalid && name?.touched) {
      if (name.hasError('required')) {
        return 'El nombre es obligatorio.';
      }
      if (name.hasError('minlength') || name.hasError('maxlength')) {
        return 'El nombre debe tener entre 3 y 20 caracteres.';
      }
    }
    return null;
  }

  get BirthdateErrors() {
    const birthdate = this.forms.get('birthdate');
    if (birthdate?.invalid && birthdate?.touched) {
      if (birthdate.hasError('required')) {
        return 'La fecha de nacimiento es obligatoria.';
      }
    }
    return null;
  }

  get GenderErrors() {
    const gender = this.forms.get('gender');
    if (gender?.invalid && gender?.touched) {
      if (gender.hasError('required')) {
        return 'El género es obligatorio.';
      }
    }
    return null;
  }
  
  get EmailErrors() {
    const email = this.forms.get('email');
    if (email?.invalid && email?.touched) {
      if (email.hasError('required')) {
        return 'El correo es obligatorio.';
      }
      if (email.hasError('email')) {
        return 'El correo debe ser válido.';
      }
    }
    return null;
  }

  get PasswordErrors() {
    const password = this.forms.get('password');
    if (password?.invalid && password?.touched) {
      if (password.hasError('required')) {
        return 'La contraseña es obligatoria.';
      }
      if (password.hasError('minlength')) {
        return 'La contraseña debe tener al menos 8 caracteres.';
      }
      if (password.hasError('maxlength')) {
        return 'La contraseña no debe exceder 20 caracteres.';
      }
    }
    return null;
  }

  get ConfirmPasswordErrors() {
    const confirmPassword = this.forms.get('confirmPassword');
    if (confirmPassword?.invalid && confirmPassword?.touched) {
      if (confirmPassword.hasError('required')) {
        return 'La confirmación de la contraseña es obligatoria.';
      }
      if (confirmPassword.hasError('minlength')) {
        return 'La confirmación de la contraseña debe tener al menos 8 caracteres.';
      }
      if (confirmPassword.hasError('maxlength')) {
        return 'La confirmación de la contraseña no debe exceder 20 caracteres.';
      }
    }
    return null;
  }

  get PasswordMatchError() {
    const password = this.forms.get('password');
    const confirmPassword = this.forms.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      return 'Las contraseñas no coinciden.';
    }
    return null;
  }
}
