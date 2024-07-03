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
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Available Sizes:</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {sizes.map((size, index) => (
          <span
            key={index}
            className={`inline-block px-4 py-2 text-sm font-semibold rounded-md cursor-pointer transition-colors duration-300 ${
              selectedSize === size ? 'text-white bg-blue-600 shadow-lg' : 'text-gray-800 bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleSizeClick(size)}
          >
            {size}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SizeSelect;
