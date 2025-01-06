import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageServiceService } from '../services/local-storage-service.service';

/**
 * Interceptor que agrega el token JWT a las peticiones HTTP
 * @param req 
 * @param next 
 * @returns 
 */
export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  /**
   * Servicio de LocalStorage
   */
  const localStorageService = inject(LocalStorageServiceService);
  /**
   * Token JWT
   */
  const token = localStorageService.getVariable('token');

  /**
   * Si hay token, se agrega al header de la petición
   */
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Aquí se agrega el token
      },
    });
  }

  /**
   * Se envía la petición
   */
  return next(req);
};
