import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the Flux Time analog-clock wordmark', () => {
    fixture.detectChanges();
    const logo = fixture.nativeElement.querySelector('.footer-brand') as HTMLElement;
    const emblem = logo.querySelector('svg.brand-emblem') as SVGElement;

    expect(logo).not.toBeNull();
    expect(emblem.querySelector('path.emblem-crest')).not.toBeNull();
    expect(emblem.querySelector('text.emblem-letter')?.textContent).toBe('F');
    expect(emblem.querySelector('circle.emblem-face')).toBeNull();
    expect(emblem.textContent).not.toContain('FT');
    expect(logo.textContent).toContain('Flux');
    expect(logo.textContent).toContain('TIME');
  });
});
