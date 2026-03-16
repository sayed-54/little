"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { SimplifiedProduct } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: SimplifiedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlist();
  const { data: session } = useSession();
  const router = useRouter();
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `${product._id}-default`,
      productId: product._id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: product.imageUrl,
      currency: "EGP",
      slug: product.slug,
      quantity: 1
    });
    toggleCart();
  };

  return (
    <div className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-muted">
        {product.sale_price && (
          <span className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            Sale
          </span>
        )}
        
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-background/90 backdrop-blur-md text-foreground h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
          >
            <ShoppingBag size={16} />
            Quick Add
          </button>
          <button 
            onClick={async (e) => { 
              e.preventDefault(); 
              if (!session) {
                router.push("/login");
                return;
              }
              await toggleItem(product, session.user.id); 
            }}
            className={`w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center transition-all shadow-lg ${isWishlisted ? 'bg-primary text-primary-foreground' : 'bg-background/90 text-foreground hover:bg-muted'}`}
          >
            <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col items-center text-center flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          {product.categoryName || "Little Locals"}
        </p>
        <h3 className="text-base font-heading font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        
        <div className="mt-auto flex items-center gap-3">
          <span className="text-lg font-bold text-foreground">
            EGP {(product.sale_price ?? product.price).toLocaleString()}
          </span>
          {product.sale_price && (
            <span className="text-sm text-muted-foreground line-through decoration-destructive/40">
              EGP {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
