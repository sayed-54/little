"use client";

import React, { useState } from 'react';
import SizeSelect from "@/components/product/SizeSelect";
import AddToBagSale from "@/components/product/AddToBagSale";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FullProduct {
  _id: string;
  images: any[];
  OldPrice: number;
  NewPrice: number;
  slug: string;
  name: string;
  description: string;
  sizes: string[];
}

export default function ClientSalePDP({ product }: { product: FullProduct }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <SizeSelect 
        sizes={product.sizes} 
        onSizeSelect={setSelectedSize} 
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <AddToBagSale
          productId={product._id}
          name={product.name}
          description={product.description}
          image={product.images[0]}
          price={product.NewPrice}
          oldPrice={product.OldPrice}
          size={selectedSize}
          slug={product.slug}
        />
        <Button 
          variant="outline" 
          size="lg"
          asChild
          className="h-14 px-12 rounded-full text-lg font-bold border-2"
        >
          <Link href="/checkout">Quick Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
