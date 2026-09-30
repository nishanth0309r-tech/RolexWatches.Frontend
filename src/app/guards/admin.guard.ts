import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth-service';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    // No localStorage/sessionStorage on the server — defer the real check to the client.
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const storedUser = (() => {
    try {
      const raw = localStorage.getItem('watchhub_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const sessionRole = sessionStorage.getItem('role');
  const isAuthenticated = authService.isLoggedIn() || !!sessionStorage.getItem('token') || !!localStorage.getItem('watchhub_token');
  const isAdmin = authService.isAdmin() || storedUser?.role === 'Admin' || sessionRole === 'Admin';

  if (!isAuthenticated) {
    toastr.warning('Please log in to access this page.', 'Access Denied');
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (isAdmin) {
    return true;
  }

  toastr.error('You do not have permission to access the admin area.', 'Access Denied');
  router.navigate(['/']);
  return false;
};
