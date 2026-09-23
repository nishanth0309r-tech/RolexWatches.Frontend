import { Component, OnInit, inject } from '@angular/core';
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

  orders: Order[] = [];
  statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void { this.orderService.getAll().subscribe(data => this.orders = data); }

  changeStatus(order: Order, newStatus: string): void {
    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: () => { order.status = newStatus; this.toastr.success(`Order #${order.id} updated`); },
      error: () => this.toastr.error('Failed to update order status')
    });
  }
}