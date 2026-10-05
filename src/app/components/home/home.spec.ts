import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart';
import { CategoryService } from '../../services/category-service';
import { ProductService } from '../../services/product-service';
import { WishlistService } from '../../services/wishlist';
import { Home } from './home';
import { vi } from 'vitest';

describe('Home', () => {
  const products: Product[] = [
    { id: 1, name: 'Watch One', price: 100, discountPrice: 90, images: [] },
    { id: 2, name: 'Watch Two', price: 200, discountPrice: 180, images: [] },
    { id: 3, name: 'Watch Three', price: 300, discountPrice: 270, images: [] },
    { id: 4, name: 'Watch Four', price: 400, images: [] },
    { id: 5, name: 'Watch Five', price: 500, images: [] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: { getAll: () => of(products) } },
        { provide: CategoryService, useValue: { getAll: () => of([]) } },
        { provide: CartService, useValue: { addToCart: () => of(null) } },
        { provide: WishlistService, useValue: { addToWishlist: () => of(null) } },
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: ToastrService, useValue: { warning: () => undefined } }
      ],
    }).compileComponents();
  });

  it('shows up to three discounted watches first and the remaining watches in the second row', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.featuredProducts().map(product => product.id)).toEqual([1, 2, 3]);
    expect(fixture.componentInstance.moreProducts().map(product => product.id)).toEqual([4, 5]);
    expect(fixture.nativeElement.querySelectorAll('.showcase-row')).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('A collection worth keeping.');
    expect(fixture.nativeElement.textContent).toContain('Make every second count.');
    expect(fixture.nativeElement.querySelector('#collections')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#about')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('A considered approach to time.');
  });

  it('renders the three campaign slides and allows manual slide selection', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.campaignSlides.map(slide => slide.id)).toEqual([
      'best-sellers',
      'special-offers',
      'new-arrivals'
    ]);
    expect(fixture.nativeElement.querySelectorAll('.campaign-slide')).toHaveLength(3);

    fixture.componentInstance.showSlide(2);
    fixture.detectChanges();

    expect(fixture.componentInstance.activeSlideIndex()).toBe(2);
    expect(fixture.nativeElement.querySelector('.campaign-slide.is-active h1').textContent)
      .toContain('modern classic');
  });

  it('can pause and resume automatic campaign rotation', () => {
    const fixture = TestBed.createComponent(Home);
    const home = fixture.componentInstance;

    home.slideshowPaused.set(true);
    home.toggleSlideshow();
    expect(home.slideshowPaused()).toBe(false);

    home.toggleSlideshow();
    expect(home.slideshowPaused()).toBe(true);
  });

  it('automatically advances campaign slides after the display interval', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    vi.advanceTimersByTime(3500);
    expect(fixture.componentInstance.activeSlideIndex()).toBe(1);

    fixture.destroy();
    vi.useRealTimers();
  });
});
