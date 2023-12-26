import { Routes } from '@angular/router';
import { authGuard, userGuard } from './gaurds/auth.guard';
import { adminGuard } from './gaurds/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [userGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [userGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),

    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/user-detail/user-detail.component').then(
        (m) => m.UserDetailComponent
      ),

    canActivate: [authGuard],
  },
  {
    path: 'update/:id',
    loadComponent: () =>
      import('./pages/user-update/user-update.component').then(
        (m) => m.UserUpdateComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
