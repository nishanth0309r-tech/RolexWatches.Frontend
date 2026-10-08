import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  if (authService.isLoggedIn()) {
    return true;
  }

  toastr.warning('Please log in to access this page.', 'Access Denied');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
