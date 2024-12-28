import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LocalStorageServiceService } from '../../../_shared/services/local-storage-service.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthServiceService, LocalStorageServiceService],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit {

  private authService: AuthServiceService = inject(AuthServiceService);
  private localStorageService: LocalStorageServiceService = inject(LocalStorageServiceService);
  forms!: FormGroup;
  
  @Output() logInFormIsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forms = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
    });
  }

  async onSubmit() {
    console.log('Formulario válido:', this.forms.valid);
    if (this.forms.invalid) {
      console.log('Formulario inválido, no se enviará');
    }

    try {
      
      const logInDto = this.forms.value;
      const response = await this.authService.login(logInDto);

      if (response) {
        if (response.token) {
          this.authService.errors = [];
          this.localStorageService.setVairbel('token', response.token);
          this.localStorageService.setVairbel('user', response.email);
          console.log('usuario:', this.localStorageService.getVairbel('user'));
          console.log(response);
          this.closeLogInForm();
        } else {
          console.log('Error al loguear el usuario', this.authService.errors);
        }
      } else {
        console.log('Error al loguear el usuario', this.authService.errors);
      }
    } catch (error) {
      console.log('Error al loguear el usuario', this.authService.errors);
    }
  }

  closeLogInForm(): void {
    this.logInFormIsOpen.emit(false);
  }
}
