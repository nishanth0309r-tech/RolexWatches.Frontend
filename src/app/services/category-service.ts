import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/admin/categories`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> { return this.http.get<Category[]>(this.baseUrl); }
  create(category: Partial<Category>): Observable<Category> { return this.http.post<Category>(this.baseUrl, category); }
  update(id: number, category: Partial<Category>): Observable<void> { return this.http.put<void>(`${this.baseUrl}/${id}`, category); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}