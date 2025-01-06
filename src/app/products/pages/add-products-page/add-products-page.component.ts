import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProductEdit } from '../../interfaces/IProductEdit';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'app-add-products-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ProductManagementService],
  templateUrl: './add-products-page.component.html',
  styleUrl: './add-products-page.component.css'
})
/// <summary>
/// Componente para la página de agregar productos en la cual se pueden agregar productos nuevos
/// </summary>
export class AddProductsPageComponent {
  /// <summary>
  /// Servicio de gestión de productos
  /// </summary>
  private productManagementService: ProductManagementService = inject(ProductManagementService);
  /// <summary>
  /// Objeto de tipo IProductEdit para agregar un producto
  /// </summary>
  iProductAdd: IProductEdit = {name : '', price: 0, stock: 0, image: null, productTypeId: 0};
  /// <summary>
  /// Servicio de notificaciones
  /// </summary>
  toastService: ToastService = inject(ToastService);
  /// <summary>
  /// Lista de errores
  /// </summary>
  errors: string[] = [];
  /// <summary>
  /// Formulario de productos
  /// </summary>
  forms: FormGroup = new FormGroup({});
  /// <summary>
  /// Vista previa de la imagen
  /// </summary>
  imagePreview: string | null = null;
  /// <summary>
  /// Imagen seleccionada
  /// </summary>
  selectedImage: File | null = null;
  
  constructor(private FormBuilder: FormBuilder) { } /// Se inyecta el servicio FormBuilder para la creación de formularios

  /// <summary>
  /// Método que se ejecuta al iniciar el componente
  /// </summary>
  ngOnInit() {
    this.createForm(); 
  }
  
