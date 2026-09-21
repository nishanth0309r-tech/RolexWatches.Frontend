import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem, AddToCartRequest } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/Cart`;
  private localCart: CartItem[] = [];
  private nextLocalId = 1000;
  private isBrowser: boolean;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) this.loadLocalCart();
  }

  private loadLocalCart(): void {
    try {
      const saved = localStorage.getItem('rw_local_cart');
      if (saved) this.localCart = JSON.parse(saved);
      this.cartCountSubject.next(this.localCart.reduce((s, i) => s + i.quantity, 0));
    } catch {}
  }

  private saveLocalCart(): void {
    if (!this.isBrowser) return;
    try { localStorage.setItem('rw_local_cart', JSON.stringify(this.localCart)); } catch {}
    this.cartCountSubject.next(this.localCart.reduce((s, i) => s + i.quantity, 0));
  }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl).pipe(
      tap(items => this.cartCountSubject.next(items.reduce((s, i) => s + i.quantity, 0))),
      catchError(() => {
        console.warn('Cart API unreachable — using local cart.');
        return of(this.localCart);
      })
    );
  }

  addToCart(dto: AddToCartRequest): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, dto).pipe(
      tap(() => this.refreshCount()),
      catchError(() => {
        const existing = this.localCart.find(i => i.productId === dto.productId);
        if (existing) {
          existing.quantity += dto.quantity;
          existing.total = existing.price * existing.quantity;
        } else {
          this.localCart.push({
            id: this.nextLocalId++,
            productId: dto.productId,
            productName: `Product #${dto.productId}`,
            imageUrl: '',
            price: 0,
            quantity: dto.quantity,
            total: 0
          });
        }
        this.saveLocalCart();
        return of(this.localCart[this.localCart.length - 1]);
      })
    );
  }

  updateQuantity(id: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { quantity }).pipe(
      catchError(() => {
        const item = this.localCart.find(i => i.id === id);
        if (item) {
          item.quantity = quantity;
          item.total = item.price * quantity;
          this.saveLocalCart();
        }
        return of(void 0);
      })
    );
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshCount()),
      catchError(() => {
        this.localCart = this.localCart.filter(i => i.id !== id);
        this.saveLocalCart();
        return of(void 0);
      })
    );
  }

  private refreshCount(): void {
    this.getCart().subscribe();
  }
}