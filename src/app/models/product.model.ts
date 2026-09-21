export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  brandId?: number;
  categoryId?: number;
}
