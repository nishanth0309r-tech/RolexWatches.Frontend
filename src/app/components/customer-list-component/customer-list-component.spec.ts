import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { CustomerService } from '../../services/customer-service';
import { CustomerListComponent } from './customer-list-component';

describe('CustomerListComponent', () => {
  let fixture: ComponentFixture<CustomerListComponent>;
  let customerService: { getAll: ReturnType<typeof vi.fn>; toggleBlock: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    customerService = {
      getAll: vi.fn().mockReturnValue(of([
        { id: 1, fullName: 'Asha Rao', email: 'asha@example.com', isActive: true }
      ])),
      toggleBlock: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [CustomerListComponent],
      providers: [
        { provide: CustomerService, useValue: customerService },
        { provide: ToastrService, useValue: { error: vi.fn(), success: vi.fn() } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListComponent);
  });

  it('shows customer rows when customer data loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Asha Rao');
    expect(fixture.nativeElement.textContent).toContain('Active');
  });

  it('shows an empty state when there are no customers', async () => {
    customerService.getAll.mockReturnValue(of([]));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No customers yet');
  });

  it('shows a retry action when customer data fails to load', async () => {
    customerService.getAll.mockReturnValue(throwError(() => new Error('Unavailable')));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });
});
