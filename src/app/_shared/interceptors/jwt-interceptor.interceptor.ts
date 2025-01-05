import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageServiceService } from '../services/local-storage-service.service';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageServiceService);
  const token = localStorageService.getVariable('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Aquí se agrega el token
      },
    });
  }

  return next(req);
};
