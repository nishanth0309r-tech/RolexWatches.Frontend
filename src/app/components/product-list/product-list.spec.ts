import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product-service';
import { WishlistService } from '../../services/wishlist';
import { ProductList } from './product-list';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  const products: Product[] = [
    {
      id: 1,
      name: 'Offer Watch',
      price: 1500,
      discountPrice: 1200,
      brandId: 1,
      brandName: 'Rolex',
      categoryId: 10,
      categoryName: 'Classic',
      images: []
    },
    {
      id: 2,
      name: 'Regular Watch',
      price: 1000,
      brandId: 2,
      brandName: 'Omega',
      categoryId: 20,
      categoryName: 'Sport',
      images: []
    },
    {
      id: 3,
      name: 'Sport Watch',
      price: 1800,
      brandId: 2,
      brandName: 'Omega',
      categoryId: 20,
      categoryName: 'Sport',
      images: []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ offer: 'true' })) }
        },
        { provide: ProductService, useValue: { getAll: () => of(products), search: () => of({ items: products }) } },
        { provide: CartService, useValue: { addToCart: () => of(null) } },
        { provide: WishlistService, useValue: { addToWishlist: () => of(null) } },
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: ToastrService, useValue: { warning: () => undefined } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows only discounted watches for the special-offers campaign', () => {
    expect(component.isFiltered()).toBe(true);
    expect(component.title()).toBe('Special offers');
    expect(component.filteredProducts().map(product => product.name)).toEqual(['Offer Watch']);
    expect(fixture.nativeElement.textContent).toContain('Show all watches');
  });

  it('filters by category, brand, and an inclusive price range and sorts by price', () => {
    component.specialOffersOnly.set(false);
    component.selectedCategory.set('id:20');
    component.selectedBrand.set('id:2');
    component.setMinimumPrice(900);
    component.setMaximumPrice(1500);

    expect(component.filteredProducts().map(product => product.name)).toEqual(['Regular Watch']);

    component.maximumPrice.set(null);
    component.minimumPrice.set(null);
    component.sortOrder.set('price-high');
    expect(component.filteredProducts().map(product => product.name)).toEqual([
      'Sport Watch',
      'Regular Watch'
    ]);
  });

  it('keeps minimum and maximum prices within the available range and consistent', () => {
    component.setMinimumPrice(1900);
    expect(component.minimumPrice()).toBe(1800);

    component.setMaximumPrice(1000);
    expect(component.maximumPrice()).toBe(1000);
    expect(component.minimumPrice()).toBe(1000);
  });

  it('builds category and brand options from the loaded product collection', () => {
    expect(component.categoryOptions().map(option => option.label)).toEqual(['Classic', 'Sport']);
    expect(component.brandOptions().map(option => option.label)).toEqual(['Omega', 'Rolex']);
    expect(component.brandOptions().find(option => option.value === 'id:2')?.count).toBe(2);
  });
});
