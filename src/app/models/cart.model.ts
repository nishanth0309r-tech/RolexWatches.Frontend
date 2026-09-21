export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  total: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}
