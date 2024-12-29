import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  setVairbel(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getVairbel(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeVairbel(key: string): void {
    localStorage.removeItem(key);
  }
  
}
