import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../../Services/brand-service';
import { Brand } from '../../Models/brand';

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

  brands: Brand[] = [];
  newBrandName = '';

  ngOnInit(): void { this.load(); }
  load(): void { this.brandService.getAll().subscribe(data => this.brands = data); }

  addBrand(): void {
    if (!this.newBrandName.trim()) return;
    this.brandService.create({ name: this.newBrandName }).subscribe({
      next: () => { this.toastr.success('Brand added'); this.newBrandName = ''; this.load(); },
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