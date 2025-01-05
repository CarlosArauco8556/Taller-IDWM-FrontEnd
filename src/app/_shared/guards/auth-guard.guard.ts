import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageServiceService } from '../services/local-storage-service.service';
import { JWTPayload } from '../interfaces/JWTpayload';

/**
 * Guardia de autenticación
 * @param route 
 * @param state 
 * @returns 
 */
export const authGuardGuard: CanActivateFn = (route, state) => {

  /**
   * Inyección del servicio de enrutamiento.
   */
  const router = inject(Router);
  /**
   * Inyección del servicio de almacenamiento local.
   */
  const localStorageService = inject(LocalStorageServiceService);
  /**
   * Obtención del token de autenticación.
   */
  const token = localStorageService.getVariable('token');
  
  /**
   * Verificación de la existencia del token.
   */
  if (!token) {
    router.navigate(['/home']);
    return false;
  }

  /**
   * Decodificación del token.
   */
  const payload = decodeToken(token) as JWTPayload;
  
  /**
   * Verificación de la validez del token.
   */
  if (!payload || !isTokenValid(payload)) {
    console.warn('Token inválido o expirado - Limpiando localStorage');
    localStorageService.removeVariable('token');
    router.navigate(['/home']);
    return false;
  }

  /**
   * Verificación de la proximidad de la expiración del token.
   */
  const timeToExpire = (payload.exp || 0) - Math.floor(Date.now() / 1000);
  if (timeToExpire < 300) { 
    console.warn('Token próximo a expirar');
  }

  /**
   * Verificación de roles.
   */
  const userRole = payload.role;
  /**
   * Normalización del rol de usuario.
   */
  const normalizedUserRole = userRole.toUpperCase();
  /**
   * Obtención de los roles requeridos por la ruta.
   */
  const requiredRoles = route.data['roles'] as Array<string>;
  
  /**
   * Verificación de la existencia de roles requeridos.
   */
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  /**
   * Verificación de la pertenencia del rol de usuario a los roles requeridos.
   */
  if (requiredRoles.includes(normalizedUserRole)) {
    return true;
  } else {
    switch(normalizedUserRole) {
      case 'ADMIN':
        router.navigate(['/home-admin']);
        break;
      case 'USER':
        router.navigate(['/home']);
        break;
      default:
        router.navigate(['/unauthorized']);
    }
    return false;
  }
};

/**
 * Función para decodificar el token de autenticación.
 * @param token Token de autenticación.
 * @returns retorna el payload del token.
 */
function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
}

/**
 * Función para verificar la validez del token.
 * @param payload Payload del token.
 * @returns retorna true si el token es válido, de lo contrario retorna false.
 */
function isTokenValid(payload: JWTPayload): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Verificar si el token ha expirado
  if (payload.exp && currentTime > payload.exp) {
    console.warn('Token expirado');
    return false;
  }
  
  // Verificar si el token aún no es válido
  if (payload.nbf && currentTime < payload.nbf) {
    console.warn('Token aún no es válido');
    return false;
  }

  // Verificaciones adicionales opcionales
  if (!payload.role) {
    console.warn('Token no contiene rol de usuario');
    return false;
  }
  
  return true;
}