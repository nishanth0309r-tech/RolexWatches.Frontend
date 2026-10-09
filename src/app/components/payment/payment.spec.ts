import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { MyOrder } from '../../models/order';
import { OrderService } from '../../services/order-service';
import { PaymentService } from '../../services/payment-service';
import { Payment } from './payment';

describe('Payment', () => {
  let component: Payment;
  let fixture: ComponentFixture<Payment>;
  const order: MyOrder = {
    id: 5,
    userId: 'customer-1',
    orderDate: '2026-10-06',
    createdAt: '2026-10-06',
    status: 'Pending',
    totalAmount: 9500,
    shippingAddress: '1 Watch Street',
    items: []
  };
  const paymentApi = {
    pay: vi.fn(() => of({ success: true, transactionId: 'test-transaction', message: 'Paid' }))
  };
  const router = { navigate: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Payment],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '5' } } } },
        { provide: OrderService, useValue: { getMyOrders: () => of([order]) } },
        { provide: PaymentService, useValue: paymentApi },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: { success: vi.fn(), error: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Payment);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    paymentApi.pay.mockClear();
    router.navigate.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('offers premium checkout choices and only asks for card details for cards', () => {
    const methods = fixture.nativeElement.querySelectorAll('.method-option');
    expect(methods).toHaveLength(4);
    expect(fixture.nativeElement.querySelector('#card-number')).not.toBeNull();

    component.form.controls.method.setValue('CashOnDelivery');
    fixture.detectChanges();

    expect(component.form.controls.cardNumber.valid).toBe(true);
    expect(fixture.nativeElement.querySelector('#card-number')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Pay in cash when your watch is delivered');
  });

  it('submits cash on delivery without sending card details', () => {
    component.form.controls.method.setValue('CashOnDelivery');

    component.pay();

    expect(paymentApi.pay).toHaveBeenCalledWith(5, 'CashOnDelivery', undefined);
    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  });

  it('requires a valid card number when card is selected', () => {
    component.form.controls.cardNumber.setValue('123');

    component.pay();

    expect(paymentApi.pay).not.toHaveBeenCalled();
    expect(component.form.controls.cardNumber.touched).toBe(true);
  });
});
