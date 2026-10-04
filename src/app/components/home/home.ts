import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';   // adjust to your file name
import { ProductCard } from '../product-card/product-card';
import { staggerFadeIn } from '../../animations/list-animations';
import { Product } from '../../models/product';

interface HomeCategory { id: number; name: string; icon: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations: [staggerFadeIn]
})
export class Home implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  dealProducts = signal<Product[]>([]);
  categories = signal<HomeCategory[]>([]);
  loading = signal(true);

  current = signal(0);
  paused = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  banners = [
    { title: 'New Arrivals', subtitle: 'The latest timepieces, freshly in stock', cta: 'Shop Now', link: '/product-list', bg: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
    { title: 'Up to 15% Off', subtitle: 'Selected watches this week only', cta: 'View Deals', link: '/product-list', bg: 'linear-gradient(135deg, #2c1810, #4a2c17)' },
    { title: 'Free Shipping', subtitle: 'On every order, no minimum', cta: 'Browse Watches', link: '/product-list', bg: 'linear-gradient(135deg, #0f2027, #203a43)' },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: data => {
        this.products.set(data);
        this.dealProducts.set(data.filter(p => p.discountPrice));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.categoryService.getAll().subscribe({
      next: cats => this.categories.set(
        cats.slice(0, 6).map(c => ({ id: c.id, name: c.name, icon: this.iconFor(c.name) }))
      )
    });

    // auto-slide only in the browser (not during server-side rendering)
    if (isPlatformBrowser(this.platformId)) {
      this.timer = setInterval(() => { if (!this.paused) this.next(); }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  next(): void { this.current.set((this.current() + 1) % this.banners.length); }
  prev(): void { this.current.set((this.current() - 1 + this.banners.length) % this.banners.length); }
  goTo(i: number): void { this.current.set(i); }

  private iconFor(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('div')) return 'bi-water';
    if (n.includes('dress')) return 'bi-award';
    if (n.includes('chrono')) return 'bi-stopwatch';
    if (n.includes('smart') || n.includes('digital')) return 'bi-cpu';
    if (n.includes('pilot')) return 'bi-airplane';
    if (n.includes('field')) return 'bi-compass';
    if (n.includes('gold')) return 'bi-gem';
    if (n.includes('steel')) return 'bi-shield-check';
    if (n.includes('leather')) return 'bi-bag';
    return 'bi-watch';
  }
}