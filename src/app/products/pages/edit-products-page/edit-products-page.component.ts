import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProductEdit } from '../../interfaces/IProductEdit';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'app-edit-products-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ProductManagementService],
  templateUrl: './edit-products-page.component.html',
  styleUrl: './edit-products-page.component.css'
})
/// <summary>
/// Componente para la página de editar productos en la cual se pueden editar productos existentes
/// </summary>
export class EditProductsPageComponent {

  /// <summary>
  /// Servicio de gestión de productos
  /// </summary>
  private productManagementService: ProductManagementService = inject(ProductManagementService);
  /// <summary>
  /// Servicio de notificaciones
  /// </summary>
  toastService: ToastService = inject(ToastService);
  /// <summary>
  /// Objeto de tipo IProductEdit para agregar un producto
  /// </summary>
  ieditProduct: IProductEdit = {name : '', price: 0, stock: 0, image: null, productTypeId: 0};
  /// <summary>
  /// Lista de errores
  /// </summary>
  errors: string[] = [];
  /// <summary>
  /// Formulario de productos
  /// </summary>
  forms: FormGroup = new FormGroup({});
  /// <summary>
  /// Id del producto
  /// </summary>
  productId!: number;
  /// <summary>
  /// Imagen seleccionada
  /// </summary>
  selectedImage: File | null = null;
  /// <summary>
  /// Vista previa de la imagen
  /// </summary>
  imagePreview: string | null = null;
  
  /// <summary>
  /// Constructor del componente
  /// </summary>
  constructor(private FormBuilder: FormBuilder, private route: ActivatedRoute) { }
  
  /// <summary>
  /// Método que se ejecuta al iniciar el componente
  /// </summary>
  ngOnInit() {
    this.productId = +this.route.snapshot.params['id']; /// Se obtiene el id del producto
    this.createForm(); /// Se crea el formulario
  }

