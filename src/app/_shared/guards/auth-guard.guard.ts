import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageServiceService } from '../services/local-storage-service.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageServiceService);
  
  if (localStorageService.getVairbel('token')) {
    return true;
  }
  router.navigate(['/home']);
  return false;

};
