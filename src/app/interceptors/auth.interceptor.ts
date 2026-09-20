import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (!token || isAuthRequest) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};
