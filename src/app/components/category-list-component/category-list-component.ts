import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list-component.html',
  styleUrl: './category-list-component.css'
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);

  categories: Category[] = [];
  newCategoryName = '';

  ngOnInit(): void { this.load(); }
  load(): void { this.categoryService.getAll().subscribe(data => this.categories = data); }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.create({ name: this.newCategoryName }).subscribe({
      next: () => { this.toastr.success('Category added'); this.newCategoryName = ''; this.load(); },
      error: () => this.toastr.error('Failed to add category')
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => { this.toastr.success('Category deleted'); this.load(); },
      error: () => this.toastr.error('Failed to delete category')
    });
  }
}