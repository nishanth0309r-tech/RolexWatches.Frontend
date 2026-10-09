import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product-service';
import { BrandService } from '../../services/brand-service';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../models/category';
import { Brand } from '../../models/brand';

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
  isEditMode = signal(false);
  productId?: number;
  brands = signal<Brand[]>([]);
  categories = signal<Category[]>([]);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      additionalImageUrls: [''],
      brandId: [null, Validators.required],
      categoryId: [null, Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.brandService.getAll().subscribe(data => this.brands.set(data));
    this.categoryService.getAll().subscribe(data => this.categories.set(data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.productId = +idParam;
      this.productService.getById(this.productId).subscribe(product => {
        const images = [...(product.images ?? [])].sort((a, b) =>
          Number(b.isPrimary) - Number(a.isPrimary) || a.displayOrder - b.displayOrder
        );
        this.form.patchValue({
          ...product,
          imageUrl: images[0]?.imageUrl ?? product.imageUrl ?? '',
          additionalImageUrls: images.slice(1).map(image => image.imageUrl).join('\n')
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }
    const { imageUrl, additionalImageUrls, ...productFields } = this.form.getRawValue();
    const imageUrls = [imageUrl, ...additionalImageUrls.split(/\r?\n/)]
      .map(url => url.trim())
      .filter((url, index, allUrls) => url.length > 0 && allUrls.indexOf(url) === index);
    const productPayload = {
      ...productFields,
      imageUrl: imageUrls[0],
      images: imageUrls.map((url, displayOrder) => ({
        imageUrl: url,
        isPrimary: displayOrder === 0,
        displayOrder
      }))
    };

    if (this.isEditMode() && this.productId) {
      this.productService.update(this.productId, productPayload).subscribe({
        next: () => { this.toastr.success('Product updated successfully'); this.router.navigate(['/admin/products']); },
        error: () => this.toastr.error('Failed to update product')
      });
    } else {
      this.productService.create(productPayload).subscribe({
        next: () => { this.toastr.success('Product created successfully'); this.router.navigate(['/admin/products']); },
        error: () => this.toastr.error('Failed to create product')
      });
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/240x160?text=Invalid+URL';
  }
}