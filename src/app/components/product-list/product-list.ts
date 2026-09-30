import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products=signal<Product[]>([]);
  filteredProducts=signal<Product[]>([]);
  loading = signal(true);
  searchTerm = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.filteredProducts.set(data);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); }
    });
  }

  onSearch(): void {
    const term = this.searchTerm().toLowerCase();
    this.filteredProducts.set(this.products().filter(p =>
      p.name.toLowerCase().includes(term)
    ));
  }
}