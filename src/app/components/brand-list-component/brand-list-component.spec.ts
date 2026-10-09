import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { BrandService } from '../../services/brand-service';
import { BrandListComponent } from './brand-list-component';

describe('BrandListComponent', () => {
  let component: BrandListComponent;
  let fixture: ComponentFixture<BrandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandListComponent],
      providers: [
        provideRouter([]),
        { provide: BrandService, useValue: { getAll: () => of([]) } },
        { provide: ToastrService, useValue: { error: () => undefined, success: () => undefined } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render the brand directory heading and empty state', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Brand directory');
    expect(fixture.nativeElement.textContent).toContain('No brands yet');
  });
});
