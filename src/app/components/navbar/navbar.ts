import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar
 {
   auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);

  menuOpen = false;
  searchOpen = false;
  moreMenuOpen = false;
  searchTerm = '';

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) {
      this.closeMenu();
      this.moreMenuOpen = false;
    }
  }

  toggleMoreMenu(): void {
    this.moreMenuOpen = !this.moreMenuOpen;
    if (this.moreMenuOpen) {
      this.closeMenu();
      this.searchOpen = false;
    }
  }

  closeMoreMenu(): void {
    this.moreMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeMoreMenuOnOutsideClick(event: MouseEvent): void {
    if (!(event.target instanceof Element) || !event.target.closest('.more-menu')) {
      this.closeMoreMenu();
    }
  }

  @HostListener('document:keydown.escape')
  closeMoreMenuOnEscape(): void {
    this.closeMoreMenu();
  }

  updateSearchTerm(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  searchProducts(): void {
    const query = this.searchTerm.trim();
    if (!query) return;

    this.router.navigate(['/product-list'], { queryParams: { q: query } });
    this.searchOpen = false;
    this.closeMenu();
  }
 }