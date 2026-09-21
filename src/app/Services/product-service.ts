import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, CreateProduct, UpdateProduct } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiUrl}/admin/products`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]>
   { 
    return this.http.get<Product[]>(this.baseUrl); 
}
  getById(id: number): Observable<Product>
   {
     return this.http.get<Product>(`${this.baseUrl}/${id}`);
     }
  create(product: CreateProduct): Observable<Product> 
  {
     return this.http.post<Product>(this.baseUrl, product);
     }
  update(id: number, product: UpdateProduct): Observable<void>
   {
     return this.http.put<void>(`${this.baseUrl}/${id}`, product); 
    }
  delete(id: number): Observable<void> 
  {
     return this.http.delete<void>(`${this.baseUrl}/${id}`);
     }
}