import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { NEVER, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { OrderService } from '../../services/order-service';
import { testProviders } from '../../test-providers';
import { Orders } from './orders';

describe('Orders', () => {
  let component: Orders;
  let fixture: ComponentFixture<Orders>;
  let orderService: { getMyOrders: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    orderService = { getMyOrders: vi.fn().mockReturnValue(of([])) };
    await TestBed.configureTestingModule({
      imports: [Orders],
      providers: [
        ...testProviders,
        { provide: OrderService, useValue: orderService },
        { provide: ToastrService, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Orders);
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders a premium empty state when there are no orders', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Your collection begins here');
    expect(fixture.nativeElement.querySelector('a[routerLink="/product-list"]')).not.toBeNull();
  });

  it('shows order details, status, and payment action for a pending order', () => {
    component.orders.set([{
      id: 42,
      userId: 'customer-1',
      orderDate: '2026-10-05T10:00:00Z',
      createdAt: '2026-10-05T10:00:00Z',
      status: 0,
      totalAmount: 24000,
      shippingAddress: '12 Watch Lane',
      items: [{
        productId: 7,
        productName: 'Classic Automatic',
        unitPrice: 24000,
        quantity: 1,
        lineTotal: 24000
      }]
    }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('#42');
    expect(fixture.nativeElement.textContent).toContain('Classic Automatic');
    expect(fixture.nativeElement.textContent).toContain('Pending');
    expect(fixture.nativeElement.querySelector('.pay-link')?.textContent).toContain('Complete payment');
  });

  it('shows a loading treatment while orders are being fetched', () => {
    orderService.getMyOrders.mockReturnValue(NEVER);
    const loadingFixture = TestBed.createComponent(Orders);
    loadingFixture.detectChanges();

    expect(loadingFixture.nativeElement.querySelector('[aria-label="Loading your orders"]')).not.toBeNull();
    loadingFixture.destroy();
  });

  it('offers a retry state when orders cannot be loaded', () => {
    orderService.getMyOrders.mockReturnValue(throwError(() => new Error('Unavailable')));
    const failedFixture = TestBed.createComponent(Orders);
    failedFixture.detectChanges();

    expect(failedFixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(failedFixture.nativeElement.textContent).toContain('Try again');
    failedFixture.destroy();
  });
});
