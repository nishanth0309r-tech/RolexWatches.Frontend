export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  images?: ProductImage[];   // replaces imageUrl
  brandId?: number;
  categoryId?: number;
  brandName?: string;
  categoryName?: string;
  isActive?: boolean;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  imageUrl: string;
  brandId?: number;
  categoryId?: number;
}

export interface UpdateProduct extends CreateProduct {
  isActive?: boolean;
}