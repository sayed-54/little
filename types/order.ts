export interface CartItem {
  id: string; // unique string e.g., product_id + size + color
  productId: string;
  name: string;
  price: number;
  sale_price?: number;
  currency: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  slug: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
