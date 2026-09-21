import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { WishlistItem, AddToWishlistRequest } from '../models/wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/Wishlist`;
  private localWishlist: WishlistItem[] = [];
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) this.loadLocalWishlist();
  }

  private loadLocalWishlist(): void {
    try {
      const saved = localStorage.getItem('rw_local_wishlist');
      if (saved) this.localWishlist = JSON.parse(saved);
    } catch {}
  }

  private saveLocalWishlist(): void {
    if (!this.isBrowser) return;
    try { localStorage.setItem('rw_local_wishlist', JSON.stringify(this.localWishlist)); } catch {}
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl).pipe(
      catchError(() => {
        console.warn('Wishlist API unreachable — using local wishlist.');
        return of(this.localWishlist);
      })
    );
  }

  addToWishlist(dto: AddToWishlistRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, dto).pipe(
      catchError(() => {
        if (!this.localWishlist.find(i => i.productId === dto.productId)) {
          this.localWishlist.push({
            id: Date.now(),
            productId: dto.productId,
            productName: `Product #${dto.productId}`,
            imageUrl: '',
            price: 0
          });
          this.saveLocalWishlist();
        }
        return of(true);
      })
    );
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`).pipe(
      catchError(() => {
        this.localWishlist = this.localWishlist.filter(i => i.productId !== productId);
        this.saveLocalWishlist();
        return of(void 0);
      })
    );
  }
}