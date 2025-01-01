import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseUserServiceService } from '../../services/purchase-user-service.service';
import { INewPurchase } from '../../interfaces/INewPurchase';


@Component({
  selector: 'app-create-purchase',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [PurchaseUserServiceService],
  templateUrl: './create-purchase.component.html',
  styleUrl: './create-purchase.component.css'
})
export class CreatePurchaseComponent {

  private purchaseUserServiceService: PurchaseUserServiceService = inject(PurchaseUserServiceService);
  inewPurchase: INewPurchase = { country: '', city: '', commune: '', street: '' };
  error: boolean = false;
  mensajeCreado = "";
  errors: string[] = [];
  forms: FormGroup = new FormGroup({});
  
  constructor(private FormBuilder:FormBuilder) { }

  ngOnInit(): void {
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
    this.error = false;
  
    if (this.forms.invalid) return;
  
    try {
      const formData = {
        country: this.forms.get('country')?.value,
        city: this.forms.get('city')?.value,
        commune: this.forms.get('commune')?.value,
        street: this.forms.get('street')?.value
      };
  
      
      const response = await this.purchaseUserServiceService.postPurchaseUser(formData);
  
      if (response) {
        this.error = false;
        this.errors = [];
        console.log('Producto Comprado con éxito');
        console.log('Producto Comprado:', response);
        this.mensajeCreado = "Producto Comprado con éxito";
      } else {
        this.error = true;
        this.errors = this.purchaseUserServiceService.getErrors();
        console.log("Error al Comprar el producto", this.errors);
      }
    } catch (error: any) {
      const errores = error;
      this.error = true;
      this.errors = [];
      console.error('Error en createPurchase', errores);
  
      for (const key in errores) {
        if (errores.hasOwnProperty(key)) {
          this.errors.push(errores[key]);
        }
      }
    } finally {
      console.log('Petición Finalizada');
      this.forms.reset();
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
