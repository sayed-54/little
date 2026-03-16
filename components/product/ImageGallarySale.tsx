"use client";

import Image from "next/image";
import { client, urlfor } from "@/lib/sanity";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface iAppProps {
  images: any[];
}

export default function ImageGallarySale({ images }: iAppProps) {
  const [bigImg, setBigImg] = useState(images[0]);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 w-full lg:w-24 px-1 overflow-x-auto lg:overflow-visible no-scrollbar">
        {images.map((image: any, idx: number) => (
          <button
            key={idx}
            onMouseEnter={() => setBigImg(image)}
            onClick={() => setBigImg(image)}
            className={`relative aspect-square w-20 lg:w-full rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
              bigImg === image ? "border-primary ring-2 ring-primary/20 shadow-md scale-105" : "border-border/50 hover:border-primary/50 grayscale hover:grayscale-0"
            }`}
          >
            <Image
              src={urlfor(image).url()}
              alt={`Product Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Showcase */}
      <div className="flex-1 w-full">
        <div 
          className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted group cursor-zoom-in shadow-2xl"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={urlfor(bigImg).url()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <Image
                src={urlfor(bigImg).url()}
                alt="Product Featured Image"
                fill
                priority
                className={`object-cover transition-transform duration-500 ease-out ${isZooming ? 'scale-[2]' : 'scale-100'}`}
                style={isZooming ? { 
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%` 
                } : undefined}
              />
            </motion.div>
          </AnimatePresence>

          {/* Sale Badge */}
          <div className="absolute top-8 left-8">
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
              Sale Item
            </span>
          </div>

          {!isZooming && (
             <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}
