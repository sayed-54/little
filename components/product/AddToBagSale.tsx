"use client";

import { Button } from "@/components/ui/button";
import { client, urlfor } from "@/lib/sanity";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Check } from "lucide-react";

interface AddToBagSaleProps {
  description: string;
  image: any;
  name: string;
  price: number;
  oldPrice: number;
  size: string | null;
  productId: string;
  slug: string;
}

const AddToBagSale: React.FC<AddToBagSaleProps> = ({ 
  description, 
  image, 
  name, 
  price, 
  oldPrice, 
  size,
  productId,
  slug
}) => {
  const { addItem, toggleCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToBag = () => {
    if (!size) {
      alert("Please select a size first");
      return;
    }

    addItem({
      id: `${productId}-${size}`,
      productId,
      name,
      price,
      sale_price: price, // For sale items, current price is the sale price
      image: urlfor(image).url(),
      currency: "EGP",
      size,
      slug,
      quantity: 1
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      toggleCart();
    }, 1000);
  };

  return (
    <Button 
      onClick={handleAddToBag}
      size="lg"
      className={`h-14 px-12 rounded-full text-lg font-bold shadow-xl transition-all duration-300 gap-3 ${added ? 'bg-green-600 hover:bg-green-700' : 'hover:shadow-primary/40 active:scale-95'}`}
    >
      {added ? (
        <>
          <Check size={20} />
          Added to Bag
        </>
      ) : (
        <>
          <ShoppingBag size={20} />
          Add to Bag
        </>
      )}
    </Button>
  );
};

export default AddToBagSale;
