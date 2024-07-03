"use client";

import { useState } from 'react';
import { useShoppingCart } from 'use-shopping-cart';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { createClient, ClientConfig } from '@sanity/client';

const clientConfig: ClientConfig = {
  projectId: 'oyeriaey',
  dataset: 'production',
  apiVersion: 'v2022-03-07',
  token: 'skTIvZHi1qseQxVgcyCRiRb0D23x8po8NLO4jjZHkNFgdL76Rk2grahOoKff7VlSj3GUzOkaHXPfbopAnPaw79uU74sDo4vVjETX3qS75sNFAHmNsH0dWMJGwglSRPCY0UL4bQ90LaG8EGdWPMvDIkuWLpMtkeWKX8l6Tli7WqgoYoQUSKYo',
};
const client = createClient(clientConfig);

type CartEntry = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
};

const CheckoutPage = () => {
  const { cartDetails = {}, totalPrice, clearCart } = useShoppingCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
  
    const orderDetails = {
      ...formData,
      cartDetails: Object.values(cartDetails).map((entry, index) => ({
        _key: `${entry.id}_${index}`, // Example of generating a unique key
        ...entry,
      })),
      totalPrice,
    };
    
    try {
      const response = await client.create({
        _type: 'order',
        ...orderDetails,
        createdAt: new Date().toISOString(),
      });
  
      if (response._id) {
        setOrderSubmitted(true);
        clearCart();
      } else {
        console.error('Failed to submit order: Response:', response);
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred while submitting your order.');
    }
  };

  const closeAlert = () => {
    setOrderSubmitted(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold my-4 pt-20">Checkout</h1>
      {orderSubmitted && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded-md flex  flex-col">
          <div className='flex flex-col'>
          <p className="text-lg font-semibold">Order Submitted!</p>
          <p>Thank you for your order. We will process it shortly.</p>
          </div>
          <button onClick={closeAlert} className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md focus:outline-none">Close</button>
        </div>
      )}
      
      {Object.keys(cartDetails).length === 0 ? (
        <p className="text-center text-2xl font-semibold text-gray-900 py-6 mb-[287px]">
          Your cart is empty
        </p>
      ) : (
        <>
          <ul className="my-6 divide-y divide-gray-200">
            {Object.values(cartDetails).map((entry) => {
              const cartEntry = entry as unknown as CartEntry;
              return (
                <li key={cartEntry.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={cartEntry.image}
                      alt="product image"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{cartEntry.name}</h3>
                        <p className="ml-4">EGP {cartEntry.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {cartEntry.description}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Size: {cartEntry.size}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">QTY: {cartEntry.quantity}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>EGP {totalPrice}</p>
            </div>
            <p>Shipping and Taxes are calculated at checkout.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Order
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
