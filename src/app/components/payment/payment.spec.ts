import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Payment } from './payment';
import { testProviders } from '../../test-providers';

describe('Payment', () => {
  let component: Payment;
  let fixture: ComponentFixture<Payment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Payment],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(Payment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
