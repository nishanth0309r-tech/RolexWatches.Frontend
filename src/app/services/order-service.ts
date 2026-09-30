import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateOrderRequest, MyOrder, Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiUrl}/admin/orders`;
  private customerUrl = `${environment.apiUrl}/Orders`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
     return this.http.get<Order[]>(this.baseUrl); 
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  checkout(dto: CreateOrderRequest): Observable<MyOrder> {
  return this.http.post<MyOrder>(this.customerUrl, dto);
  }

  getMyOrders(): Observable<MyOrder[]> {
  return this.http.get<MyOrder[]>(`${this.customerUrl}/my-orders`);
  }
}