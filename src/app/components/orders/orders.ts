import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { OrderService } from '../../services/order-service';
import { MyOrder } from '../../models/order';
import { PaymentService } from '../../services/payment-service';
import { ToastrService } from 'ngx-toastr';

// Must match the exact order of your C# OrderStatus enum (only used if the API sends numbers)
const STATUS_LABELS = ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled', 'Failed'];

@Component({
  selector: 'app-orders',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private toastr = inject(ToastrService);

  orders = signal<MyOrder[]>([]);
  loading = signal(true);
  loadFailed = signal(false);
  payingId = signal<number | null>(null);

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
        this.recheckPending(orders);
      },
      error: () => {
        this.loading.set(false);
        this.loadFailed.set(true);
      }
    });
  }

  // Asks Stripe (through the API) about every Pending order, in case a webhook was missed
  private recheckPending(orders: MyOrder[]): void {
    const pending = orders.filter(o => this.statusLabel(o.status) === 'Pending');
    if (pending.length === 0) return;

    forkJoin(
      pending.map(o =>
        this.paymentService.verifyPayment(o.id).pipe(catchError(() => of(null)))
      )
    ).subscribe(results => {
      if (results.some(r => r?.success)) {
        this.orderService.getMyOrders().subscribe(fresh => this.orders.set(fresh));
      }
    });
  }

  payNow(orderId: number): void {
    if (this.payingId() !== null) return;
    this.payingId.set(orderId);

    this.paymentService.createCheckoutSession(orderId).subscribe({
      next: res => window.location.href = res.url,   // leaves the page, so the button stays disabled
      error: err => {
        this.payingId.set(null);
        this.toastr.error(err?.error?.message ?? 'Could not start payment. Please try again.');
      }
    });
  }

  statusLabel(status: number | string): string {
    return typeof status === 'number' ? STATUS_LABELS[status] ?? 'Unknown' : status;
  }
}