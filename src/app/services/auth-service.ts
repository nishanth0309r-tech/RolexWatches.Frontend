import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserDto } from '../Models/auth-models';
import { catchError, Observable, tap, throwError } from 'rxjs';

const TOKEN_KEY = 'watchhub_token';
const USER_KEY = 'watchhub_user';
const API_BASE_URL = 'https://localhost:7276/api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
     private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);
 
  private readonly baseUrl = `${API_BASE_URL}/auth`;
  private isBrowser = isPlatformBrowser(this.platformId);
 
  // Signal-based state so components can react without polling storage.
  currentUser = signal<UserDto | null>(this.readStoredUser());
 
  register(dto: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, dto).pipe(
      tap(res => {
        this.setSession(res.data);
        this.toastr.success(res.message ?? 'Registration successful.', 'Welcome to WatchHub');
        this.router.navigate(['/']);
      }),
      catchError(err => this.handleAuthError(err))
    );
  }
 
  login(dto: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, dto).pipe(
      tap(res => {
        this.setSession(res.data);
        this.toastr.success(res.message ?? 'Logged in successfully.', 'Welcome back');
        const target = res.data.user.role === 'Admin' ? '/admin/dashboard' : '/';
        this.router.navigate([target]);
      }),
      catchError(err => this.handleAuthError(err))
    );
  }
 
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.currentUser.set(null);
    this.toastr.info('You have been logged out.', 'Bye');
    this.router.navigate(['/login']);
  }
 
  getToken(): string | null {
    if (!this.isBrowser) return null; // no localStorage during SSR
    return localStorage.getItem(TOKEN_KEY);
  }
 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
 
  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }
 
  private setSession(data: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    this.currentUser.set(data.user);
  }
 
  private readStoredUser(): UserDto | null {
    if (!this.isBrowser) return null; // avoid crashing during SSR
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
 
  private handleAuthError(err: any) {
    const message = err?.error?.message ?? 'Something went wrong. Please try again.';
    this.toastr.error(message, 'Error');
    return throwError(() => err);
  }
}
