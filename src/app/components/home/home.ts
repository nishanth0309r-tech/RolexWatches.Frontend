import { isPlatformBrowser } from '@angular/common';
import { Component, computed, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';   // adjust to your file name
import { ProductCard } from '../product-card/product-card';
import { staggerFadeIn } from '../../animations/list-animations';
import { Product } from '../../models/product';

interface HomeCategory { id: number; name: string; icon: string; }
interface CampaignSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  cta: string;
  route: string[];
  queryParams?: Record<string, boolean>;
  fragment?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations: [staggerFadeIn]
})
export class Home implements OnInit, OnDestroy {
  readonly campaignSlides: CampaignSlide[] = [
    {
      id: 'best-sellers',
      eyebrow: 'THE FLUX TIME EDIT',
      title: 'Best sellers, made to be remembered.',
      description: 'Discover the timepieces customers return to, chosen for their enduring design and everyday presence.',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=2200&q=85',
      imageAlt: 'Refined stainless steel watch with a dark dial',
      cta: 'Shop best sellers',
      route: ['/home'],
      fragment: 'featured-products'
    },
    {
      id: 'special-offers',
      eyebrow: 'A MOMENT TO DISCOVER',
      title: 'Exceptional watches. Special prices.',
      description: 'Explore selected timepieces with special pricing while they are available.',
      image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=2200&q=85',
      imageAlt: 'Luxury watch showcased in warm golden light',
      cta: 'Explore special prices',
      route: ['/product-list'],
      queryParams: { offer: true }
    },
    {
      id: 'new-arrivals',
      eyebrow: 'JUST ARRIVED',
      title: 'Meet your next modern classic.',
      description: 'Fresh designs and considered details bring a new perspective to every hour.',
      image: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=2200&q=85',
      imageAlt: 'Contemporary watch with a polished metal bracelet',
      cta: 'Discover new arrivals',
      route: ['/product-list']
    }
  ];
  activeSlideIndex = signal(0);
  slideshowPaused = signal(false);
  products = signal<Product[]>([]);
  dealProducts = signal<Product[]>([]);
  featuredProducts = computed(() => {
    const deals = this.dealProducts();
    return deals.length > 0 ? deals.slice(0, 3) : this.products().slice(0, 3);
  });
  moreProducts = computed(() => {
    const featuredIds = new Set(this.featuredProducts().map(product => product.id));
    return this.products()
      .filter(product => !featuredIds.has(product.id))
      .slice(0, 3);
  });
  categories = signal<HomeCategory[]>([]);
  loading = signal(true);
  private slideshowTimer: ReturnType<typeof setInterval> | undefined;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.slideshowPaused.set(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
      this.startSlideshow();
    }

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
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  showSlide(index: number): void {
    this.activeSlideIndex.set((index + this.campaignSlides.length) % this.campaignSlides.length);
    this.restartSlideshow();
  }

  toggleSlideshow(): void {
    this.slideshowPaused.update(paused => !paused);
    this.restartSlideshow();
  }

  private startSlideshow(): void {
    this.stopSlideshow();
    if (!this.slideshowPaused()) {
      this.slideshowTimer = setInterval(() => {
        this.activeSlideIndex.update(index => (index + 1) % this.campaignSlides.length);
      }, 3500);
    }
  }

  private stopSlideshow(): void {
    if (this.slideshowTimer !== undefined) {
      clearInterval(this.slideshowTimer);
      this.slideshowTimer = undefined;
    }
  }

  private restartSlideshow(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startSlideshow();
    }
  }

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