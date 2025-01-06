import { Injectable } from '@angular/core';

/**
 * Servicio para manejar el almacenamiento local
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  /**
   * Método para guardar una variable en el almacenamiento local
   * @param key Parámetro que se usará para guardar la variable
   * @param value Parámetro que se guardará en el almacenamiento local
   */
  setVariable(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Método para obtener una variable del almacenamiento local
   * @param key Parámetro que se usará para obtener la variable
   * @returns Retorna la variable guardada en el almacenamiento local
   */
  getVariable(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  /**
   * Método para eliminar una variable del almacenamiento local
   * @param key Parámetro que se usará para eliminar la variable
   */
  removeVariable(key: string): void {
    localStorage.removeItem(key);
  }
}
