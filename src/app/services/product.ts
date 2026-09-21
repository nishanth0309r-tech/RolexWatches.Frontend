import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/Products`;

  private mockProducts: Product[] = [
    { id: 1, name: 'Rolex Submariner', imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80', price: 8500, discountPrice: 7900 },
    { id: 2, name: 'Omega Seamaster', imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&q=80', price: 5200 },
    { id: 3, name: 'Rolex Daytona', imageUrl: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500&q=80', price: 12000, discountPrice: 11200 },
    { id: 4, name: 'Tag Heuer Carrera', imageUrl: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500&q=80', price: 3400 },
    { id: 5, name: 'Rolex GMT-Master II', imageUrl: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500&q=80', price: 9800 },
    { id: 6, name: 'Patek Philippe Nautilus', imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&q=80', price: 28000 },
    { id: 7, name: 'Rolex Datejust', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80', price: 7200, discountPrice: 6800 },
    { id: 8, name: 'Audemars Piguet Royal Oak', imageUrl: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=500&q=80', price: 22000 },
  ];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(() => {
        console.warn('Product API unreachable — showing demo data instead.');
        return of(this.mockProducts);
      })
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.mockProducts.find(p => p.id === id);
        return of(found ?? this.mockProducts[0]);
      })
    );
  }
}