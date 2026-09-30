import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order-service';
import { CartItem } from '../../models/cart.model';

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

  items = signal<CartItem[]>([]);
  loading = signal(true);
  submitting = signal(false);
  total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.quantity, 0));

  form = this.fb.nonNullable.group({
    shippingAddress: ['', [Validators.required, Validators.maxLength(300)]]
  });

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.items.set(items);
      this.loading.set(false);
    });
  }

  placeOrder(): void {
    if (this.form.invalid || this.items().length === 0 || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);

    const cartItems = this.items();
    this.orderService.checkout({
      shippingAddress: this.form.controls.shippingAddress.value,
      items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity }))
    }).subscribe({
      next: () => {
        // the backend doesn't clear the cart, so empty it here
        forkJoin(cartItems.map(i => this.cartService.removeFromCart(i.id))).subscribe(() => {
          this.toastr.success('Your order has been placed.', 'Thank you');
          this.router.navigate(['/orders']);
        });
      },
      error: err => {
        this.submitting.set(false);
        this.toastr.error(err?.error?.message ?? 'Could not place your order.', 'Checkout failed');
      }
    });
  }
}