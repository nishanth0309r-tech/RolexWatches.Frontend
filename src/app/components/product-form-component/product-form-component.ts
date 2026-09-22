import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../Services/product-service';
import { BrandService } from '../../Services/brand-service';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';
import { Brand } from '../../Models/brand';

@Component({
  selector: 'app-product-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form-component.html',
  styleUrl: './product-form-component.css'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private brandService = inject(BrandService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  form: FormGroup;
  isEditMode = false;
  productId?: number;
  brands: Brand[] = [];
  categories: Category[] = [];

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      brandId: [null, Validators.required],
      categoryId: [null, Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.brandService.getAll().subscribe(data => this.brands = data);
    this.categoryService.getAll().subscribe(data => this.categories = data);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = +idParam;
      this.productService.getById(this.productId).subscribe(product => this.form.patchValue(product));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }
    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, this.form.value).subscribe({
        next: () => { this.toastr.success('Product updated successfully'); this.router.navigate(['/admin/products']); },
        error: () => this.toastr.error('Failed to update product')
      });
    } else {
      this.productService.create(this.form.value).subscribe({
        next: () => { this.toastr.success('Product created successfully'); this.router.navigate(['/admin/products']); },
        error: () => this.toastr.error('Failed to create product')
      });
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/240x160?text=Invalid+URL';
  }
}