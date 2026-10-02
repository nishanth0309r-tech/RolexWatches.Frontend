import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../../services/brand-service';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-brand-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-list-component.html',
  styleUrl: './brand-list-component.css'
})
export class BrandListComponent implements OnInit {
  private brandService = inject(BrandService);
  private toastr = inject(ToastrService);

  brands = signal<Brand[]>([]);
  newBrandName = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.brandService.getAll().subscribe(data => this.brands.set(data));
  }

  addBrand(): void {
    const name = this.newBrandName().trim();
    if (!name) return;

    this.brandService.create({ name }).subscribe({
      next: () => {
        this.toastr.success('Brand added');
        this.newBrandName.set('');
        this.load();
      },
      error: () => this.toastr.error('Failed to add brand')
    });
  }

  deleteBrand(id: number): void {
    if (!confirm('Delete this brand?')) return;
    this.brandService.delete(id).subscribe({
      next: () => { this.toastr.success('Brand deleted'); this.load(); },
      error: () => this.toastr.error('Failed to delete brand')
    });
  }
}