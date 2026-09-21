import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DashboardSummary } from '../../Models/dashboard';
import { DashboardService } from '../../Services/dashboard-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [CommonModule],
  selector: 'app-dashboard-component',
  styleUrl: './dashboard-component.css',
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private toastr = inject(ToastrService);

  summary?: DashboardSummary;
  loading = true;

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => { this.summary = data; this.loading = false; },
      error: () => { this.toastr.error('Failed to load dashboard'); this.loading = false; }
    });
  }
}