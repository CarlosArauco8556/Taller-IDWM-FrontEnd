import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { Toast } from '../../interfaces/Toast';

@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toastService: ToastService = inject(ToastService);
  toasts = this.toastService.getToasts();

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

  getIconClass(type: string): string {
    const baseClass = 'w-4 h-4';
    switch (type) {
      case 'success':
        return `${baseClass} fas fa-check`;
      case 'error':
        return `${baseClass} fas fa-times`;
      case 'warning':
        return `${baseClass} fas fa-exclamation`;
      case 'info':
        return `${baseClass} fas fa-info`;
      default:
        return baseClass;
    }
  }

  trackByToastId(index: number, toast: Toast): string {
    return toast.id;
  }
}
