import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private tokenKey = 'rolexwatches_token';
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(dto: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto).pipe(tap(res => this.saveToken(res.token)));
  }
  register(dto: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dto).pipe(tap(res => this.saveToken(res.token)));
  }
  saveToken(token: string): void { if (this.isBrowser) localStorage.setItem(this.tokenKey, token); }
  getToken(): string | null { return this.isBrowser ? localStorage.getItem(this.tokenKey) : null; }
  isLoggedIn(): boolean { return !!this.getToken(); }
  logout(): void { if (this.isBrowser) localStorage.removeItem(this.tokenKey); }
}