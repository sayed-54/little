export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  currency: string;
  images: any[];
  categoryName?: string;
  stock?: number;
  colors?: string[];
  sizes?: string[];
}

export interface SimplifiedProduct {
  _id: string;
  imageUrl: string;
  price: number;
  sale_price?: number;
  slug: string;
  categoryName: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
}
