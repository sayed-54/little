export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'customer';
  addresses: Address[];
  wishlist: string[]; // array of product IDs
  orders: string[]; // array of order IDs
  createdAt: string;
}
