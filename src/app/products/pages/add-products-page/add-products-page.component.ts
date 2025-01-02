import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProductEdit } from '../../interfaces/IProductEdit';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../_shared/services/toast.service';

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
    ieditProduct: IProductEdit = {name : '', price: 0, stock: 0, imageUrl: '', productTypeId: 0};
    toastService: ToastService = inject(ToastService);
    errors: string[] = [];
    forms: FormGroup = new FormGroup({});
    productId!: number;
    imagePreview: string | null = null;
  
    constructor(private FormBuilder: FormBuilder, private route: ActivatedRoute) { }
  
    ngOnInit(): void {
      this.productId = +this.route.snapshot.params['id'];
      this.createForm();
    }
    nameError = false;
    priceError = false;
    stockError = false;
    productTypeIdError = false;
    imageError = false;
    mensajeCreado = "";
  
    createForm(){
      this.forms = this.FormBuilder.group({
        name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
        price: ['', [Validators.required, Validators.min(0), Validators.max(99999999), Validators.pattern(/^\d+$/)]],
        stock: ['', [Validators.required, Validators.min(0), Validators.max(99999),Validators.pattern(/^\d+$/) ]],
        imageUrl: ['', [Validators.required, this.validateImage]],
        productTypeId: ['', [Validators.required, Validators.min(1), Validators.max(5),Validators.pattern(/^\d+$/)]]
      });
    }
    selectedImage: File | null = null;
      validateImage(control: AbstractControl): ValidationErrors | null {
        if (control.value instanceof File) {
          const file = control.value as File;
          
          const validMimeTypes = ['image/png', 'image/jpeg'];
          const maxSize = 10 * 1024 * 1024; 
      
          const errors: ValidationErrors = {};
          
          
          if (!validMimeTypes.includes(file.type)) {
            errors['invalidImageFormat'] = true;
          }
      
          
          const fileName = file.name.toLowerCase();
          const validExtensions = ['.png', '.jpg', '.jpeg'];
          const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
          
          if (!hasValidExtension) {
            errors['invalidImageFormat'] = true;
          }
      
          if (file.size > maxSize) {
            errors['imageTooLarge'] = true;
          }
      
          return Object.keys(errors).length > 0 ? errors : null;
        }
        
        return null;
      }
      
      onImageSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
        
          const fileName = file.name.toLowerCase();
          const validExtensions = ['.png', '.jpg', '.jpeg'];
          const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      
          if (!hasValidExtension) {
            this.forms.get('imageUrl')?.setErrors({ invalidImageFormat: true });
            this.forms.get('imageUrl')?.markAsTouched();
            return;
          }
      
          this.selectedImage = file;
          this.forms.get('imageUrl')?.setValue(file);
          this.forms.get('imageUrl')?.markAsTouched();
          this.forms.get('imageUrl')?.updateValueAndValidity();
      
          
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
      this.forms.get('imageUrl')?.setValue(null);
      this.forms.get('imageUrl')?.markAsTouched();
      this.forms.get('imageUrl')?.updateValueAndValidity();
    }
  
    protected getFieldError(fieldName: keyof IProductEdit): string {
      const control = this.forms.get(fieldName);
  
      if (!control || !control.errors || !control.touched) return '';
  
      const errors = {
        required: 'Este campo es requerido',
        minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
        maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
        pattern: 'Solo se permiten letras y espacios',
        invalidName: 'El nombre debe contener solo letras y espacios',
        invalidPrice: 'El precio debe ser un número positivo superior a 0$ y menor a 99999999$',
        invalidStock: 'El stock debe ser un número positivo superior a 0 y menor a 99999',
        invalidProductTypeId: 'El tipo de producto debe ser un número positivo entre 1 y 5',
        invalidImage: 'Formato de imagen inválido, solo se permiten archivos .png, .jpeg y .jpg de hasta 10MB',
      };
  
      const firstError = Object.keys(control.errors)[0];
      return errors[firstError as keyof typeof errors] || 'Campo inválido';
    }
  
    async addProduct() {
      this.errors = [];
      if (this.forms.controls['name'].errors !== null) {
        this.nameError = true;
      }
      if (this.forms.controls['price'].errors !== null) {
        this.priceError = true;
      }
      if (this.forms.controls['stock'].errors !== null) {
        this.stockError = true;
      }
      if (this.forms.controls['productTypeId'].errors !== null) {
        this.productTypeIdError = true;
      }
      if (this.forms.controls['imageUrl'].errors !== null) {
        this.imageError = true;
      }
      if (this.forms.invalid) return;
    
      
      try {
        // Validar producto duplicado
        const isDuplicate = await this.productManagementService.validateProductNameAndType(
          this.forms.value.name,
          parseInt(this.forms.value.productTypeId)
        );
  
        if (isDuplicate) {
          this.errors.push('Ya existe un producto con el mismo nombre y tipo de producto');
          return;
        }
  
        const formData = new FormData();
        formData.append('name', this.forms.value.name);
        formData.append('price', this.forms.value.price.toString());
        formData.append('stock', this.forms.value.stock.toString());
        formData.append('productTypeId', this.forms.value.productTypeId.toString());
  
        if (this.selectedImage) {
          formData.append('image', this.selectedImage, this.selectedImage.name); 
        }
  
        const response = await this.productManagementService.postProduct(formData);
        if (response) {
          this.forms.reset();
          console.log('Producto creado con éxito');
          console.log('Producto Creado:', response);
          this.mensajeCreado = "Producto Creado con éxito";
        } else {
          this.errors = this.productManagementService.getErrors();
          console.log("Error al crear el producto",this.errors);
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
  
    get nameInvalid() {
      return this.forms.get('name')?.invalid && this.forms.get('name')?.touched;
    }
    get priceInvalid() {
      return this.forms.get('price')?.invalid && this.forms.get('price')?.touched;
    }
    get stockInvalid() {
      return this.forms.get('stock')?.invalid && this.forms.get('stock')?.touched;
    }
    get imageUrlInvalid() {
      return this.forms.get('imageUrl')?.invalid && this.forms.get('imageUrl')?.touched;
    }
    get productTypeIdInvalid() {
      return this.forms.get('productTypeId')?.invalid && this.forms.get('productTypeId')?.touched;
    }
}
