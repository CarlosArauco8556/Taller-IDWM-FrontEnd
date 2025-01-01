import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseUserServiceService } from '../../services/purchase-user-service.service';
import { INewPurchase } from '../../interfaces/INewPurchase';
import { NavBarComponent } from '../../../_shared/components/nav-bar/nav-bar.component';
import { ToastService } from '../../../_shared/services/toast.service';


@Component({
  selector: 'app-create-purchase',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule, NavBarComponent],
  providers: [PurchaseUserServiceService],
  templateUrl: './create-purchase.component.html',
  styleUrl: './create-purchase.component.css'
})
export class CreatePurchaseComponent {

  private purchaseUserServiceService: PurchaseUserServiceService = inject(PurchaseUserServiceService);
  toastService: ToastService = inject(ToastService);
  inewPurchase: INewPurchase = { country: '', city: '', commune: '', street: '' };
  IdPurchase: number = 0;
  fileUrl: string | null = null;
  errors: string[] = [];
  forms: FormGroup = new FormGroup({});
  
  constructor(private FormBuilder:FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }


  createForm(){
    this.forms = this.FormBuilder.group({
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
      commune: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
      street: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9 ]+$')]]
    });
  }

  protected getFieldError(fieldName: keyof INewPurchase): string {
    const control = this.forms.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';
    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'Solo se permiten letras y espacios',
    };
    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }

  async createPurchase() {
    this.errors = [];
  
    if (this.forms.invalid){
      this.toastService.error('Por favor, revisa los campos del formulario');
      return;
    }
  
    try {
      this.inewPurchase.country = this.forms.get('country')?.value,
      this.inewPurchase.city = this.forms.get('city')?.value,
      this.inewPurchase.commune = this.forms.get('commune')?.value,
      this.inewPurchase.street = this.forms.get('street')?.value;
      
      const response = await this.purchaseUserServiceService.postPurchaseUser(this.inewPurchase);
      if (response) {
        this.toastService.success('Compra realizada con éxito');
        this.forms.reset();
        console.log('Compra realizada con éxito');
        this.IdPurchase = response;
        const blob = await this.purchaseUserServiceService.getPurchaseUser(this.IdPurchase);
        if(blob){
          const url = window.URL.createObjectURL(blob);
          this.fileUrl = url;
        }else{
          this.toastService.error('Error al obtener el recibo de compra');
          console.log('Error al obtener el recibo de compra');
        }
      } else {
        this.errors = this.purchaseUserServiceService.getErrors();
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Ocurrio un error desconocido');
        console.log("Error al realizar la compra", this.errors);
      }
    } catch (error: any) {
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Ocurrió un error inesperado';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Ocurrió un error inesperado');
      }
      console.log('Error in createPurchase page', error.error);
    }
  }

    get countryInvalid(){
      return this.forms.get('country')?.invalid && this.forms.get('country')?.touched;
    }
    get cityInvalid(){
      return this.forms.get('city')?.invalid && this.forms.get('city')?.touched;
    }
    get communeInvalid(){
      return this.forms.get('commune')?.invalid && this.forms.get('commune')?.touched;
    }
    get streetInvalid(){
      return this.forms.get('street')?.invalid && this.forms.get('street')?.touched;
    }
}
