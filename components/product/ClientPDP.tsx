"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { client, urlfor } from "@/lib/sanity";
import { Check } from "lucide-react";

export default function ClientPDP({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    addItem({
      id: `${product._id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price,
      image: urlfor(product.images[0]).url(),
      currency: product.currency || "EGP",
      quantity: 1,
      size: selectedSize || undefined,
      color: selectedColor || undefined
    });
    
    toggleCart(); // Open cart drawer
  };

  return (
    <div className="flex flex-col gap-8 mb-8">
      {/* Colors Selector */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">
            Color {selectedColor && <span className="text-muted-foreground ml-2 normal-case font-normal">- {selectedColor}</span>}
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color: string) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedColor === color 
                    ? "border-primary ring-2 ring-primary ring-offset-2 scale-110" 
                    : "border-border hover:border-muted-foreground shadow-sm"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              >
               {selectedColor === color && <Check size={16} className={['white', 'light', '#ffffff', '#fff'].includes(color.toLowerCase()) ? "text-black" : "text-white"} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">
            Size {selectedSize && <span className="text-muted-foreground ml-2 normal-case font-normal">- {selectedSize}</span>}
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-12 min-w-[3rem] px-4 rounded-md font-medium text-sm transition-all ${
                  selectedSize === size
                    ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2"
                    : "bg-background border border-border text-foreground hover:border-primary/50 hover:bg-muted"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Button 
          onClick={handleAddToCart} 
          className="flex-1 h-16 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
