import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { AuthService } from '../../services/auth-service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  product = input.required<Product>();
  selectedImageIndex = signal(0);

  private readonly fallbackImage = 'https://placehold.co/600x600/f4f1e9/6f695d?text=Flux+Time';

  galleryImages = computed(() =>
    [...(this.product().images ?? [])].sort((a, b) =>
      Number(b.isPrimary) - Number(a.isPrimary) || a.displayOrder - b.displayOrder
    )
  );
  imageUrl = computed(() =>
    this.galleryImages()[this.selectedImageIndex()]?.imageUrl
      ?? this.galleryImages()[0]?.imageUrl
      ?? this.fallbackImage
  );

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.galleryImages().length) {
      this.selectedImageIndex.set(index);
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to add items to your cart.');
      return;
    }
    this.cartService.addToCart({ productId: this.product().id, quantity: 1 }).subscribe({
      next: () => this.toastr.success(`${this.product().name} added to cart!`),
      error: () => this.toastr.error('Could not add item to cart.')
    });
  }

  addToWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to use your wishlist.');
      return;
    }
    this.wishlistService.addToWishlist({ productId: this.product().id }).subscribe({
      next: () => this.toastr.success(`${this.product().name} added to wishlist!`),
      error: () => this.toastr.error('Could not add item to wishlist.')
    });
  }
}