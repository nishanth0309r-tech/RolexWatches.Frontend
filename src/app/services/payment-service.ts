import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

export interface PaymentResult {
  success: boolean;
  transactionId: string | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  pay(orderId: number, method: string, cardNumber?: string) {
    return this.http.post<PaymentResult>(`${this.api}/payments/pay`, { orderId, method, cardNumber });
  }
}