import { Component, Input, HostListener, ElementRef, Inject } from '@angular/core';
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
  @Input() product!: Product;
  tiltStyle = '';

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    @Inject(ToastrService) private toastr: ToastrService,
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
    this.tiltStyle = `transform: perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03);`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.tiltStyle = 'transform: perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1);';
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to add items to your cart.');
      return;
    }
    this.cartService.addToCart({ productId: this.product.id, quantity: 1 }).subscribe({
      next: () => this.toastr.success(`${this.product.name} added to cart!`),
      error: () => this.toastr.error('Could not add item to cart.')
    });
  }

  addToWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to use your wishlist.');
      return;
    }
    this.wishlistService.addToWishlist({ productId: this.product.id }).subscribe({
      next: () => this.toastr.success(`${this.product.name} added to wishlist!`),
      error: () => this.toastr.error('Could not add item to wishlist.')
    });
  }
}