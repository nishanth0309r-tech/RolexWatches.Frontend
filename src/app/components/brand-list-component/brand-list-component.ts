import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../../services/brand-service';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-brand-list-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './brand-list-component.html',
  styleUrl: './brand-list-component.css'
})
export class BrandListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private brandService = inject(BrandService);
  private toastr = inject(ToastrService);

  brands = signal<Brand[]>([]);
  loading = signal(true);
  modalOpen = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    logoUrl: [''],
    description: [''],
    isActive: [true]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.brandService.getAll().subscribe({
      next: data => { this.brands.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toastr.error('Failed to load brands'); }
    });
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', logoUrl: '', description: '', isActive: true });
    this.modalOpen.set(true);
  }

  openEdit(b: Brand): void {
    this.editingId.set(b.id);
    this.form.reset({
      name: b.name,
      logoUrl: b.logoUrl ?? '',
      description: b.description ?? '',
      isActive: b.isActive
    });
    this.modalOpen.set(true);
  }

  closeModal(): void { this.modalOpen.set(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);

    const value = this.form.getRawValue();
    const id = this.editingId();
    const handlers = {
      next: () => {
        this.toastr.success(id ? 'Brand updated' : 'Brand added');
        this.saving.set(false);
        this.closeModal();
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.toastr.error(id ? 'Failed to update brand' : 'Failed to add brand');
      }
    };

    if (id) this.brandService.update(id, value).subscribe(handlers);
    else this.brandService.create(value).subscribe(handlers);
  }

  deleteBrand(b: Brand): void {
    if (!confirm(`Delete ${b.name}?`)) return;
    this.brandService.delete(b.id).subscribe({
      next: () => { this.toastr.success('Brand deleted'); this.load(); },
      error: () => this.toastr.error('Failed to delete brand. It may still have products.')
    });
  }
}