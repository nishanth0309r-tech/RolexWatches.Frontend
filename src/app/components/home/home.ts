import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { ProductCard } from '../product-card/product-card';
import { staggerFadeIn } from '../../animations/list-animations';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations: [staggerFadeIn]
})
export class Home implements OnInit {
  products: Product[] = [];
  dealProducts: Product[] = [];
  loading = true;

  categories = [
    { name: 'Dive Watches', icon: 'bi-water' },
    { name: 'Dress Watches', icon: 'bi-award' },
    { name: 'Chronographs', icon: 'bi-stopwatch' },
    { name: 'Smart Watches', icon: 'bi-cpu' },
    { name: 'Limited Edition', icon: 'bi-gem' },
    { name: 'Vintage', icon: 'bi-clock-history' },
  ];

  banners = [
    { title: 'New Arrivals', subtitle: 'The latest timepieces, freshly in stock', cta: 'Shop Now', bg: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
    { title: 'Up to 15% Off', subtitle: 'Selected watches this week only', cta: 'View Deals', bg: 'linear-gradient(135deg, #2c1810, #4a2c17)' },
    { title: 'Free Shipping', subtitle: 'On every order, no minimum', cta: 'Learn More', bg: 'linear-gradient(135deg, #0f2027, #203a43)' },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.dealProducts = data.filter(p => p.discountPrice);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}