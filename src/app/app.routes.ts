import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Example protected route:
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./Components/dashboard/dashboard.component').then(m => m.DashboardComponent),
  //   canActivate: [authGuard]
  // }

  // Example admin-only route:
  // {
  //   path: 'admin/dashboard',
  //   loadComponent: () => import('./Components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  //   canActivate: [adminGuard]
  // }
];
