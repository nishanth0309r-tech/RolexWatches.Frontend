import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review } from '../models/review';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = `${environment.apiUrl}/admin/reviews`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Review[]>
   { 
    return this.http.get<Review[]>(this.baseUrl); 

   }
  delete(id: number): Observable<void>
   {
     return this.http.delete<void>(`${this.baseUrl}/${id}`); 
    }
}