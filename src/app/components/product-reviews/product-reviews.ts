import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review-service';
import { ToastrService } from 'ngx-toastr';
import { ProductReviewSummary } from '../../models/review';
import { DatePipe } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule,DatePipe],
  selector: 'app-product-reviews',
  styleUrl: './product-reviews.css',
  templateUrl: './product-reviews.html',
})
export class ProductReviews implements OnInit{
    productId = input.required<number>();

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private toastr = inject(ToastrService);
  private auth = inject(AuthService);

  data = signal<ProductReviewSummary | null>(null);
  rating = signal(0);
  submitting = signal(false);
  starValues = [1, 2, 3, 4, 5];

  form = this.fb.nonNullable.group({
    comment: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  get loggedIn(): boolean { return this.auth.isLoggedIn(); }   // use your AuthService's real property or method

  ngOnInit(): void { this.load(); }

  load(): void {
    this.reviewService.getForProduct(this.productId()).subscribe(d => this.data.set(d));
  }

  stars(n: number): string {
    const full = Math.round(n);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  submit(): void {
    if (this.rating() === 0) { this.toastr.warning('Please choose a star rating.'); return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    this.reviewService.create({
      productId: this.productId(),
      rating: this.rating(),
      comment: this.form.controls.comment.value.trim()
    }).subscribe({
      next: () => {
        this.toastr.success('Thanks for your review!');
        this.submitting.set(false);
        this.rating.set(0);
        this.form.reset({ comment: '' });
        this.load();
      },
      error: err => {
        this.submitting.set(false);
        this.toastr.error(typeof err?.error === 'string' ? err.error : 'Could not submit your review.');
      }
    });
  }
}
