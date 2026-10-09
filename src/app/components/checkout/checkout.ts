import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order-service';
import { CartItem } from '../../models/cart.model';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  singleItem = signal(false);
  private route = inject(ActivatedRoute);
  items = signal<CartItem[]>([]);
  loading = signal(true);
  submitting = signal(false);
  total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.quantity, 0));

  form = this.fb.nonNullable.group({
    shippingAddress: ['', [Validators.required, Validators.maxLength(300)]]
  });

  ngOnInit(): void {
  this.route.queryParamMap.pipe(
    switchMap(params => {
      const itemId = Number(params.get('item'));
      return this.cartService.getCart().pipe(
        map(items => ({ items, itemId }))
      );
    })
  ).subscribe(({ items, itemId }) => {
      const selected = itemId ? items.filter(i => i.id === itemId) : items;
      this.items.set(selected);
      this.singleItem.set(!!itemId);
      this.loading.set(false);
    });
  }

  placeOrder(): void {
    if (this.form.invalid || this.items().length === 0 || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);

    this.orderService.checkout({
      shippingAddress: this.form.controls.shippingAddress.value,
      items: this.items().map(i => ({ productId: i.productId, quantity: i.quantity }))
    }).subscribe({
      next: order => this.router.navigate(['/payment', order.id]),
      error: err => {
        this.submitting.set(false);
        this.toastr.error(err?.error?.message ?? 'Could not place your order.', 'Checkout failed');
      }
    });
  }
}