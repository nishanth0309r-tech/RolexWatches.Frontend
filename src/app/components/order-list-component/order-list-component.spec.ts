import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { OrderService } from '../../services/order-service';
import { OrderListComponent } from './order-list-component';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [
        { provide: OrderService, useValue: { getAll: () => of([]) } },
        { provide: ToastrService, useValue: { error: () => undefined, success: () => undefined } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders the order register and empty state', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Manage orders');
    expect(fixture.nativeElement.textContent).toContain('Order register');
    expect(fixture.nativeElement.textContent).toContain('No orders yet');
  });
});
