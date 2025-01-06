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
/// <summary>
/// Componente para la creación de una compra
/// </summary>
export class CreatePurchaseComponent {
  /// <summary>
  /// Servicio de compras
  /// </summary>
  private purchaseUserServiceService: PurchaseUserServiceService = inject(PurchaseUserServiceService);
  /// <summary>
  /// Servicio de notificaciones
  /// </summary>
  toastService: ToastService = inject(ToastService);
  /// <summary>
  /// Objeto de tipo INewPurchase
  /// </summary>
  inewPurchase: INewPurchase = { country: '', city: '', commune: '', street: '' };
  /// <summary>
  /// Id de compra
  /// </summary>
  IdPurchase: number = 0;
  /// <summary>
  /// Url del archivo
  /// </summary>
  fileUrl: string | null = null;
  /// <summary>
  /// Lista de errores
  /// </summary>
  errors: string[] = [];
  /// <summary>
  /// Formulario de tipo FormGroup
  /// </summary>
  forms: FormGroup = new FormGroup({});
  
  constructor(private FormBuilder:FormBuilder) { } /// Método constructorc con un parámetro de tipo FormBuilder
  /// <summary>
  /// Método que se ejecuta al iniciar el componente
  /// </summary>
  ngOnInit() {
    this.createForm();
  }

  /// <summary>
  /// Método para crear el formulario
  /// </summary>
  createForm(){
    this.forms = this.FormBuilder.group({
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]], /// Se crea un campo de tipo country con validaciones
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]], /// Se crea un campo de tipo city con validaciones
      commune: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]], /// Se crea un campo de tipo commune con validaciones
      street: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9 ]+$')]] /// Se crea un campo de tipo street con validaciones
    });
  }
  /// <summary>
  /// Método para obtener el error de un campo
  /// </summary>
  /// <param name="fieldName">Nombre del campo</param>
  protected getFieldError(fieldName: keyof INewPurchase): string { 
    const control = this.forms.get(fieldName); /// Se obtiene el campo
    if (!control || !control.errors || !control.touched) return ''; /// Si no existe el campo, no tiene errores o no ha sido tocado, se retorna un string vacío
    /// Se crea un objeto de tipo errors con los mensajes de error
    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'Solo se permiten letras y espacios',
    };
    const firstError = Object.keys(control.errors)[0]; /// Se obtiene el primer error
    return errors[firstError as keyof typeof errors] || 'Campo inválido'; /// Se retorna el mensaje de error
  }
  /// <summary>
  /// Método para realizar una compra
  /// </summary>
  async createPurchase() {
    this.errors = []; /// Se limpian los errores
  
    if (this.forms.invalid){ /// Si el formulario es inválido
      this.toastService.error('Por favor, revisa los campos del formulario'); /// Se muestra un mensaje de error
      return;
    }
  
    try {
      this.inewPurchase.country = this.forms.get('country')?.value, /// Se asignan los valores de country del formulario a las propiedades del objeto inewPurchase
      this.inewPurchase.city = this.forms.get('city')?.value, /// Se asignan los valores de city del formulario a las propiedades del objeto inewPurchase
      this.inewPurchase.commune = this.forms.get('commune')?.value, /// Se asignan los valores de commune del formulario a las propiedades del objeto inewPurchase
      this.inewPurchase.street = this.forms.get('street')?.value; /// Se asignan los valores de street del formulario a las propiedades del objeto inewPurchase
      
      const response = await this.purchaseUserServiceService.postPurchaseUser(this.inewPurchase); /// Se realiza la compra
      if (response) { /// Si se realiza la compra
        this.toastService.success('Compra realizada con éxito'); /// Se muestra un mensaje de éxito
        this.forms.reset(); /// Se limpia el formulario
        console.log('Compra realizada con éxito');  /// Se imprime un mensaje de éxito
        this.IdPurchase = response; /// Se asigna el id de la compra a la propiedad IdPurchase
        const blob = await this.purchaseUserServiceService.getPurchaseUser(this.IdPurchase); /// Se obtiene el recibo de compra
        if(blob){ 
          const url = window.URL.createObjectURL(blob); /// Se crea una url del recibo de compra
          this.fileUrl = url; /// Se asigna la url a la propiedad fileUrl
        }else{
          this.toastService.error('Error al obtener el recibo de compra');  /// Se muestra un mensaje de error
          console.log('Error al obtener el recibo de compra'); /// Se imprime un mensaje de error
        }
      } else {
        this.errors = this.purchaseUserServiceService.getErrors(); /// Se asignan los errores del servicio de compras a la lista de errores
        const lastError = this.errors[this.errors.length - 1]; /// Se obtiene el último error
        this.toastService.error(lastError || 'Ocurrio un error desconocido'); /// Se muestra un mensaje de error
        console.log("Error al realizar la compra", this.errors); /// Se imprime un mensaje de error
      }
    } catch (error: any) {
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Ocurrió un error inesperado';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Ocurrió un error inesperado'); /// Se muestra un mensaje de error
      }
      console.log('Error in createPurchase page', error.error); /// Se imprime el error
    }
  }

    get countryInvalid(){
      return this.forms.get('country')?.invalid && this.forms.get('country')?.touched; 
    } /// Método para obtener si el campo country es inválido
    get cityInvalid(){
      return this.forms.get('city')?.invalid && this.forms.get('city')?.touched;
    } /// Método para obtener si el campo city es inválido
    get communeInvalid(){
      return this.forms.get('commune')?.invalid && this.forms.get('commune')?.touched;
    } /// Método para obtener si el campo commune es inválido
    get streetInvalid(){
      return this.forms.get('street')?.invalid && this.forms.get('street')?.touched;
    } /// Método para obtener si el campo street es inválido
} 
