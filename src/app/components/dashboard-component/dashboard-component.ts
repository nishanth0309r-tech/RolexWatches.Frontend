import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DashboardSummary } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard-service';
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

  // summary?: DashboardSummary;
  // loading = true;
  summary = signal<DashboardSummary | undefined>(undefined);
  loading = signal(true);

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => { this.summary.set(data); this.loading.set(false); },
      error: () => { this.toastr.error('Failed to load dashboard'); this.loading.set(false); }
    });
  }
}