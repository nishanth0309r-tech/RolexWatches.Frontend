import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { Wishlist } from './components/wishlist/wishlist';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { Orders } from './components/orders/orders';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: ProductList },
  { path: 'product/:id', component: ProductDetails },
  { path: 'wishlist', component: Wishlist },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'orders', component: Orders },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
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
import { authGuard } from './guards/auth.guard';
import { Routes } from "@angular/router";
import { adminGuard } from "./guards/admin-guard";
import { BrandListComponent } from "./Components/brand-list-component/brand-list-component";
import { CategoryListComponent } from "./Components/category-list-component/category-list-component";
import { CustomerListComponent } from "./Components/customer-list-component/customer-list-component";
import { DashboardComponent } from "./Components/dashboard-component/dashboard-component";
import { OrderListComponent } from "./Components/order-list-component/order-list-component";
import { ProductFormComponent } from "./Components/product-form-component/product-form-component";
import { ProductListComponent } from "./Components/product-list-component/product-list-component";
import { ReviewListComponent } from "./Components/review-list-component/review-list-component";

export const appRoutes: Routes = [
  {
    path: 'admin',
    // canActivate: [adminGuard],   // ← re-enable once Member 1's /login route exists
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },
      { path: 'brands', component: BrandListComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'customers', component: CustomerListComponent },
      { path: 'reviews', component: ReviewListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' }
];
