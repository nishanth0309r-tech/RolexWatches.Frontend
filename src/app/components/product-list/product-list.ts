import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../models/product';

interface ListingOption {
  value: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');
  readonly selectedBrand = signal('');
  readonly minimumPrice = signal<number | null>(null);
  readonly maximumPrice = signal<number | null>(null);
  readonly sortOrder = signal('featured');
  readonly specialOffersOnly = signal(false);

  readonly categoryOptions = computed(() => this.optionsFor('categoryId', 'categoryName'));
  readonly brandOptions = computed(() => this.optionsFor('brandId', 'brandName'));
  readonly priceCeiling = computed(() => Math.max(
    0,
    ...this.products().map(product => product.discountPrice ?? product.price)
  ));
  readonly priceFloor = computed(() => {
    const prices = this.products().map(product => product.discountPrice ?? product.price);
    return prices.length ? Math.min(...prices) : 0;
  });
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase();
    const category = this.selectedCategory();
    const brand = this.selectedBrand();
    const minPrice = this.minimumPrice();
    const maxPrice = this.maximumPrice();
    const sort = this.sortOrder();

    const result = this.products().filter(product => {
      const price = product.discountPrice ?? product.price;
      const matchesSearch = !term || [product.name, product.brandName, product.categoryName]
        .some(value => value?.toLocaleLowerCase().includes(term));
      const matchesCategory = !category || this.matchesOption(
        category,
        product.categoryId,
        product.categoryName
      );
      const matchesBrand = !brand || this.matchesOption(brand, product.brandId, product.brandName);

      return matchesSearch
        && matchesCategory
        && matchesBrand
        && (!this.specialOffersOnly() || !!product.discountPrice)
        && (minPrice === null || price >= minPrice)
        && (maxPrice === null || price <= maxPrice);
    });

    if (sort === 'price-low') {
      return result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    }
    if (sort === 'price-high') {
      return result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    }
    return result;
  });

  readonly isFiltered = computed(() =>
    !!this.selectedCategory()
    || !!this.selectedBrand()
    || this.minimumPrice() !== null
    || this.maximumPrice() !== null
    || !!this.searchTerm().trim()
    || this.specialOffersOnly()
  );

  readonly title = computed(() => {
    if (this.specialOffersOnly()) return 'Special offers';
    if (this.selectedCategory()) {
      return this.categoryOptions().find(option => option.value === this.selectedCategory())?.label
        ?? 'Category collection';
    }
    if (this.selectedBrand()) {
      return this.brandOptions().find(option => option.value === this.selectedBrand())?.label
        ?? 'Brand collection';
    }
    return 'The watch collection';
  });

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.selectedCategory.set(this.optionValue(params.get('category')));
      this.selectedBrand.set(this.optionValue(params.get('brand')));
      this.searchTerm.set(params.get('q') ?? '');
      this.specialOffersOnly.set(params.get('offer') === 'true');
      this.loadProducts();
    });
  }

  setMinimumPrice(rawValue: string | number): void {
    const value = this.normalizedPrice(rawValue);
    this.minimumPrice.set(value);
    if (value !== null && this.maximumPrice() !== null && this.maximumPrice()! < value) {
      this.maximumPrice.set(value);
    }
  }

  setMaximumPrice(rawValue: string | number): void {
    const value = this.normalizedPrice(rawValue);
    this.maximumPrice.set(value);
    if (value !== null && this.minimumPrice() !== null && this.minimumPrice()! > value) {
      this.minimumPrice.set(value);
    }
  }

  private normalizedPrice(rawValue: string | number): number | null {
    if (rawValue === '') return null;
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return null;
    return Math.min(this.priceCeiling(), Math.max(0, value));
  }

  resetFilters(): void {
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.minimumPrice.set(null);
    this.maximumPrice.set(null);
    this.searchTerm.set('');
    this.sortOrder.set('featured');
    this.specialOffersOnly.set(false);
    this.router.navigate(['/product-list']);
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: data => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private optionsFor(idKey: 'categoryId' | 'brandId', nameKey: 'categoryName' | 'brandName'): ListingOption[] {
    const options = new Map<string, ListingOption>();
    for (const product of this.products()) {
      const label = product[nameKey]?.trim();
      const id = product[idKey];
      if (!label && id === undefined) continue;

      const value = id === undefined ? `name:${label!.toLocaleLowerCase()}` : `id:${id}`;
      const option = options.get(value);
      if (option) {
        option.count += 1;
      } else {
        options.set(value, {
          value,
          label: label || `${idKey === 'brandId' ? 'Brand' : 'Category'} ${id}`,
          count: 1
        });
      }
    }
    return [...options.values()].sort((a, b) => a.label.localeCompare(b.label));
  }

  private optionValue(value: string | null): string {
    if (!value) return '';
    return /^\d+$/.test(value) ? `id:${value}` : `name:${value.toLocaleLowerCase()}`;
  }

  private matchesOption(selected: string, id: number | undefined, name: string | undefined): boolean {
    if (selected.startsWith('id:')) return id !== undefined && `id:${id}` === selected;
    return name?.toLocaleLowerCase() === selected.slice(5);
  }
}
