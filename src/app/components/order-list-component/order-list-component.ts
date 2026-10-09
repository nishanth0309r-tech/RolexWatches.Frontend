import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order-service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list-component.html',
  styleUrl: './order-list-component.css'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);

  orders = signal<Order[]>([]);
  loading = signal(true);
  loadFailed = signal(false);
  statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.orderService.getAll().subscribe({
      next: data => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadFailed.set(true);
        this.toastr.error('Failed to load orders');
      }
    });
  }

  changeStatus(order: Order, newStatus: string): void {
    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: () => { order.status = newStatus; this.toastr.success(`Order #${order.id} updated`); },
      error: () => this.toastr.error('Failed to update order status')
    });
  }
}