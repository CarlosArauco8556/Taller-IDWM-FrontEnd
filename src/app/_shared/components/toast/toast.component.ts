import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { Toast } from '../../interfaces/Toast';

/**
 * Componente que representa el Toast.
 */
@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  /**
   * Servicio de notificaciones
   */
  toastService: ToastService = inject(ToastService);
  /**
   * Lista de Toasts
   */
  toasts = this.toastService.getToasts();

  /**
   * Metodo para agregar una clase de color dependiendo del tipo de Toast.
   * @param type Tipo de Toast
   */
  getTextColorClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return '';
    }
  }

  /**
   * Metodo para agregar una clase de fondo dependiendo del tipo de Toast.
   * @param type Tipo de Toast
   * @returns Clase de fondo
   */
  getIconBackgroundClass(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-500 bg-green-100';
      case 'error':
        return 'text-red-500 bg-red-100';
      case 'warning':
        return 'text-yellow-500 bg-yellow-100';
      case 'info':
        return 'text-blue-500 bg-blue-100';
      default:
        return '';
    }
  }

  /**
   * Metodo para agregar una clase de icono dependiendo del tipo de Toast.
   * @param type Tipo de Toast
   * @returns Clase de icono
   */
  getIconClass(type: string): string {
    const baseClass = 'w-4 h-4';
    switch (type) {
      case 'success':
        return `${baseClass} fas fa-check`;
      case 'error':
        return `${baseClass} fas fa-times`;
      case 'warning':
        return `${baseClass} translate-x-1 fas fa-exclamation`;
      case 'info':
        return `${baseClass} translate-x-1 fas fa-info`;
      default:
        return baseClass;
    }
  }
 
  /**
   * Metodo trackBy para los Toasts.
   * @param index Indice
   * @param toast Toast
   * @returns ID del Toast
   */
  trackByToastId(index: number, toast: Toast): string {
    return toast.id;
  }
}