  /// <summary>
  /// Método para crear el formulario
  /// </summary>
  createForm(){ 
    this.forms = this.FormBuilder.group({   /// Se crea el formulario
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(64), 
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]], /// Se agregan las validaciones al campo nombre
      price: ['', [Validators.required, Validators.min(0), Validators.max(99999999), this.positiveIntegerValidator()]], /// Se agregan las validaciones al campo precio
      stock: ['', [Validators.required, Validators.min(0), Validators.max(99999),this.positiveIntegerValidator() ]], /// Se agregan las validaciones al campo stock
      image: ['', [Validators.required, this.validateImage()]], /// Se agregan las validaciones al campo imagen
      productTypeId: ['', [Validators.required, Validators.min(1), Validators.max(5),this.positiveIntegerValidator()]] /// Se agregan las validaciones al campo id del tipo de producto
    });
  }

  /// <summary>
  /// Método para validar la imagen
  /// </summary>
  private validateImage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => { /// Se retorna una función que recibe un control de tipo AbstractControl y retorna un objeto de tipo ValidationErrors o null
      if (!control.value || !(control.value instanceof File)) return null; /// Si el control no tiene valor o el valor no es de tipo File se retorna null
  
      const file = control.value as File; /// Se obtiene el archivo
      const validMimeTypes = ['image/png', 'image/jpeg']; /// Se definen los tipos de archivos válidos
      const validExtensions = ['.png', '.jpg', '.jpeg']; /// Se definen las extensiones válidas
      const maxSize = 10 * 1024 * 1024; /// Se define el tamaño máximo de la imagen

      const errors: ValidationErrors = {}; /// Se crea un objeto de tipo ValidationErrors
  
      if (!validMimeTypes.includes(file.type)) { /// Si el tipo de archivo no es válido
        errors['invalidImageFormat'] = true; /// Se agrega el error al objeto de errores
      }
  
      const fileName = file.name.toLowerCase(); /// Se obtiene el nombre del archivo en minúsculas
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext)); /// Se verifica si el archivo tiene una extensión válida
      if (!hasValidExtension) { /// Si el archivo no tiene una extensión válida
        errors['invalidImageFormat'] = true; /// Se agrega el error al objeto de errores
      }
  
      if (file.size > maxSize) { /// Si el tamaño del archivo es mayor al tamaño máximo
        errors['imageTooLarge'] = true; /// Se agrega el error al objeto de errores
      }
  
      return Object.keys(errors).length > 0 ? errors : null; /// Se retorna el objeto de errores si tiene elementos o null si no tiene elementos
    };
  }

  private positiveIntegerValidator(): ValidatorFn { /// Método para validar un número entero positivo
    return (control: AbstractControl): ValidationErrors | null => { /// Se retorna una función que recibe un control de tipo AbstractControl y retorna un objeto de tipo ValidationErrors o null
      if (!control.value) return null; /// Si el control no tiene valor se retorna null
  
      const value = Number(control.value); /// Se obtiene el valor del control
      if (!Number.isInteger(value) || value <= 0) { /// Si el valor no es un número entero positivo
        return { positiveInteger: true }; /// Se retorna un objeto de errores
      }
  
      return null; /// Se retorna null si no hay errores
    };
  }

  protected getFieldError(fieldName: keyof IProductEdit): string { /// Método para obtener el error de un campo
    const control = this.forms.get(fieldName); /// Se obtiene el control del campo

    if (!control || !control.errors || !control.touched) return ''; /// Si el control no existe, no tiene errores o no ha sido tocado se retorna un string vacío
    
    /// Se definen los errores
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

    const firstError = Object.keys(control.errors)[0]; /// Se obtiene el primer error
    return errors[firstError as keyof typeof errors] || 'Campo inválido'; /// Se retorna el mensaje de error o un mensaje genérico
  }

  onImageSelected(event: any) { /// Método para seleccionar una imagen
    const file: File = event.target.files[0]; /// Se obtiene el archivo
    if (file) { /// Si el archivo existe
      const fileName = file.name.toLowerCase(); /// Se obtiene el nombre del archivo en minúsculas
      const validExtensions = ['.png', '.jpg', '.jpeg']; /// Se definen las extensiones válidas
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext)); /// Se verifica si el archivo tiene una extensión válida
  
      if (!hasValidExtension) { /// Si el archivo no tiene una extensión válida
        this.forms.get('image')?.setErrors({ invalidImageFormat: true }); /// Se agrega el error al campo imagen
        this.forms.get('image')?.markAsTouched(); /// Se marca el campo como tocado
        return;
      }
  
      this.selectedImage = file; /// Se asigna el archivo seleccionado a la variable selectedImage
      this.forms.get('image')?.setValue(file); /// Se asigna el archivo seleccionado al campo imagen
      this.forms.get('image')?.markAsTouched(); /// Se marca el campo como tocado
      this.forms.get('image')?.updateValueAndValidity(); /// Se actualiza el valor y la validez del campo
  
      
      const reader = new FileReader(); /// Se crea un objeto de tipo FileReader
      reader.onload = (e: any) => { /// Se asigna un evento al cargar el archivo
        this.imagePreview = e.target.result; /// Se asigna la vista previa de la imagen
      };
      reader.readAsDataURL(file); /// Se lee el archivo como una URL
    }
  }


  removeImage() { /// Método para eliminar la imagen
    this.selectedImage = null; /// Se asigna null a la variable selectedImage
    this.imagePreview = null; /// Se asigna null a la vista previa de la imagen
    this.forms.get('image')?.setValue(null); /// Se asigna null al campo imagen
    this.forms.get('image')?.markAsTouched(); /// Se marca el campo como tocado
    this.forms.get('image')?.updateValueAndValidity(); /// Se actualiza el valor y la validez del campo
  }

  async editProduct(productId: number) { /// Método para editar un producto
    this.errors = []; /// Se asigna un array vacío a la lista de errores
    if (this.forms.invalid) { /// Si el formulario es inválido
      this.toastService.error('Por favor, revisa los campos del formulario'); /// Se muestra un mensaje de error
      return;
    }

    try {  
      this.ieditProduct.name = this.forms.value.name; /// Se asigna el valor del campo nombre al campo name del objeto ieditProduct
      this.ieditProduct.price = this.forms.value.price; /// Se asigna el valor del campo precio al campo price del objeto ieditProduct
      this.ieditProduct.stock = this.forms.value.stock; /// Se asigna el valor del campo stock al campo stock del objeto ieditProduct
      this.ieditProduct.productTypeId = this.forms.value.productTypeId; /// Se asigna el valor del campo id del tipo de producto al campo productTypeId del objeto ieditProduct
   
      if (this.selectedImage) { /// Si hay una imagen seleccionada
        this.ieditProduct.image = this.selectedImage; /// Se asigna la imagen seleccionada al campo image del objeto ieditProduct
      }
      const response = await this.productManagementService.putProduct(productId, this.ieditProduct); /// Se edita el producto
      if (response) { /// Si se edita el producto
        console.log('Producto Actualizado:', response); /// Se imprime el producto actualizado
        this.toastService.success('Producto actualizado correctamente'); /// Se muestra un mensaje de éxito
        this.forms.reset(); /// Se reinicia el formulario
      }else {
        this.errors = this.productManagementService.getErrors(); /// Se asignan los errores del servicio de gestión de productos a la lista de errores
        console.log("Error al actualizar el producto",this.errors); /// Se imprime el error
        const lastError = this.errors[this.errors.length - 1]; /// Se obtiene el último error
        this.toastService.error(lastError || 'Ocurrio un error desconocido'); /// Se muestra un mensaje de error
      }
    }catch (error:any) { /// En caso de error
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Ocurrió un error inesperado';
          this.errors.push(errorMessage);
          this.toastService.error(errorMessage || 'Ocurrió un error inesperado'); /// Se muestra un mensaje de error
        }
        console.log('Error en editProduct page', error); /// Se imprime el error
    }
  }
}
