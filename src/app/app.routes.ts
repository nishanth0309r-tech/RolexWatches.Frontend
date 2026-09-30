import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const appRoutes: Routes = [
  // ---- Public ----
  { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.Register) },
  { path: 'product-list', loadComponent: () => import('./components/product-list/product-list').then(m => m.ProductList) },
  { path: 'product-details/:id', loadComponent: () => import('./components/product-details/product-details').then(m => m.ProductDetails) },

  // ---- Logged-in users (customers, and admins too) ----
  { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./components/cart/cart').then(m => m.Cart) },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./components/checkout/checkout').then(m => m.Checkout) },
  { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('./components/wishlist/wishlist').then(m => m.Wishlist) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./components/orders/orders').then(m => m.Orders) },

  // ---- Admin only: one guard on the parent covers every child ----
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard-component/dashboard-component').then(m => m.DashboardComponent) },
      { path: 'customers', loadComponent: () => import('./components/customer-list-component/customer-list-component').then(m => m.CustomerListComponent) },
      { path: 'brands', loadComponent: () => import('./components/brand-list-component/brand-list-component').then(m => m.BrandListComponent) },
      { path: 'categories', loadComponent: () => import('./components/category-list-component/category-list-component').then(m => m.CategoryListComponent) },
      { path: 'orders', loadComponent: () => import('./components/order-list-component/order-list-component').then(m => m.OrderListComponent) },
      { path: 'reviews', loadComponent: () => import('./components/review-list-component/review-list-component').then(m => m.ReviewListComponent) },
    ]
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];