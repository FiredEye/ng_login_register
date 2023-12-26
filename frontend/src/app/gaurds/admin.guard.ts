import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreUserService } from '../services/store-user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const user = inject(StoreUserService);

  if (user !== null && user.getUser()?.isAdmin) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['home']);
  }
};
