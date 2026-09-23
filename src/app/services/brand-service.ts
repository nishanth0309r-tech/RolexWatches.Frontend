import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Brand } from '../models/brand';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private baseUrl = `${environment.apiUrl}/admin/brands`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Brand[]>
   { 
    return this.http.get<Brand[]>(this.baseUrl);
   }
  create(brand: Partial<Brand>): Observable<Brand> 
  {
     return this.http.post<Brand>(this.baseUrl, brand);
     }
  update(id: number, brand: Partial<Brand>): Observable<void> 
  {
     return this.http.put<void>(`${this.baseUrl}/${id}`, brand); }
  delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.baseUrl}/${id}`); 
    }
}