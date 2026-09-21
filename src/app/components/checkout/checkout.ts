import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  items: CartItem[] = [];
  loading = true;
  placingOrder = false;

  shippingAddress = '';
  phoneNumber = '';

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get grandTotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  placeOrder(): void {
    if (!this.shippingAddress || !this.phoneNumber) {
      this.toastr.warning('Please fill in your shipping details.');
      return;
    }
    // NOTE: actual order submission needs Member 1's Checkout/Order API endpoint + DTO shape.
    this.placingOrder = true;
    this.toastr.info('Checkout endpoint not yet connected — confirm the Order API route with your team.');
    this.placingOrder = false;
  }
}