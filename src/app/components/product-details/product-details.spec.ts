import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product-service';
import { ReviewService } from '../../services/review-service';
import { WishlistService } from '../../services/wishlist';
import { ProductDetails } from './product-details';

describe('ProductDetails', () => {
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
      imports: [ProductDetails],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: ProductService, useValue: { getById: () => of(product) } },
        { provide: CartService, useValue: { addToCart: () => of(null) } },
        { provide: WishlistService, useValue: { addToWishlist: () => of(null) } },
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: ReviewService, useValue: { getForProduct: () => of({ averageRating: 0, reviewCount: 0, reviews: [] }) } },
        { provide: ToastrService, useValue: {} }
      ],
    }).compileComponents();
  });

  it('should create and show the primary image first', async () => {
    const fixture = TestBed.createComponent(ProductDetails);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.imageUrl()).toBe('/watch-front.jpg');
    expect(fixture.componentInstance.galleryImages()).toHaveLength(2);
  });

  it('should switch the main image when a thumbnail is selected', async () => {
    const fixture = TestBed.createComponent(ProductDetails);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.selectImage(1);

    expect(fixture.componentInstance.imageUrl()).toBe('/watch-side.jpg');
  });
});
