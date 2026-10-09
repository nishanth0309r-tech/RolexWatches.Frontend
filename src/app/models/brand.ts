export interface Brand {
  id: number;
  name: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  productCount: number;
}

export interface SaveBrand {
  name: string;
  logoUrl: string;
  description: string;
  isActive: boolean;
}