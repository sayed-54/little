"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBagIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ShoppingCartModel from './ShoppingCartModel';
import { useShoppingCart } from 'use-shopping-cart';

const links = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/Products" },
  { name: "Sale", href: "/Sale" },
  { name: "Contact Us", href: "/Contacts" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const { handleCartClick } = useShoppingCart();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > scrollY) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    setScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, scrollY]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 bg-white border-b shadow-lg h-24 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'} flex items-center justify-between`}>
      {/* Menu Icon */}
      <button
        className="lg:hidden ml-4"
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? (
          <X className="text-gray-600 hover:text-primary" size={25} />
        ) : (
          <Menu className="text-gray-600 hover:text-primary" size={25} />
        )}
      </button>

      {/* Store Name */}
      <div className={`lg:flex items-center justify-between gap-2 xl:pl-32 lg:pl-24 ${mobileMenuOpen ? '' : 'flex-1 text-center'}`}>
        <Link href="/" className="font-bold lg:text-5xl md:text-4xl text-3xl">
          <h1>
            Little<span className="text-primary">Locals</span>
          </h1>
        </Link>
      </div>

      {/* Navbar links for desktop */}
      <nav className={`hidden lg:flex lg:gap-6 2xl:ml-16 ${mobileMenuOpen ? 'hidden' : 'flex-1 justify-center'}`}>
        {links.map((link, idx) => (
          <div key={idx}>
            {pathname === link.href ? (
              <Link className="text-4xl font-semibold text-primary transition duration-500" href={link.href}>
                {link.name}
              </Link>
            ) : (
              <Link className="text-3xl font-medium text-gray-600 transition duration-100 hover:text-primary" href={link.href}>
                {link.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Shopping Icon */}
      <div className="flex hover:bg-white mr-8">
        <Button variant={"outline"} onClick={() => handleCartClick()} className="flex flex-col hover:bg-white gap-y-1.5 h-full w-12 sm:h-16 sm:w-16 md:w-20 md:h-20 rounded-none border-none">
          <ShoppingBagIcon className="hover:fill-gray-400" size={35} />
          <span className="hidden text-md font-semibold text-gray-700 sm:block">Cart</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        {links.map((link, idx) => (
          <div key={idx} className="mb-4">
            {pathname === link.href ? (
              <Link className="block text-2xl font-semibold text-primary" href={link.href} onClick={toggleMobileMenu}>
                {link.name}
              </Link>
            ) : (
              <Link className="block text-2xl font-semibold text-gray-600 transition duration-100 hover:text-primary" href={link.href} onClick={toggleMobileMenu}>
                {link.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
