import { Component, inject } from '@angular/core';
import { ManagementProductsPageComponent } from '../../pages/management-products-page/management-products-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
/// <summary>
/// Componente para la paginación de productos
/// </summary>
export class PaginationComponent {
  /// <summary>
  /// Componente de la página de gestión de productos
  /// </summary>
  public managementProductsPageComponents: ManagementProductsPageComponent = inject(ManagementProductsPageComponent);
  /// <summary>
  /// Página actual
  /// </summary>
  currentPage: number = 1;
    
    previousPage(){ /// Método para ir a la página anterior 
      if(this.currentPage > 1){ /// Si la página actual es mayor a 1
        this.currentPage--; /// Se disminuye la página actual
        this.managementProductsPageComponents.IQueryParams.pageNumber= this.currentPage; /// Se asigna la página actual a los parámetros de la consulta
        this.managementProductsPageComponents.getProducts(this.managementProductsPageComponents.textFilterName); /// Se obtienen los productos
      }
    }
  
    nextPage(){ /// Método para ir a la página siguiente
      if(this.managementProductsPageComponents.productsList.length === 10){ /// Si la cantidad de productos es igual a 10
        this.currentPage++; /// Se aumenta la página actual
        this.managementProductsPageComponents.IQueryParams.pageNumber = this.currentPage; /// Se asigna la página actual a los parámetros de la consulta
        this.managementProductsPageComponents.getProducts(this.managementProductsPageComponents.textFilterName); /// Se obtienen los productos
      }else{
        this.managementProductsPageComponents.toastService.info('No hay más productos', 2000); /// Se muestra un mensaje de información
      }
    }
  
    goToPage(page: number){ /// Método para ir a una página específica
      this.currentPage = page; /// Se asigna la página a la que se quiere ir a la página actual
      this.managementProductsPageComponents.IQueryParams.pageNumber = this.currentPage; /// Se asigna la página actual a los parámetros de la consulta
      this.managementProductsPageComponents.getProducts(this.managementProductsPageComponents.textFilterName); /// Se obtienen los productos
    }


}
