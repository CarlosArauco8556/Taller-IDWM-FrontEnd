import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LocalStorageServiceService } from '../../../_shared/services/local-storage-service.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../_shared/services/toast.service';

/**
 * Componente para el inicio de sesión de un usuario.
 */
@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthServiceService, LocalStorageServiceService],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit {
  /**
   * Inyección del servicio de autenticación.
   */
  private authService: AuthServiceService = inject(AuthServiceService);
  /**
   * Inyección del servicio de almacenamiento local.
   */
  private localStorageService: LocalStorageServiceService = inject(LocalStorageServiceService);
  /**
   * Inyección del servicio de notificaciones.
   */
  private toastService: ToastService = inject(ToastService);
  /**
   * Formulario de inicio de sesión.
   */
  forms!: FormGroup;
  /**
   * Mensaje de confirmación.
   */
  public confirmMessage: string = '';
  /**
   * Evento de emisión para cerrar el formulario de inicio de sesión.
   */
  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Constructor del componente.
   * @param formBuilder Objeto para la creación de formularios. 
   * @param router Objeto para la navegación entre rutas.
   */
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  /**
   * Método que se ejecuta al iniciar el componente.
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * Método para crear el formulario de inicio de sesión.
   */
  createForm() {
    this.forms = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
    });
  }

  /**
   *  Método para enviar el formulario de inicio de sesión.
   * @returns Un mensaje de confirmación si el usuario se loguea correctamente o no.
   */
  async onSubmit() {
    console.log('Formulario válido:', this.forms.valid);
    if (this.forms.invalid) {
      console.log('Formulario inválido, no se enviará');
    }

    try {
      if (this.forms.invalid){
        this.toastService.error('Por favor, complete los campos correctamente.');
        return;
      }
      
      const logInDto = this.forms.value;
      const response = await this.authService.login(logInDto);

      if (response) {
        if (response.token) {
          this.authService.errors = [];
          this.localStorageService.setVariable('token', response.token);
          this.localStorageService.setVariable('user', response.email);
          console.log('usuario:', this.localStorageService.getVariable('user'));
          console.log(response);
          this.confirmMessage = 'Usuario logueado correctamente.';
          this.closeLogInForm();
          this.toastService.success('Usuario logueado correctamente.');
          this.router.navigate(['/home-admin']);

        } else {
          console.log('Error al loguear el usuario', this.authService.errors);
          const lastError = this.authService.errors[this.authService.errors.length - 1];
          this.toastService.error(lastError || 'Error al loguear el usuario.');
        }
      } else {
        console.log('Error al loguear el usuario', this.authService.errors);
        const lastError = this.authService.errors[this.authService.errors.length - 1];
        this.toastService.error(lastError || 'Error al loguear el usuario.');
      }
    } catch (error) {
      console.log('Error al loguear el usuario', this.authService.errors);
      if(error instanceof HttpErrorResponse)
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.error.message
          this.toastService.error(errorMessage || 'Error al loguear el usuario');
        }
    }
  }

  /**
   * Método para cerrar el formulario de inicio de sesión.
   */
  closeLogInForm(): void {
    this.logInFormIsOpen.emit(false);
  }

  /**
   * Método para obtener los errores del campo de correo.
   */
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
  
  /**
   * Método para obtener los errores del campo de contraseña.
   */
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
}
