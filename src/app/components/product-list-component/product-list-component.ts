import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);

  products: Product[] = [];

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => this.products = data,
      error: () => this.toastr.error('Failed to load products')
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => { this.toastr.success('Product deleted'); this.products = this.products.filter(p => p.id !== id); },
      error: () => this.toastr.error('Failed to delete product')
    });
  }
}