import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProductEdit } from '../../interfaces/IProductEdit';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../_shared/services/toast.service';
import { min } from 'rxjs';

@Component({
  selector: 'app-add-products-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ProductManagementService],
  templateUrl: './add-products-page.component.html',
  styleUrl: './add-products-page.component.css'
})
export class AddProductsPageComponent {
  private productManagementService: ProductManagementService = inject(ProductManagementService);
  iProductAdd: IProductEdit = {name : '', price: 0, stock: 0, image: null, productTypeId: 0};
  toastService: ToastService = inject(ToastService);
  errors: string[] = [];
  forms: FormGroup = new FormGroup({});
  imagePreview: string | null = null;
  selectedImage: File | null = null;
  
  constructor(private FormBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }
  

  createForm(){
    this.forms = this.FormBuilder.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(64),  
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(99999999), this.positiveIntegerValidator()]],
      stock: ['', [Validators.required, Validators.min(0), Validators.max(99999), this.positiveIntegerValidator()]],
      image: ['', [Validators.required, this.validateImage()]],
      productTypeId: ['', [Validators.required, Validators.min(1), Validators.max(5), this.positiveIntegerValidator()]]
    });
  }
  

  private validateImage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !(control.value instanceof File)) return null;
  
      const file = control.value as File;
      const validMimeTypes = ['image/png', 'image/jpeg'];
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const maxSize = 10 * 1024 * 1024;
  
      const errors: ValidationErrors = {};
  
      if (!validMimeTypes.includes(file.type)) {
        errors['invalidImageFormat'] = true;
      }
  
      const fileName = file.name.toLowerCase();
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      if (!hasValidExtension) {
        errors['invalidImageFormat'] = true;
      }
  
      if (file.size > maxSize) {
        errors['imageTooLarge'] = true;
      }
  
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  private positiveIntegerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
  
      const value = Number(control.value);
      if (!Number.isInteger(value) || value <= 0) {
        return { positiveInteger: true };
      }
  
      return null;
    };
  }
  
  protected getFieldError(fieldName: keyof IProductEdit): string {
    const control = this.forms.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      min: `El valor mínimo es ${control.errors['min']?.min}`,
      max: `El valor máximo es ${control.errors['max']?.max}`,
      pattern: 'Solo se permiten letras y espacios',
      positiveInteger: 'Debe ser un número entero positivo ', 
      invalidImageFormat: 'Solo se permiten archivos .png, .jpeg y .jpg.',
      imageTooLarge: 'La imagen no debe pesar más de 10MB'
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
    
      const fileName = file.name.toLowerCase();
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
      if (!hasValidExtension) {
        this.forms.get('image')?.setErrors({ invalidImageFormat: true });
        this.forms.get('image')?.markAsTouched();
        return;
      }
  
      this.selectedImage = file;
      this.forms.get('image')?.setValue(file);
      this.forms.get('image')?.markAsTouched();
      this.forms.get('image')?.updateValueAndValidity();
  
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
    
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.forms.get('image')?.setValue(null);
    this.forms.get('image')?.markAsTouched();
    this.forms.get('image')?.updateValueAndValidity();
  }
  
  async addProduct() {
    this.errors = [];
    if(this.forms.invalid) {
      this.toastService.error('Por favor, complete correctamente el formulario');
      return;
    }  
    try {    
      this.iProductAdd.name = this.forms.value.name;
      this.iProductAdd.price = this.forms.value.price;
      this.iProductAdd.stock = this.forms.value.stock;
      this.iProductAdd.productTypeId = this.forms.value.productTypeId;

      if (this.selectedImage) {
        this.iProductAdd.image = this.selectedImage; 
      }

      const response = await this.productManagementService.postProduct(this.iProductAdd);
      if (response) {
        this.forms.reset();
        console.log('Producto Creado:', response);
        this.toastService.success('Producto creado correctamente');
        this.removeImage()
      } else {
        console.log("Error in addProducts page ",this.errors);
        this.errors = this.productManagementService.getErrors();
        const lastError = this.errors[this.errors.length - 1];
        this.toastService.error(lastError || 'Ocurrio un error desconocido');
      }
    } catch (error: any) {
      if(error instanceof HttpErrorResponse)
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Ocurrió un error inesperado';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Ocurrió un error inesperado');
      }
      console.log('Error en addProduct page', error);
    }
  }
}
