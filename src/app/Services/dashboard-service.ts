import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardSummary } from '../models/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/admin/dashboard`;
  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> { return this.http.get<DashboardSummary>(this.baseUrl); }
}