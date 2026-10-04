export interface Category {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  productCount: number;
}

export interface SaveCategory {
  name: string;
  description: string;
  parentCategoryId: number | null;
}