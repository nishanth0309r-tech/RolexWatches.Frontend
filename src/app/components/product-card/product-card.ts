import { Component, input, computed, HostListener, ElementRef, signal } from '@angular/core';
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
  tiltStyle = signal('');

  private readonly fallbackImage = 'https://placehold.co/300x300?text=No+Image';

  imageUrl = computed(() => {
    const images = this.product().images;
    return images?.find(i => i.isPrimary)?.imageUrl
        ?? images?.[0]?.imageUrl
        ?? this.fallbackImage;
  });

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastr: ToastrService,
    private el: ElementRef
  ) {}

 @HostListener('mousemove', ['$event'])
onMouseMove(e: MouseEvent): void {
  const card = this.el.nativeElement.querySelector('.tilt-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -8;
  const rotateY = ((x - centerX) / centerX) * 8;
  this.tiltStyle.set(`transform: perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03);`);
}

@HostListener('mouseleave')
onMouseLeave(): void {
  this.tiltStyle.set('transform: perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1);');
}

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
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