import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/order';

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            cart: state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { cart: [...state.cart, item], isOpen: true }; // Open cart when item added
      }),
      removeItem: (id) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
      })),
      clearCart: () => set({ cart: [] }),
      totalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().cart.reduce((total, item) => total + (item.sale_price ?? item.price) * item.quantity, 0),
    }),
    {
      name: 'premium-ecommerce-cart', 
    }
  )
);
