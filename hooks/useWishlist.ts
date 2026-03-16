import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

interface WishlistItem {
  _id: string; // Product Sanity ID
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  imageUrl?: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  setItems: (items: WishlistItem[]) => void;
  toggleItem: (item: WishlistItem, userId?: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      setItems: (items) => set({ items }),

      isInWishlist: (productId) => {
        return get().items.some((i) => i._id === productId);
      },

      toggleItem: async (product, userId) => {
        const currentItems = get().items;
        const exists = currentItems.find((i) => i._id === product._id);
        const action = exists ? "remove" : "add";

        // Optimistic UI Update
        if (exists) {
          set({ items: currentItems.filter((i) => i._id !== product._id) });
        } else {
          set({ items: [...currentItems, product] });
        }

        toast.info(
          exists ? "Removed from Wishlist" : "Added to Wishlist",
          { position: "bottom-center", autoClose: 1500, hideProgressBar: true }
        );

        // If user is logged in, sync with Sanity in the background
        if (userId) {
          try {
            const res = await fetch("/api/user/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action,
                productId: product._id,
              }),
            });

            if (!res.ok) {
              console.error("Failed to sync wishlist with server");
              // Rollback optimistic update
              set({ items: currentItems }); 
            }
          } catch (error) {
            console.error("Error syncing wishlist:", error);
            // Rollback optimistic update
            set({ items: currentItems });
          }
        }
      },
    }),
    {
      name: "wishlist-storage",
      // Only keep in local storage for guest browsing, actual auth sync happens on server
    }
  )
);
