import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  items: CartItem[] = [];
  loading = true;

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
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.loading = false; }
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
        this.items = this.items.filter(i => i.id !== item.id);
        this.toastr.info('Item removed from cart.');
      },
      error: () => this.toastr.error('Could not remove item.')
    });
  }

  get grandTotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  goToCheckout(): void {
    if (this.items.length === 0) {
      this.toastr.warning('Your cart is empty.');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}