import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../../services/review-service';
import { Review } from '../../models/review';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-list-component',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './review-list-component.html',
  styleUrl: './review-list-component.css'
})
export class ReviewListComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private toastr = inject(ToastrService);

  reviews = signal<Review[]>([]);
  loading = signal(true);
  search = signal('');
  ratingFilter = signal(0);

  filtered = computed(() => {
  const term = this.search().trim().toLowerCase();
  const rating = this.ratingFilter();
  return this.reviews().filter(r =>
    (rating === 0 || r.rating === rating) &&
    (!term ||
      r.productName.toLowerCase().includes(term) ||
      r.userName.toLowerCase().includes(term) ||
      r.comment.toLowerCase().includes(term)));
  });

  average = computed(() => {
    const list = this.reviews();
    return list.length ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1) : '0.0';
  });   

  ngOnInit(): void { this.load(); }
  
  load(): void {
    this.reviewService.getAll().subscribe({
      next: data => { this.reviews.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toastr.error('Failed to load reviews'); }
    });
  }

  stars(n: number): string { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  deleteReview(r: Review): void {
    if (!confirm(`Delete ${r.userName}'s review of ${r.productName}?`)) return;
    this.reviewService.delete(r.id).subscribe({
      next: () => {
        this.reviews.set(this.reviews().filter(x => x.id !== r.id));
        this.toastr.success('Review deleted');
      },
      error: () => this.toastr.error('Failed to delete review')
    });
  }
}