import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { BrandService } from '../../services/brand-service';
import { BrandDirectory } from './brand-directory';

describe('BrandDirectory', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandDirectory],
      providers: [
        provideRouter([]),
        {
          provide: BrandService,
          useValue: {
            getAll: () => of([
              { id: 1, name: 'Heritage', logoUrl: null, description: 'Classic pieces', isActive: true, productCount: 4 },
              { id: 2, name: 'Hidden', logoUrl: null, description: null, isActive: false, productCount: 0 }
            ])
          }
        },
        { provide: ToastrService, useValue: { error: () => undefined } }
      ]
    }).compileComponents();
  });

  it('lists active brands and links each to its filtered products', async () => {
    const fixture = TestBed.createComponent(BrandDirectory);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.brand-card') as NodeListOf<HTMLAnchorElement>;
    expect(cards).toHaveLength(1);
    expect(cards[0].textContent).toContain('Heritage');
    expect(cards[0].getAttribute('href')).toBe('/product-list?brand=1');
  });
});
