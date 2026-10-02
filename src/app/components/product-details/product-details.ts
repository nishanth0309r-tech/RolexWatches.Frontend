import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { AuthService } from '../../services/auth-service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  quantity = signal(1);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: (data) => { this.product.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to add items to your cart.');
      return;
    }
    this.cartService.addToCart({ productId: currentProduct.id, quantity: this.quantity() }).subscribe({
      next: () => this.toastr.success(`${currentProduct.name} added to cart!`),
      error: () => this.toastr.error('Could not add item to cart.')
    });
  }

  addToWishlist(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to use your wishlist.');
      return;
    }
    this.wishlistService.addToWishlist({ productId: currentProduct.id }).subscribe({
      next: () => this.toastr.success(`${currentProduct.name} added to wishlist!`),
      error: () => this.toastr.error('Could not add item to wishlist.')
    });
  }
}