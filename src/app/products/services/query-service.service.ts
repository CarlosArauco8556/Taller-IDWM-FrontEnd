import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {IQueryParams} from '../interfaces/IQueryParams';
@Injectable({
  providedIn: 'root'
})
export class QueryProductService {

  private filtersSource = new BehaviorSubject<IQueryParams>({
    textFilter: "", pageNumber: 1, pageSize: 10
  });

  public currentFilters$ = this.filtersSource.asObservable();
  
  
  updateFilters(newFilters: Partial<IQueryParams>) {
    const currentFilters = this.filtersSource.value;
    this.filtersSource.next({ ...currentFilters, ...newFilters });
  }

  resetFilters() {
    this.filtersSource.next({
      textFilter: "", pageNumber: 1, pageSize: 10
    });
  }
}