  /// <summary>
  /// Método para crear el formulario de productos
  /// </summary>
  createForm(){
    this.forms = this.FormBuilder.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(64),  
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]], /// Se crea el campo name con las validaciones requeridas
      price: ['', [Validators.required, Validators.min(0), Validators.max(99999999), this.positiveIntegerValidator()]], /// Se crea el campo price con las validaciones requeridas
      stock: ['', [Validators.required, Validators.min(0), Validators.max(99999), this.positiveIntegerValidator()]], /// Se crea el campo stock con las validaciones requeridas
      image: ['', [Validators.required, this.validateImage()]], /// Se crea el campo image con las validaciones requeridas
      productTypeId: ['', [Validators.required, Validators.min(1), Validators.max(5), this.positiveIntegerValidator()]] /// Se crea el campo productTypeId con las validaciones requeridas
    });
  }
  
  /// <summary>
  /// Método para validar la imagen
  /// </summary>
  private validateImage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => { /// Se crea una función para validar la imagen
      if (!control.value || !(control.value instanceof File)) return null; /// Si no hay valor o no es un archivo se retorna null
  
      const file = control.value as File; /// Se asigna el valor del control a la variable file
      const validMimeTypes = ['image/png', 'image/jpeg']; /// Se crea un array con los tipos de archivo válidos
      const validExtensions = ['.png', '.jpg', '.jpeg']; /// Se crea un array con las extensiones válidas
      const maxSize = 10 * 1024 * 1024; /// Se asigna el tamaño máximo de la imagen
  
      const errors: ValidationErrors = {}; /// Se crea un objeto de tipo ValidationErrors para los errores
  
      if (!validMimeTypes.includes(file.type)) { /// Si el tipo de archivo no es válido
        errors['invalidImageFormat'] = true; /// Se agrega el error invalidImageFormat al objeto de errores
      }
  
      const fileName = file.name.toLowerCase(); /// Se asigna el nombre del archivo en minúsculas a la variable fileName
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext)); /// Se asigna a la variable hasValidExtension si el archivo tiene una extensión válida
      if (!hasValidExtension) { /// Si no tiene una extensión válida
        errors['invalidImageFormat'] = true; /// Se agrega el error invalidImageFormat al objeto de errores
      }
  
      if (file.size > maxSize) { /// Si el tamaño del archivo es mayor al tamaño máximo
        errors['imageTooLarge'] = true; /// Se agrega el error imageTooLarge al objeto de errores
      }
  
      return Object.keys(errors).length > 0 ? errors : null; /// Se retorna el objeto de errores si tiene errores, de lo contrario se retorna null
    };
  }

  private positiveIntegerValidator(): ValidatorFn { /// Se crea una función para validar un número entero positivo
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; /// Si no hay valor se retorna null
  
      const value = Number(control.value); /// Se asigna el valor del control a la variable value
      if (!Number.isInteger(value) || value <= 0) { /// Si el valor no es un número entero positivo
        return { positiveInteger: true }; /// Se retorna un objeto con el error positiveInteger
      }
  
      return null;
    };
  }
  
  protected getFieldError(fieldName: keyof IProductEdit): string { /// Se crea una función para obtener el error de un campo
    const control = this.forms.get(fieldName); /// Se asigna el campo al control

    if (!control || !control.errors || !control.touched) return ''; /// Si no hay control, no hay errores o no ha sido tocado se retorna un string vacío

    /// Se crea un objeto con los errores
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

    const firstError = Object.keys(control.errors)[0]; /// Se asigna el primer error al objeto firstError
    return errors[firstError as keyof typeof errors] || 'Campo inválido'; /// Se retorna el error o un mensaje de error genérico
  }

  /// <summary>
  /// Método para seleccionar una imagen
  /// </summary>
  /// <param name="event">Evento de tipo any</param>
  onImageSelected(event: any) {
    const file: File = event.target.files[0]; /// Se asigna el archivo seleccionado a la variable file
    if (file) {
    
      const fileName = file.name.toLowerCase(); /// Se asigna el nombre del archivo en minúsculas a la variable fileName
      const validExtensions = ['.png', '.jpg', '.jpeg']; /// Se crea un array con las extensiones válidas
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext)); /// Se asigna a la variable hasValidExtension si el archivo tiene una extensión válida
  
      if (!hasValidExtension) { /// Si no tiene una extensión válida
        this.forms.get('image')?.setErrors({ invalidImageFormat: true }); /// Se asigna el error invalidImageFormat al campo image
        this.forms.get('image')?.markAsTouched(); /// Se marca el campo image como tocado
        return;
      }
  
      this.selectedImage = file; /// Se asigna el archivo seleccionado a la variable selectedImage
      this.forms.get('image')?.setValue(file); /// Se asigna el archivo seleccionado al campo image
      this.forms.get('image')?.markAsTouched(); /// Se marca el campo image como tocado
      this.forms.get('image')?.updateValueAndValidity(); /// Se actualiza el valor y la validez del campo image
  
      
      const reader = new FileReader(); /// Se crea un objeto de tipo FileReader
      reader.onload = (e: any) => { /// Se asigna una función al evento onload del objeto reader
        this.imagePreview = e.target.result; /// Se asigna la vista previa de la imagen a la variable imagePreview
      };
      reader.readAsDataURL(file); /// Se lee el archivo como una URL
    }
  }
    
  removeImage() { /// Se crea una función para remover la imagen
    this.selectedImage = null; /// Se asigna null a la variable selectedImage
    this.imagePreview = null; /// Se asigna null a la variable imagePreview
    this.forms.get('image')?.setValue(null); /// Se asigna null al campo image
    this.forms.get('image')?.markAsTouched(); /// Se marca el campo image como tocado
    this.forms.get('image')?.updateValueAndValidity(); /// Se actualiza el valor y la validez del campo image
  }
  
  async addProduct() { /// Se crea una función para agregar un producto
    this.errors = []; /// Se asigna un array vacío a la lista de errores
    if(this.forms.invalid) { /// Si el formulario es inválido
      this.toastService.error('Por favor, complete correctamente el formulario'); /// Se muestra un mensaje de error
      return;
    }  
    try {    
      this.iProductAdd.name = this.forms.value.name; /// Se asigna el valor del campo name al campo name del objeto iProductAdd
      this.iProductAdd.price = this.forms.value.price; /// Se asigna el valor del campo price al campo price del objeto iProductAdd
      this.iProductAdd.stock = this.forms.value.stock; /// Se asigna el valor del campo stock al campo stock del objeto iProductAdd
      this.iProductAdd.productTypeId = this.forms.value.productTypeId; /// Se asigna el valor del campo productTypeId al campo productTypeId del objeto iProductAdd
 
      if (this.selectedImage) { /// Si hay una imagen seleccionada
        this.iProductAdd.image = this.selectedImage;  /// Se asigna la imagen seleccionada al campo image del objeto iProductAdd
      }

      const response = await this.productManagementService.postProduct(this.iProductAdd); /// Se agrega un producto
      if (response) { /// Si se agrega el producto
        this.forms.reset(); /// Se resetea el formulario
        console.log('Producto Creado:', response); /// Se imprime el producto creado
        this.toastService.success('Producto creado correctamente'); /// Se muestra un mensaje de éxito
        this.removeImage() /// Se remueve la imagen
      } else {
        console.log("Error in addProducts page ",this.errors); /// Se imprime el error
        this.errors = this.productManagementService.getErrors(); /// Se asignan los errores del servicio de gestión de productos a la lista de errores
        const lastError = this.errors[this.errors.length - 1]; /// Se obtiene el último error
        this.toastService.error(lastError || 'Ocurrio un error desconocido'); /// Se muestra un mensaje de error
      }
    } catch (error: any) { /// En caso de error
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Ocurrió un error inesperado';
        this.errors.push(errorMessage);
        this.toastService.error(errorMessage || 'Ocurrió un error inesperado'); /// Se muestra un mensaje de error
      }
      console.log('Error en addProduct page', error); /// Se imprime el error
    }
  }
}
