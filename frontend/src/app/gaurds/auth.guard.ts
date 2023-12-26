import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreUserService } from '../services/store-user.service';
export const authGuard: CanActivateFn = (route, state) => {
  const user = inject(StoreUserService);

  if (user !== null && user.getUser()?.email) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['login']);
  }
};
export const userGuard: CanActivateFn = (route, state) => {
  const user = inject(StoreUserService);

  if (user !== null && user.getUser()?.email) {
    const router = inject(Router);
    return router.navigate(['home']);
  } else {
    return true;
  }
};
