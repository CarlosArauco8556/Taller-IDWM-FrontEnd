import { Injectable, signal } from '@angular/core';
import { Toast } from '../interfaces/Toast';

/**
 * Servicio para mostrar mensajes de notificación en la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  /**
   * Lista de toasts a mostrar.
   */
  private toasts = signal<Toast[]>([]);

  /**
   * Método para obtener la lista de toasts a mostrar.
   * @returns Lista de toasts a mostrar.
   */
  getToasts() {
    return this.toasts;
  }

  /**
   * Método para mostrar un toast.
   */
  show(message: string, type: Toast['type'], duration: number = 3000){
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, type, duration };
    this.toasts.update((currentToast) => [...currentToast, toast]);
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  /**
   * Método para mostrar un toast de tipo success.
   * @param message Mensaje a mostrar.
   * @param duration Duración del toast.
   */
  success(message: string, duration: number = 3000){
    this.show(message, 'success', duration);
  }

  /**
   * Método para mostrar un toast de tipo error.
   * @param message Mensaje a mostrar.
   * @param duration Duración del toast.
   */
  error(message: string, duration: number = 3000){
    this.show(message, 'error', duration);
  }

  /**
   * Método para mostrar un toast de tipo warning.
   * @param message Mensaje a mostrar.
   * @param duration Duración del toast.
   */
  warning(message: string, duration: number = 3000){
    this.show(message, 'warning', duration);
  }

  /**
   * Método para mostrar un toast de tipo info.
   * @param message Mensaje a mostrar.
   * @param duration Duración del toast.
   */
  info(message: string, duration: number = 3000){
    this.show(message, 'info', duration);
  }

  /**
   * Método para remover un toast de la lista.
   * @param id identificación del toast a remover.
   */
  remove(id: string){
    this.toasts.update((currentToast) => currentToast.filter((toast) => toast.id !== id));  
  }
}
