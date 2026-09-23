import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer-service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list-component.html',
  styleUrl: './customer-list-component.css'
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private toastr = inject(ToastrService);

  customers: Customer[] = [];

  ngOnInit(): void { this.customerService.getAll().subscribe(data => this.customers = data); }

  toggleBlock(customer: Customer): void {
    this.customerService.toggleBlock(customer.id).subscribe({
      next: () => { customer.isActive = !customer.isActive; this.toastr.success(customer.isActive ? 'Customer unblocked' : 'Customer blocked'); },
      error: () => this.toastr.error('Action failed')
    });
  }
}