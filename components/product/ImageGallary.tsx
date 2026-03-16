"use client";

import Image from "next/image";
import { client, urlfor } from "@/lib/sanity";
import { useState } from "react";

export const revalidate = 30;

export default function ImageGallary({ images }: { images: any }) {
  const [bigimg, setbigimg] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image Section */}
      <div 
        className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-muted cursor-zoom-in shadow-sm"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={urlfor(bigimg).url()}
          alt="Product Image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          className={`object-cover transition-transform duration-200 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
          style={{ 
            transformOrigin: isZoomed ? `${cursorPos.x}% ${cursorPos.y}%` : 'center center' 
          }}
        />
      </div>

      {/* Thumbnail Images Section */}
      {images?.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image: any, idx: number) => (
            <button
              key={idx}
              className={`relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-xl bg-muted transition-all ${
                bigimg === image ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setbigimg(image)}
            >
              <Image
                src={urlfor(image).url()}
                fill
                sizes="96px"
                alt="Product thumbnail"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
