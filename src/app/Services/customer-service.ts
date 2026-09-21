import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../Models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private baseUrl = `${environment.apiUrl}/admin/customers`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> { return this.http.get<Customer[]>(this.baseUrl); }
  toggleBlock(id: number): Observable<void> { return this.http.put<void>(`${this.baseUrl}/${id}/block`, {}); }
}