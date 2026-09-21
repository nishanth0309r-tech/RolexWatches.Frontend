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