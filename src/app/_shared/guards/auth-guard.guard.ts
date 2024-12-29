import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageServiceService } from '../services/local-storage-service.service';
import { JWTPayload } from '../interfaces/JWTpayload';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageServiceService);
  
  const token = localStorageService.getVairbel('token');
  
  if (!token) {
    router.navigate(['/home']);
    return false;
  }

  const payload = decodeToken(token) as JWTPayload;
  
  if (!payload || !isTokenValid(payload)) {
    localStorageService.removeVairbel('token'); 
    router.navigate(['/home']);
    return false;
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
  
  if (payload.exp && currentTime > payload.exp) {
    console.warn('Token expirado');
    return false;
  }
  
  if (payload.nbf && currentTime < payload.nbf) {
    console.warn('Token aún no es válido');
    return false;
  }
  
  return true;
}