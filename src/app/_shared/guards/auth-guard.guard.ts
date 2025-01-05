import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageServiceService } from '../services/local-storage-service.service';
import { JWTPayload } from '../interfaces/JWTpayload';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageServiceService);
  
  const token = localStorageService.getVairbel('token');
  
  // Si no hay token, redirigir a home
  if (!token) {
    router.navigate(['/home']);
    return false;
  }

  const payload = decodeToken(token) as JWTPayload;
  
  // Verificar validez del token y limpiarlo si ha expirado
  if (!payload || !isTokenValid(payload)) {
    console.warn('Token inválido o expirado - Limpiando localStorage');
    localStorageService.removeVairbel('token');
    router.navigate(['/home']);
    return false;
  }

  // Verificar si el token está próximo a expirar (opcional)
  const timeToExpire = (payload.exp || 0) - Math.floor(Date.now() / 1000);
  if (timeToExpire < 300) { // 5 minutos antes de expirar
    console.warn('Token próximo a expirar');
  }

  const userRole = payload.role;
  const normalizedUserRole = userRole.toUpperCase();
  const requiredRoles = route.data['roles'] as Array<string>;
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

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