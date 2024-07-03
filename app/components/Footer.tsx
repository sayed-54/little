"use client";

import React from 'react';
import { FaFacebookSquare, FaInstagram, FaTwitterSquare } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-4 bottom-0 w-full gap-4 px-5">
      <div className="max-w-[1440px] md:mx-auto grid md:grid-cols-3 md:gap-16 ">
        <div className="md:col-span-1 w-full text-white mt-auto  text-center pb-2 md:text-start md:ml-10">
          <h1 className="text-[#ffffff] md:text-5xl sm:text-4xl text-3xl uppercase font-bold text-start">
            Little <span className="text-primary">Locals</span>
          </h1>
          <p className="my-4 text-md w-full text-pretty md:text-wrap">
            Lorem ipsum elit. Maxime corrupti provident distinctio iure nemo saepe labore molestiae
            consectetur obcaecati nihil, sed culpa animi laudantium, perspiciatis similique quo
            impedit.
          </p>
          <div className="flex md:justify-between justify-evenly">
            <Link href="https://facebook.com">
                <FaFacebookSquare className="text-4xl text-primary" />
            </Link>
            <Link href="https://instagram.com">
                <FaInstagram className="text-4xl text-primary" />
            </Link>
            <Link href="https://twitter.com">
                <FaTwitterSquare className="text-4xl text-primary" />
              
            </Link>
          </div>
        </div>
        <div className="md:col-span-2 w-full text-white mt-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col ">
              <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
              <a href="/" className="mb-1 text-gray-500 hover:text-primary">Home</a>
              <a href="/Products" className="mb-1 text-gray-500 hover:text-primary">Products</a>
              <a href="/Sale" className="mb-1 text-gray-500 hover:text-primary">Sale</a>
              <a href="/Contacts" className="mb-1 text-gray-500 hover:text-primary">Contact Us</a>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
              <p className="mb-1 text-gray-500">Email: contact@littlelocals.com</p>
              <p className="mb-1 text-gray-500">Phone: +123 456 7890</p>
              <p className="mb-1 text-gray-500">Address: El Khalifa, Cairo Governorate </p>
            </div>
          </div>
        </div>
      </div>
      <p className='mt-4 text-center'>&copy; 2024 Little Locals. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
