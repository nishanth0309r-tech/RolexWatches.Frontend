import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { AuthService } from '../../services/auth-service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product-service';
import { ProductReviews } from '../product-reviews/product-reviews';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, ProductReviews],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  quantity = signal(1);
  selectedImageIndex = signal(0);

  galleryImages = computed(() =>
    [...(this.product()?.images ?? [])].sort((a, b) =>
      Number(b.isPrimary) - Number(a.isPrimary) || a.displayOrder - b.displayOrder
    )
  );
  imageUrl = computed(() =>
    this.galleryImages()[this.selectedImageIndex()]?.imageUrl
      ?? 'https://placehold.co/800x800/f4f1e9/6f695d?text=Flux+Time'
  );

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
      next: (data) => { this.product.set(data); this.selectedImageIndex.set(0); this.loading.set(false); },
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

  setQuantity(value: number | string): void {
    const n = Math.floor(Number(value));
    this.quantity.set(Number.isFinite(n) && n >= 1 ? n : 1);
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://placehold.co/800x800/f4f1e9/6f695d?text=Flux+Time';
  }
}