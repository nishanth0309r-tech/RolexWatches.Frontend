import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../../Services/review-service';
import { Review } from '../../models/review';

@Component({
  selector: 'app-review-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list-component.html',
  styleUrl: './review-list-component.css'
})
export class ReviewListComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private toastr = inject(ToastrService);

  reviews: Review[] = [];

  ngOnInit(): void { this.reviewService.getAll().subscribe(data => this.reviews = data); }

  deleteReview(id: number): void {
    if (!confirm('Remove this review?')) return;
    this.reviewService.delete(id).subscribe({
      next: () => { this.toastr.success('Review removed'); this.reviews = this.reviews.filter(r => r.id !== id); },
      error: () => this.toastr.error('Failed to remove review')
    });
  }
}