import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, SaveCategory } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> { return this.http.get<Category[]>(this.baseUrl); }
  create(category: SaveCategory): Observable<Category> { return this.http.post<Category>(this.baseUrl, category); }
  update(id: number, category: SaveCategory): Observable<void> { return this.http.put<void>(`${this.baseUrl}/${id}`, category); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}