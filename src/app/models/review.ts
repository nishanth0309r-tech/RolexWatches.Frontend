export interface Review {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductReviewSummary {
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface CreateReview {
  productId: number;
  rating: number;
  comment: string;
}