import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateProduct, Product, UpdateProduct } from '../models/product';

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly publicUrl = `${environment.apiUrl}/Products`;
  private readonly adminUrl = `${environment.apiUrl}/admin/products`;

 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.publicUrl).pipe(
      catchError(() => {
        console.warn('Product API unreachable — showing demo data instead.');
        return of();
      })
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.publicUrl}/${id}`).pipe(
      catchError(() => {
        console.warn(`Product API unreachable — showing demo data for product ID ${id} instead.`);
        return of();
      })
      
    );
  }

  search(filter: { categoryId?: number | null; brandId?: number | null }): Observable<PagedResult<Product>> {
    let params = new HttpParams().set('pageSize', 100);
      if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
      if (filter.brandId) params = params.set('brandId', filter.brandId);
    return this.http.get<PagedResult<Product>>(`${this.publicUrl}/search`, { params });
  }

  create(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(this.adminUrl, product);
  }

  update(id: number, product: UpdateProduct): Observable<void> {
    return this.http.put<void>(`${this.adminUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}