import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CategoryService } from '../../services/category-service';
import { CategoryListComponent } from './category-list-component';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        provideRouter([]),
        { provide: CategoryService, useValue: { getAll: () => of([]) } },
        { provide: ToastrService, useValue: { error: () => undefined, success: () => undefined } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render the category directory heading and empty state', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Category directory');
    expect(fixture.nativeElement.textContent).toContain('No categories yet');
  });
});
