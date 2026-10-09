import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { EditorialPage } from './editorial-page';

describe('EditorialPage', () => {
  let routeData: Subject<Record<string, unknown>>;

  beforeEach(async () => {
    routeData = new Subject<Record<string, unknown>>();
    await TestBed.configureTestingModule({
      imports: [EditorialPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { data: routeData.asObservable() } }
      ]
    }).compileComponents();
  });

  it('renders About content', () => {
    const fixture = TestBed.createComponent(EditorialPage);
    fixture.detectChanges();
    routeData.next({ page: 'about' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Chosen with care. Worn for years.');
  });

  it('renders Collections content', () => {
    const fixture = TestBed.createComponent(EditorialPage);
    fixture.detectChanges();
    routeData.next({ page: 'collections' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Automatic classics');
  });

  it('renders Contact details', () => {
    const fixture = TestBed.createComponent(EditorialPage);
    fixture.detectChanges();
    routeData.next({ page: 'contact' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Contact the concierge.');
    expect(fixture.nativeElement.querySelector('a[href^="mailto:"]')).not.toBeNull();
  });
});
