import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DashboardService } from '../../services/dashboard-service';
import { DashboardComponent } from './dashboard-component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: { getSummary: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dashboardService = {
      getSummary: vi.fn().mockReturnValue(of({
        totalProducts: 12,
        totalOrders: 3,
        totalCustomers: 8,
        totalRevenue: 50000,
        recentOrders: []
      }))
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardService, useValue: dashboardService },
        { provide: ToastrService, useValue: { error: vi.fn() } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
  });

  it('shows summary cards when the dashboard data loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Total Products');
    expect(fixture.nativeElement.textContent).toContain('Total Customers');
  });

  it('shows a retry action when dashboard data fails to load', async () => {
    dashboardService.getSummary.mockReturnValue(throwError(() => new Error('Unavailable')));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });
});
