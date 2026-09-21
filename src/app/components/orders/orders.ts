import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OrderSummary {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: OrderSummary[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // NOTE: adjust route to match Member 1's actual "my orders" endpoint.
    this.http.get<OrderSummary[]>(`${environment.apiUrl}/Order/my-orders`).subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}