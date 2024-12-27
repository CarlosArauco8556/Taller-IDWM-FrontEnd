import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProductEdit } from '../../interfaces/IProductEdit';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-products-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ProductManagementService],
  templateUrl: './edit-products-page.component.html',
  styleUrl: './edit-products-page.component.css'
})
export class EditProductsPageComponent {

  private productManagementService: ProductManagementService = inject(ProductManagementService);
  ieditProduct: IProductEdit = {name : '', price: 0, stock: 0, imageUrl: '', productTypeId: 0};
  errors: string[] = [];
  error: boolean = false;
  forms: FormGroup = new FormGroup({});
  productId!: number;
  selectedImage: File | null = null;
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
  validateImage(control: any) {
    const file = control.value;
    
    if (file) {
      // Verifica si el archivo es de un tipo válido
      const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024;  // 10MB
  
      if (!validFormats.includes(file.type)) {
        return { invalidImageFormat: true };
      }
  
      if (file.size > maxSize) {
        return { imageTooLarge: true };
      }
    }
  
    // Si no hay archivo, retorna null, lo que indica que el campo está limpio (validador no tiene errores)
    return null;
  }
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.forms.get('imageUrl')?.setValue(file);  // Actualiza el valor del campo en el formulario
      this.forms.get('imageUrl')?.updateValueAndValidity(); // Esto asegura que el validador se ejecute
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

  async editProduct(productId: number) {
    this.errors = [];
    this.error = false;
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
      const response = await this.productManagementService.putProduct(productId, formData);
      if (response) {
        this.error = false;
        this.errors = [];
        console.log('Producto actualizado con éxito');
        console.log('Producto Actualizado:', response);
        this.mensajeCreado = "Producto Actualizado con éxito";
      } else {
        this.error = true;
        this.errors = this.productManagementService.getErrors();
        console.log("Error al actualizar el producto",this.errors);
      }
    } catch (error:any) {
      const errores = error;
      this.error = true;
      this.errors = [];
      console.error('Error en editProduct', errores);

      for(const key in errores){
        if (errores.hasOwnProperty(key)) {
          this.errors.push(errores[key]);
        }
      } 
    }finally{
      console.log('Petición Finalizada');
      this.forms.reset();
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
