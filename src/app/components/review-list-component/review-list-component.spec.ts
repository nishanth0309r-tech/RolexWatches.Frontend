import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewListComponent } from './review-list-component';
import { testProviders } from '../../test-providers';

describe('ReviewListComponent', () => {
  let component: ReviewListComponent;
  let fixture: ComponentFixture<ReviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewListComponent],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
