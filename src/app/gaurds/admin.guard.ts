import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const user = sessionStorage.getItem('user');

  if (user !== null && JSON.parse(user)?.isAdmin) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['home']);
  }
};
