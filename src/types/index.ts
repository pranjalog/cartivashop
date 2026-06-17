export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  colors?: string[];
  specs?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  perks: string[];
  icon: string;
}
