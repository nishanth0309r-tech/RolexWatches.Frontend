import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../services/payment-service';
import { OrderService } from '../../services/order-service';
import { MyOrder } from '../../models/order';

@Component({
  imports: [ReactiveFormsModule,CurrencyPipe],
  selector: 'app-payment',
  styleUrl: './payment.css',
  templateUrl: './payment.html',
})
export class Payment implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private paymentService = inject(PaymentService);
  private orderService = inject(OrderService);

  orderId = Number(this.route.snapshot.paramMap.get('orderId'));
  order = signal<MyOrder | null>(null);
  paying = signal(false);

  form = this.fb.nonNullable.group({
    method: ['Card', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]]
  });

  ngOnInit(): void {
    this.form.controls.method.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(method => {
        const cardNumber = this.form.controls.cardNumber;
        if (method === 'Card') {
          cardNumber.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
        } else {
          cardNumber.clearValidators();
          cardNumber.reset();
        }
        cardNumber.updateValueAndValidity();
      });

    this.orderService.getMyOrders().subscribe(orders =>
      this.order.set(orders.find(o => o.id === this.orderId) ?? null));
  }

  pay(): void {
    if (this.form.invalid || this.paying()) {
      this.form.markAllAsTouched();
      return;
    }
    this.paying.set(true);
    const { method, cardNumber } = this.form.getRawValue();

    this.paymentService.pay(this.orderId, method, method === 'Card' ? cardNumber : undefined).subscribe({
      next: res => {
        this.toastr.success(res.message, 'Thank you');
        this.router.navigate(['/orders']);
      },
      error: err => {
        this.paying.set(false);
        this.toastr.error(err?.error?.message ?? 'Payment failed. Please try again.', 'Payment');
      }
    });
  }
}