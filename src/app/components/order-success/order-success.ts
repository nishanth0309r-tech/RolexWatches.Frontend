import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order-service';
import { switchMap, take, takeWhile, timer } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-order-success',
  styleUrl: './order-success.css',
  templateUrl: './order-success.html',
})
export class OrderSuccess implements OnInit {
    private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  status = signal<string>('Checking');   // Checking | Pending | Processing | ...

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));

    timer(0, 2000).pipe(                                      // now, then every 2 seconds
      switchMap(() => this.orderService.getById(orderId)),    // use your real method name
      takeWhile(order => order.status === 'Pending', true),   // stop once the status changes
      take(8)                                                 // give up after ~16 seconds
    ).subscribe(order => this.status.set(order.status));
  }
}
