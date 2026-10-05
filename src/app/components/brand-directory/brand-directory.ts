import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from '../../models/brand';
import { BrandService } from '../../services/brand-service';

@Component({
  selector: 'app-brand-directory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-directory.html',
  styleUrl: './brand-directory.css'
})
export class BrandDirectory implements OnInit {
  private readonly brandService = inject(BrandService);
  private readonly toastr = inject(ToastrService);

  brands = signal<Brand[]>([]);
  loading = signal(true);
  loadFailed = signal(false);

  ngOnInit(): void {
    this.brandService.getAll().subscribe({
      next: brands => {
        this.brands.set(brands.filter(brand => brand.isActive));
        this.loading.set(false);
      },
      error: () => {
        this.loadFailed.set(true);
        this.loading.set(false);
        this.toastr.error('Could not load the brand directory.');
      }
    });
  }
}
