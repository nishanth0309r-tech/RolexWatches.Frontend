import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Profile } from './profile';

describe('Profile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            currentUser: signal({
              id: 7,
              fullName: 'Flux Customer',
              email: 'customer@example.com',
              phoneNumber: '9876543210',
              role: 'Customer'
            })
          }
        }
      ]
    }).compileComponents();
  });

  it('shows account details and useful account shortcuts', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Flux Customer');
    expect(content).toContain('customer@example.com');
    expect(content).toContain('9876543210');
    expect(content).toContain('My orders');
    expect(content).toContain('My wishlist');
    expect(content).toContain('Contact concierge');
  });
});
