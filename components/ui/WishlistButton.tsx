"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  product: {
    _id: string; // Product Sanity ID
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    imageUrl?: string;
  };
  className?: string;
  iconClassName?: string;
}

export default function WishlistButton({ product, className, iconClassName }: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const { data: session } = useSession();
  const router = useRouter();

  const isLiked = isInWishlist(product._id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if this button is inside a Link wrapper
    
    // Require authentication to use the wishlist
    if (!session?.user) {
      router.push("/login");
      return;
    }

    await toggleItem(product, session.user.id);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-full bg-white/90 backdrop-blur-sm border shadow-sm hover:scale-110 transition-all active:scale-95 group z-10",
        isLiked ? "border-red-200" : "border-border hover:border-red-200",
        className
      )}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          isLiked 
            ? "fill-red-500 text-red-500" 
            : "text-muted-foreground group-hover:text-red-500",
          iconClassName
        )}
      />
    </button>
  );
}
