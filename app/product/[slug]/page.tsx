"use client";

import { client } from "@/app/lib/sanity";
import ImageGallary from "@/app/components/ImageGallary";
import SizeSelect from "@/app/components/SizeSelect";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToBag from "@/app/components/AddToBag";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FullProduct {
  _id: string;
  images: any;
  price: number;
  slug: string;
  name: string;
  description: string;
  sizes: string[];
}

async function getProductData(slug: string): Promise<FullProduct | null> {
  const query = `*[_type=='products' && slug.current=="${slug}"][0]{
    _id,
    images,
    price,
    name,
    description,
    sizes,
    "slug": slug.current
  }`;
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<FullProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getProductData(params.slug);
      if (data) {
        setProduct(data);
      }
    }
    fetchData();
  }, [params.slug]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white mt-[128px]">
      <div className="mx-auto max-w-[1440px] px-4 my-8 md:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          <ImageGallary images={product.images} />
          <div className="py-4 md:py-8">
            <div className="mb-2 md:mb-3">
              <span className="capitalize mb-0.5 inline-block text-gray-500">
                little locals
              </span>
              <h2 className="text-2xl font-bold text-gray-800 lg:text-4xl">
                {product.name}
              </h2>
            </div>
            <div className="pt-4 pb-2 mb-0">
              <div className="flex items-end gap-2">
                <span className="text-xl text-gray-800 font-bold md:text-2xl">
                   {product.price.toFixed(2)} EGP
                  
                </span>
              </div>
            </div>
            <div className="mb-6 flex items-end gap-2 text-gray-500">
              <Truck />
              <span className="capitalize text-sm">2-4 day shipping</span>
            </div>
            
            <p className="mt-4 text-base text-gray-500 tracking-wider">
              {product.description}
            </p>
            <SizeSelect sizes={product.sizes} onSizeSelect={setSelectedSize} /> 
            <div className="flex gap-2.5 py-10">
              <AddToBag
                currency="EGP"
                description={product.description}
                image={product.images[0]}
                name={product.name}
                price={product.price}
                size={selectedSize} // Pass the selected size to AddToBag component
                key={product._id}
              />
              <Button variant={"secondary"} className="text-md font-semibold">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
