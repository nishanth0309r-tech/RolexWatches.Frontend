import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProductService } from '../../services/product-service';
import { ProductFormComponent } from './product-form-component';
import { testProviders } from '../../test-providers';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends all product images in display order', () => {
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const create = vi.spyOn(TestBed.inject(ProductService), 'create').mockReturnValue(of({
      id: 1,
      name: 'Heritage Automatic',
      price: 1200
    }));
    component.form.patchValue({
      name: 'Heritage Automatic',
      description: 'A classic watch',
      price: 1200,
      stock: 5,
      imageUrl: ' /watch-front.jpg ',
      additionalImageUrls: '/watch-side.jpg\n/watch-back.jpg',
      brandId: 1,
      categoryId: 1
    });

    component.onSubmit();

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      imageUrl: '/watch-front.jpg',
      images: [
        { imageUrl: '/watch-front.jpg', isPrimary: true, displayOrder: 0 },
        { imageUrl: '/watch-side.jpg', isPrimary: false, displayOrder: 1 },
        { imageUrl: '/watch-back.jpg', isPrimary: false, displayOrder: 2 }
      ]
    }));
  });
});
