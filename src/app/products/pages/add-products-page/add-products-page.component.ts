import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProductEdit } from '../../interfaces/IProductEdit';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
    errors: string[] = [];
    forms: FormGroup = new FormGroup({});
    productId!: number;
    selectedImage: File | null = null;
    imagePreview: string | null = null;
  
    constructor(private FormBuilder: FormBuilder, private route: ActivatedRoute) { }
  
    ngOnInit(): void {
      this.productId = +this.route.snapshot.params['id'];
      this.createForm();
    }
  
    createForm(){
      this.forms = this.FormBuilder.group({
        name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(64),  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
        price: ['', [Validators.required, Validators.min(0), Validators.max(99999999), Validators.pattern(/^\d+$/)]],
        stock: ['', [Validators.required, Validators.min(0), Validators.max(99999),Validators.pattern(/^\d+$/) ]],
        imageUrl: ['', [Validators.required, this.validateImage]],
        productTypeId: ['', [Validators.required, Validators.min(1), Validators.max(5),Validators.pattern(/^\d+$/)]]
      });
    }
    validateImage(control: any) {
      const file = control.value;
      const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024;  // 10MB
    
      if (file && !validFormats.includes(file.type)) {
        return { invalidImageFormat: true };
      }
    
      if (file && file.size > maxSize) {
        return { imageTooLarge: true };
      }
    
      return null;  // Validación exitosa
    }
    onImageSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        this.selectedImage = file;
        this.forms.get('imageUrl')?.setValue(file);  // Actualiza el valor del campo en el formulario
      }
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
      if (this.forms.invalid) return;
    
      // Crea un FormData para enviar los datos del producto y la imagen (si existe)
      const formData = new FormData();
      formData.append('name', this.forms.value.name);
      formData.append('price', this.forms.value.price.toString());
      formData.append('stock', this.forms.value.stock.toString());
      formData.append('productTypeId', this.forms.value.productTypeId.toString());
    
      // Si hay una imagen seleccionada, la agregamos al FormData
      if (this.selectedImage) {
        formData.append('image', this.selectedImage, this.selectedImage.name);  // Asegúrate de usar 'image' como el nombre del campo
      }
    
      try {
        const response = await this.productManagementService.postProduct(formData);
        if (response) {
          console.log('Producto creado con éxito');
          this.forms.reset();
        } else {
          this.errors = this.productManagementService.getErrors();
        }
      } catch (error) {
        console.log('Error en editProduct', error);
        if (error instanceof HttpErrorResponse) {
          let e = error as HttpErrorResponse;
          this.errors.push(e.message);
        }
      }
    }
}
