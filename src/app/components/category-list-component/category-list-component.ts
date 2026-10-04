import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-list-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-list-component.html',
  styleUrl: './category-list-component.css'
})
export class CategoryListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);

  categories = signal<Category[]>([]);
  loading = signal(true);
  modalOpen = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);

  parentOptions = computed(() =>
    this.categories().filter(c => c.id !== this.editingId()));

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    parentCategoryId: [null as number | null]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.categoryService.getAll().subscribe({
      next: data => { this.categories.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toastr.error('Failed to load categories'); }
    });
  }

  hasChildren(c: Category): boolean {
    return this.categories().some(x => x.parentCategoryId === c.id);
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '', parentCategoryId: null });
    this.modalOpen.set(true);
  }

  openEdit(c: Category): void {
    this.editingId.set(c.id);
    this.form.reset({
      name: c.name,
      description: c.description ?? '',
      parentCategoryId: c.parentCategoryId
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
        this.toastr.success(id ? 'Category updated' : 'Category added');
        this.saving.set(false);
        this.closeModal();
        this.load();
      },
      error: (err: any) => {
        this.saving.set(false);
        this.toastr.error(typeof err?.error === 'string' ? err.error : 'Failed to save category');
      }
    };

    if (id) this.categoryService.update(id, value).subscribe(handlers);
    else this.categoryService.create(value).subscribe(handlers);
  }

  deleteCategory(c: Category): void {
    if (!confirm(`Delete ${c.name}?`)) return;
    this.categoryService.delete(c.id).subscribe({
      next: () => { this.toastr.success('Category deleted'); this.load(); },
      error: () => this.toastr.error('Failed to delete category')
    });
  }
}