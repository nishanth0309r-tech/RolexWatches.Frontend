import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { WishlistItem } from '../../models/wishlist.model';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  items: WishlistItem[] = [];
  loading = true;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    @Inject(ToastrService) private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  remove(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.productId !== productId);
        this.toastr.info('Removed from wishlist.');
      },
      error: () => this.toastr.error('Could not remove item.')
    });
  }

  moveToCart(item: WishlistItem): void {
    this.cartService.addToCart({ productId: item.productId, quantity: 1 }).subscribe({
      next: () => {
        this.toastr.success(`${item.productName} added to cart!`);
        this.remove(item.productId);
      },
      error: () => this.toastr.error('Could not add item to cart.')
    });
  }
}