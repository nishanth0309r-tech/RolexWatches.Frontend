import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order-service';
import { MyOrder } from '../../models/order';


const STATUS_LABELS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

@Component({
  selector: 'app-orders',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<MyOrder[]>([]);
  loading = signal(true);
  loadFailed = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.orderService.getMyOrders().subscribe({
      next: orders => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadFailed.set(true);
      }
    });
  }

  statusLabel(status: number | string): string {
    return typeof status === 'number' ? STATUS_LABELS[status] ?? 'Unknown' : status;
  }
}