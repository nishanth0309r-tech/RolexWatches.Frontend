export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  imageUrl: string;
  brandName: string;
  categoryName: string;
  isActive: boolean;
}
export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  imageUrl: string;
  brandId: number;
  categoryId: number;
}
export interface UpdateProduct extends CreateProduct {
  isActive: boolean;
}