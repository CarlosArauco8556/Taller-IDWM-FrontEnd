import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryParams } from '../interfaces/queryParams';

@Injectable({
  providedIn: 'root'
})
export class QueryServiceService {
  private filtersSource = new BehaviorSubject<QueryParams>({
    textFilter: "", productType: "", sortByPrice: "", IsDescending: null, pageNumber: 1, pageSize: 10
  });

  public currentFilters$ = this.filtersSource.asObservable();

  updateFilters(newFilters: Partial<QueryParams>) {
    const currentFilters = this.filtersSource.value;
    this.filtersSource.next({ ...currentFilters, ...newFilters });
  }

  resetFilters() {
    this.filtersSource.next({
      textFilter: "", productType: "", sortByPrice: "", IsDescending: null, pageNumber: 1, pageSize: 10
    });
  }
}
