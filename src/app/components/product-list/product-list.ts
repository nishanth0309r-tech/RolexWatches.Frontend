import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../models/product';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard,RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products=signal<Product[]>([]);
  filteredProducts=signal<Product[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  selectedCategoryId = signal<number | null>(null);
  selectedBrandId = signal<number | null>(null);
  isFiltered = computed(() => !!this.selectedCategoryId() || !!this.selectedBrandId());
  title = computed(() =>
    this.selectedCategoryId()
      ? (this.products()[0]?.categoryName ?? 'Category')
      : 'All Products');

  constructor(private productService: ProductService,
              private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const category = params.get('category');
      const brand = params.get('brand');
      this.selectedCategoryId.set(category ? Number(category) : null);
      this.selectedBrandId.set(brand ? Number(brand) : null);
      this.searchTerm.set('');
      this.loadProducts();
    });
  }

  private loadProducts(): void {
    this.loading.set(true);

    if (this.isFiltered()) {
      this.productService.search({
        categoryId: this.selectedCategoryId(),
        brandId: this.selectedBrandId()
      }).subscribe({
        next: result => this.setProducts(result.items),
        error: () => this.loading.set(false)
      });
    } else {
      this.productService.getAll().subscribe({
        next: data => this.setProducts(data),
        error: () => this.loading.set(false)
      });
    }
  }

  private setProducts(data: Product[]): void {
    this.products.set(data);
    this.filteredProducts.set(data);
    this.loading.set(false);
  }

  onSearch(): void {
    const term = this.searchTerm().toLowerCase();
    this.filteredProducts.set(this.products().filter(p =>
      p.name.toLowerCase().includes(term)
    ));
  }
}