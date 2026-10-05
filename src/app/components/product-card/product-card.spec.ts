import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localeEnIn from '@angular/common/locales/en-IN';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { Product } from '../../models/product';
import { ProductCard } from './product-card';

registerLocaleData(localeEnIn);

describe('ProductCard', () => {
  const product: Product = {
    id: 1,
    name: 'Heritage Automatic',
    price: 1200,
    images: [
      { id: 1, imageUrl: '/watch-side.jpg', isPrimary: false, displayOrder: 1 },
      { id: 2, imageUrl: '/watch-front.jpg', isPrimary: true, displayOrder: 0 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: { addToCart: () => of(null) } },
        { provide: WishlistService, useValue: { addToWishlist: () => of(null) } },
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: ToastrService, useValue: {} }
      ],
    }).compileComponents();
  });

  it('should create and use the primary product image', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.imageUrl()).toBe('/watch-front.jpg');
  });

  it('should switch images from the product thumbnail gallery', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    fixture.componentInstance.selectImage(1);

    expect(fixture.componentInstance.imageUrl()).toBe('/watch-side.jpg');
    expect(fixture.nativeElement.querySelectorAll('.watch-thumbnail')).toHaveLength(2);
  });

  it('formats product prices with Indian rupees and digit grouping', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', { ...product, price: 120000 });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('₹1,20,000');
  });
});
