"use client";

import React, { useState } from 'react';

interface SizeSelectProps {
  sizes: string[];
  onSizeSelect: (size: string) => void;
}

const SizeSelect: React.FC<SizeSelectProps> = ({ sizes, onSizeSelect }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    onSizeSelect(size);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-widest text-foreground">Select Size</label>
        <button className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-muted-foreground/30 hover:border-muted-foreground/100 transition-all">Size Guide</button>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {sizes.map((size, index) => (
          <button
            key={index}
            className={`min-w-[3.5rem] h-12 flex items-center justify-center text-sm font-bold rounded-xl border-2 transition-all duration-300 ${
              selectedSize === size 
              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
              : 'border-border bg-background text-foreground hover:border-primary/50'
            }`}
            onClick={() => handleSizeClick(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelect;
