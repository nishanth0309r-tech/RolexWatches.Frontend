import { Component, computed, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe,RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
   

  items = signal<CartItem[]>([]);
  loading = signal(true);
  total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.quantity, 0));

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => { this.items.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(item.id, quantity).subscribe({
      next: () => {
        item.quantity = quantity;
        item.total = item.price * quantity;
      },
      error: () => this.toastr.error('Could not update quantity.')
    });
  }

  remove(item: CartItem): void {
    this.cartService.removeFromCart(item.id).subscribe({
      next: () => {
        this.items.set(this.items().filter(i => i.id !== item.id));
        this.toastr.info('Item removed from cart.');
      },
      error: () => this.toastr.error('Could not remove item.')
    });
  }

  getgrandTotal(): number {
    return this.items().reduce((sum, item) => sum + item.total, 0);
  }

  goToCheckout(): void {
    if (this.items.length === 0) {
      this.toastr.warning('Your cart is empty.');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}