import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryParams } from '../interfaces/queryParams';

@Injectable({
  providedIn: 'root'
})
export class QueryServiceService {
  private textFilterSubject = new BehaviorSubject<string>(''); 
  textFilter$ = this.textFilterSubject.asObservable();

  updateTextFilter(text: string): void {
    this.textFilterSubject.next(text); 
  }
}
