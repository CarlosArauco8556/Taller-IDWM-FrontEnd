import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryParams } from '../interfaces/queryParams';

/**
 * Servicio que se encarga de mantener y actualizar los filtros de búsqueda de productos.
 */
@Injectable({
  providedIn: 'root'
})
export class QueryServiceService {
  /**
   * Fuente de datos que contiene los filtros actuales.
   */
  private filtersSource = new BehaviorSubject<QueryParams>({
    textFilter: "", productType: "", sortByPrice: "", IsDescending: null, pageNumber: 1, pageSize: 10
  });

  /**
   * Observable que emite los filtros actuales.
   */
  public currentFilters$ = this.filtersSource.asObservable();

  /**
   * Método que actualiza los filtros actuales.
   * @param newFilters Filtros nuevos que se desean aplicar.
   */
  updateFilters(newFilters: Partial<QueryParams>) {
    const currentFilters = this.filtersSource.value;
    this.filtersSource.next({ ...currentFilters, ...newFilters });
  }

  /**
   * Método que reinicia los filtros a su estado inicial.
   */
  resetFilters() {
    this.filtersSource.next({
      textFilter: "", productType: "", sortByPrice: "", IsDescending: null, pageNumber: 1, pageSize: 10
    });
  }
}
