import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentResult {
  success: boolean;
  transactionId: string | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/payments`;

  createCheckoutSession(orderId: number): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.api}/create-checkout-session`, { orderId });
  }

  // Asks the API to check with Stripe whether this order was paid
  verifyPayment(orderId: number): Observable<PaymentResult> {
    return this.http.post<PaymentResult>(`${this.api}/verify/${orderId}`, {});
  }

  // Old fake-card flow: delete this together with the old /payment page and the backend /pay endpoint
  pay(orderId: number, method: string, cardNumber?: string) {
    return this.http.post<PaymentResult>(`${this.api}/pay`, { orderId, method, cardNumber });
  }

  confirmCod(orderId: number): Observable<PaymentResult> {
  return this.http.post<PaymentResult>(`${this.api}/cod/${orderId}`, {});
  }
}