export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
}

export interface AddToWishlistRequest {
  productId: number;
}
