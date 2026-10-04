import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateReview, ProductReviewSummary, Review } from '../models/review';


@Injectable({ providedIn: 'root' })
export class ReviewService {
  private adminUrl  = `${environment.apiUrl}/admin/reviews`;
  private publicUrl = `${environment.apiUrl}/Reviews`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Review[]>
   { 
    return this.http.get<Review[]>(this.adminUrl ); 

   }
  delete(id: number): Observable<void>
   {
     return this.http.delete<void>(`${this.adminUrl }/${id}`); 
    }

  getForProduct(productId: number): Observable<ProductReviewSummary> {
    return this.http.get<ProductReviewSummary>(`${this.publicUrl}/product/${productId}`);
  }

  create(dto: CreateReview): Observable<Review> {
    return this.http.post<Review>(this.publicUrl, dto);
  }
}