import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IQueryParams } from '../interfaces/IQueryParams';
import { IProduct } from '../interfaces/IProduct';
import { firstValueFrom } from 'rxjs';
import { IProductEdit } from '../interfaces/IProductEdit';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
/// <summary> 
/// Servicio para la gestión de productos
/// Este servicio se encarga de realizar las peticiones al servidor para la gestión de productos del administrador
// </summary>
export class ProductManagementService {
  /// <summary>
  /// Clase que se encarga de la gestión de los datos en el local storage
  /// </summary>
  public localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  /// <summary>
  /// Url base de la api
  /// </summary>
  private baseUrl = 'http://localhost:5012/api';
  /// <summary>
  /// Lista de errores
  /// </summary>
  public errors: string[] = [];
  /// <summary>
  /// Cliente http
  /// </summary>
  private http: HttpClient = inject(HttpClient);
  /// <summary>
  /// Token de autorización
  /// </summary>
  token = this.localStorageServiceService.getVariable('token');

  
  /// <summary>
  /// Obtiene los productos disponibles para su visualización
  /// </summary>
  /// <param name="IQueryParams">Parámetros de la consulta en el cual puede filtrar por nombre y por paginacion</param>
  /// <returns>Lista de productos</returns>
  async getProducts(IQueryParams: IQueryParams): Promise<IProduct[]> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); /// Se crea un objeto de tipo HttpHeaders para enviar el token de autorización
      let params = new HttpParams() /// Se crea un objeto de tipo HttpParams para enviar los parametros de la consulta
        if(IQueryParams.textFilter) params = params.set('textFilter', IQueryParams.textFilter); /// Se agrega el parametro textFilter si este existe
        if(IQueryParams.pageNumber) params = params.set('pageNumber', IQueryParams.pageNumber.toString()); /// Se agrega el parametro pageNumber si este existe
        if(IQueryParams.pageSize) params = params.set('pageSize', IQueryParams.pageSize.toString());  /// Se agrega el parametro pageSize si este existe
      
      /// Se realiza la petición a la api para obtener los productos
      const response = await firstValueFrom( this.http.get<IProduct[]>(`${this.baseUrl}/ProductManagement`, {params: params, headers: headers }))
      return Promise.resolve(response); /// Se retorna la respuesta
    } catch (error) { /// En caso de error
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.message;
          this.errors.push(errorMessage); /// Se agrega el mensaje de error al array de errores
        }
        return Promise.reject(error); /// Se retorna el error
    }
  }

  /// <summary>
  /// Permite agregar un producto
  /// </summary>
  /// <param name="iProductAdd">Objeto de tipo IProductEdit con los parametros que se puede crear un producto</param>
  /// <returns>Producto agregado</returns>
  async postProduct(iProductAdd: IProductEdit): Promise<IProduct> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); /// Se crea un objeto de tipo HttpHeaders para enviar el token de autorización

      const formData = new FormData(); /// Se crea un objeto de tipo FormData para enviar los datos del producto
      formData.append('Name', iProductAdd.name); /// Se agrega el nombre del producto
      formData.append('Price', iProductAdd.price.toString()); /// Se agrega el precio del producto
      formData.append('Stock', iProductAdd.stock.toString()); /// Se agrega el stock del producto
      formData.append('ProductTypeId', iProductAdd.productTypeId.toString()); /// Se agrega el id del tipo de producto
      if(iProductAdd.image) formData.append('Image', iProductAdd.image, iProductAdd.image.name); /// Se agrega la imagen del producto si esta existe

      const response = await firstValueFrom( this.http.post<IProduct>(`${this.baseUrl}/ProductManagement`, formData, {headers: headers})) /// Se realiza la petición a la api para agregar un producto
      return Promise.resolve(response); /// Se retorna la respuesta
    } catch (error) { /// En caso de error
      console.log('Error en postProduct service', error); /// Se imprime el error en consola
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage); /// Se agrega el mensaje de error al array de errores
      }
      return Promise.reject(error); /// Se retorna el error
    }
  }
  /// <summary>
  /// Permite editar un producto
  /// </summary>
  /// <param name="id">Id del producto a editar</param>
  /// <param name="iProductEdit">Objeto de tipo IProductEdit con los parametros que se puede editar un producto</param>
  /// <returns>Producto editado</returns>
  async putProduct(id: number, iProductEdit: IProductEdit): Promise<IProduct> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); /// Se crea un objeto de tipo HttpHeaders para enviar el token de autorización

      const formData = new FormData(); /// Se crea un objeto de tipo FormData para enviar los datos del producto
      formData.append('Name', iProductEdit.name); /// Se agrega el nombre del producto
      formData.append('Price', iProductEdit.price.toString()); /// Se agrega el precio del producto
      formData.append('Stock', iProductEdit.stock.toString()); /// Se agrega el stock del producto
      formData.append('ProductTypeId', iProductEdit.productTypeId.toString()); /// Se agrega el id del tipo de producto
      if(iProductEdit.image) formData.append('Image', iProductEdit.image, iProductEdit.image.name); /// Se agrega la imagen del producto si esta existe

      const response = await firstValueFrom( this.http.put<IProduct>(`${this.baseUrl}/ProductManagement/${id}`, formData, {headers: headers})) /// Se realiza la petición a la api para editar un producto
      return Promise.resolve(response); /// Se retorna la respuesta
    } catch (error) { /// En caso de error
      console.log('Error en putProduct service', error);
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage); /// Se agrega el mensaje de error al array de errores
      }
      return Promise.reject(error); /// Se retorna el error
    }
  }
  /// <summary>
  /// Permite eliminar un producto
  /// </summary>
  /// <param name="id">Id del producto a eliminar</param>
  /// <returns>Producto eliminado</returns>
  async deleteProduct(id: number): Promise<IProduct> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); /// Se crea un objeto de tipo HttpHeaders para enviar el token de autorización
      const response = await firstValueFrom(this.http.delete<IProduct>(`${this.baseUrl}/ProductManagement/${id}`, { headers: headers })); /// Se realiza la petición a la api para eliminar un producto
      return Promise.resolve(response); /// Se retorna la respuesta
    } catch (error) { /// En caso de error
      console.log('Error en deleteProduct service', error); /// Se imprime el error en consola
      if(error instanceof HttpErrorResponse) /// Si el error es de tipo HttpErrorResponse
      {
        const errorMessage = 
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage); /// Se agrega el mensaje de error al array de errores
      }
      return Promise.reject(error); /// Se retorna el error
    }
  }
  /// <summary>
  /// Guarda los errores en un array
  /// </summary>
  getErrors(): string[] {
    return this.errors;
  }
}
