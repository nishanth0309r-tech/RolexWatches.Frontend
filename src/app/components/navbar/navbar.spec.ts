import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { currentUser: signal(null), logout: () => undefined } },
        { provide: CartService, useValue: { cartCount$: of(0) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles the responsive navigation menu', () => {
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);

    component.closeMenu();
    expect(component.menuOpen).toBe(false);
  });

  it('opens a useful account menu with a profile link', () => {
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.more-menu-toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(component.moreMenuOpen).toBe(true);
    const menu = fixture.nativeElement.querySelector('.more-menu-panel') as HTMLElement;
    expect(menu.textContent).toContain('Sign in');
    expect(menu.textContent).toContain('Help & support');

    component.auth.currentUser.set({
      id: 1,
      fullName: 'Flux Customer',
      email: 'customer@example.com',
      role: 'Customer'
    });
    fixture.detectChanges();

    const signedInMenu = fixture.nativeElement.querySelector('.more-menu-panel') as HTMLElement;
    expect(signedInMenu.textContent).toContain('My profile');
    expect(signedInMenu.textContent).toContain('My orders');
    expect(signedInMenu.textContent).toContain('Wishlist');
  });

  it('searches the product list using the entered query', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.searchTerm = '  Datejust  ';

    component.searchProducts();

    expect(navigate).toHaveBeenCalledWith(['/product-list'], { queryParams: { q: 'Datejust' } });
    expect(component.searchOpen).toBe(false);
    expect(component.menuOpen).toBe(false);
  });

  it('does not navigate when the search query is empty', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.searchProducts();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('links the brands item to the public directory', () => {
    fixture.detectChanges();
    const brandsLink = fixture.nativeElement.querySelector('a[routerlink="/brands"]');

    expect(brandsLink).not.toBeNull();
  });

  it('shows the full admin navigation for administrators', () => {
    component.auth.currentUser.set({
      id: 1,
      fullName: 'Store Admin',
      email: 'admin@example.com',
      role: 'Admin'
    });
    fixture.detectChanges();

    const navigation = fixture.nativeElement.querySelector('#main-navigation') as HTMLElement;
    expect(navigation.textContent).toContain('Dashboard');
    expect(navigation.textContent).toContain('Customers');
    expect(navigation.textContent).toContain('Manage brands');
    expect(navigation.textContent).toContain('Categories');
    expect(navigation.textContent).toContain('Manage orders');
    expect(navigation.textContent).toContain('Reviews');
  });

  it('links About, Collections, and Contact to pages with dedicated content', () => {
    fixture.detectChanges();
    const aboutLink = fixture.nativeElement.querySelector('a[routerlink="/about"]');
    const collectionsLink = fixture.nativeElement.querySelector('a[routerlink="/collections"]');
    const contactLink = fixture.nativeElement.querySelector('a[routerlink="/contact"]');

    expect(aboutLink).not.toBeNull();
    expect(collectionsLink).not.toBeNull();
    expect(contactLink).not.toBeNull();
  });
});
