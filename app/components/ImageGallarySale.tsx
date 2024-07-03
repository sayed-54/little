"use client";

import Image from "next/image";
import { urlfor } from "../lib/sanity";
import { useState } from "react";

export const revalidate = 30;

interface iAppProps {
  images: any;
}

export default function ImageGallary({ images }: iAppProps) {
  const [bigimg, setbigimg] = useState(images[0]);

  const handleimg = (image: any) => {
    setbigimg(image);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Main Image Section */}
      <div className="lg:col-span-4">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 shadow-md">
          <Image
            src={urlfor(bigimg).url()}
            alt="big img"
            width={500}
            height={500}
            priority
            className="h-full w-full object-cover object-center transition ease-in-out duration-500"
          />
          <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 uppercase tracking-wider text-white">
          sale
        </span>
        </div>
      </div>

      {/* Thumbnail Images Section */}
      <div className="order-last flex flex-wrap gap-2 lg:order-none lg:flex-col lg:gap-4 lg:w-full overflow-hidden py-2 px-2">
        {images.map((image: any, idx: any) => (
          <div
            key={idx}
            className={`overflow-hidden rounded-lg bg-gray-100 shadow-sm cursor-pointer transition-transform transform hover:scale-105 ${
              bigimg === image ? "border-2 border-blue-500" : "border"}`}
            onClick={() => handleimg(image)}
          >
            <Image
              src={urlfor(image).url()}
              width={200}
              height={100}
              priority
              alt="product image"
              className="h-24 w-24 lg:h-20 lg:w-20 object-contain object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
