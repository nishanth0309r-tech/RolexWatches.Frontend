import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'home', renderMode: RenderMode.Server },
  { path: 'login', renderMode: RenderMode.Server },
  { path: 'register', renderMode: RenderMode.Server },
  { path: 'product-list', renderMode: RenderMode.Server },
  { path: 'product-details/:id', renderMode: RenderMode.Server },
  { path: 'checkout', renderMode: RenderMode.Server },
  { path: 'payment/:orderId', renderMode: RenderMode.Server },
  { path: 'cart', renderMode: RenderMode.Server },
  { path: 'wishlist', renderMode: RenderMode.Server },
  { path: 'orders', renderMode: RenderMode.Server },
  { path: 'admin', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server }
];
