import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReviewService } from '../../services/review-service';
import { ProductReviews } from './product-reviews';
import { testProviders } from '../../test-providers';

describe('ProductReviews', () => {
  let component: ProductReviews;
  let fixture: ComponentFixture<ProductReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReviews],
      providers: [
        ...testProviders,
        {
          provide: ReviewService,
          useValue: {
            getForProduct: () => of({ averageRating: 0, reviewCount: 0, reviews: [] })
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReviews);
    fixture.componentRef.setInput('productId', 1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
