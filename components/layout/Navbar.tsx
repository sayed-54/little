"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useCartStore } from '@/store/cartStore';
import { useSession, signOut } from "next-auth/react";
import { ShoppingBagIcon, Menu, X, Search, User, LogOut, Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { getStoreSettingsQuery, getAllCategoriesQuery } from "@/lib/queries";
import Image from "next/image";

const staticLinks = [
  { name: "Home", href: "/" },
  { name: "Sale", href: "/Sale" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Contact", href: "/Contacts" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { toggleCart, totalItems } = useCartStore();
  const { data: session } = useSession();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      client.fetch(getStoreSettingsQuery),
      client.fetch(getAllCategoriesQuery)
    ]).then(([settingsData, categoriesData]) => {
      setSettings(settingsData);
      setCategories(categoriesData || []);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isShopActive = pathname.startsWith("/Products");

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled || mobileMenuOpen ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Mobile Menu Icon */}
        <button
          className="lg:hidden text-foreground hover:text-primary transition-colors relative z-[60]"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} className="text-foreground" /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-1 lg:flex-none justify-center lg:justify-start">
          {settings?.logoUrl && (
            <Image 
              src={settings.logoUrl} 
              alt={settings.storeName || "Logo"} 
              width={32} 
              height={32} 
              className="object-contain"
            />
          )}
          <span className={`font-heading font-bold tracking-tight transition-all ${scrolled ? 'text-2xl' : 'text-3xl'} text-foreground`}>
            {settings?.storeName ? (
              <>
                {settings.storeName.split(' ')[0]}<span className="text-primary">{settings.storeName.split(' ')[1] ? ` ${settings.storeName.split(' ')[1]}` : '.'}</span>
              </>
            ) : (
              <>Little<span className="text-primary">Locals.</span></>
            )}
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-10">
          {/* Home */}
          <Link
            href="/"
            className={`text-sm font-medium tracking-wide uppercase relative transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
            {pathname === '/' && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary rounded-full" />}
          </Link>

          {/* Shop Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShopDropdownOpen(prev => !prev)}
              className={`flex items-center gap-1 text-sm font-medium tracking-wide uppercase relative transition-colors hover:text-primary ${isShopActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Shop
              <ChevronDown size={14} className={`transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              {isShopActive && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary rounded-full" />}
            </button>

            {shopDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl py-2 z-50">
                <Link
                  href="/Products"
                  onClick={() => setShopDropdownOpen(false)}
                  className={`block px-4 py-2 text-sm hover:text-primary hover:bg-muted/50 transition-colors ${pathname === '/Products' && !pathname.includes('?') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/Products?category=${cat.slug}`}
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other static links */}
          {staticLinks.filter(l => l.name !== "Home").map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase relative transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.name}
                {isActive && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-4 lg:gap-6 relative z-50">
          <button className="hidden sm:block text-muted-foreground hover:text-primary transition-colors">
            <Search size={22} className="stroke-[1.5]" />
          </button>
          
          <Link href="/wishlist" className="text-muted-foreground hover:text-primary transition-colors relative group">
            <Heart size={22} className="stroke-[1.5]" />
            <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:animate-ping group-hover:opacity-100 transition-opacity" />
          </Link>
          
          {session ? (
            <div className="relative group/account">
              <button className="flex items-center gap-2 outline-none">
                {session.user?.image ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      width={36} 
                      height={36}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <ChevronDown size={14} className="text-muted-foreground group-hover/account:text-primary transition-colors" />
              </button>

              {/* Account Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl py-3 z-50 opacity-0 invisible translate-y-2 group-hover/account:opacity-100 group-hover/account:visible group-hover/account:translate-y-0 transition-all duration-200">
                <div className="px-4 py-2 border-b border-border/50 mb-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-semibold text-foreground truncate">{session.user?.name}</p>
                </div>
                
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <User size={16} /> My Account
                </Link>
                <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <ShoppingBagIcon size={16} /> My Orders
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <Heart size={16} /> My Vault
                </Link>
                <div className="h-px bg-border/50 my-2" />
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block text-muted-foreground hover:text-primary transition-colors">
              <User size={22} className="stroke-[1.5]" />
            </Link>
          )}

          <button 
            onClick={toggleCart} 
            className="text-foreground hover:text-primary transition-colors relative flex items-center group"
          >
            <ShoppingBagIcon size={24} className="stroke-[1.5]" />
            {mounted && totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                {totalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-background z-40 lg:hidden transform transition-transform duration-500 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full w-full flex flex-col justify-center items-center gap-8 relative overflow-y-auto py-16">
          <Link 
            href="/"
            onClick={toggleMobileMenu}
            className={`text-4xl font-heading font-semibold hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-foreground'}`}
          >
            Home
          </Link>

          {/* Shop with categories in mobile */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/Products"
              onClick={toggleMobileMenu}
              className={`text-4xl font-heading font-semibold hover:text-primary transition-colors ${isShopActive ? 'text-primary' : 'text-foreground'}`}
            >
              Shop
            </Link>
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/Products?category=${cat.slug}`}
                    onClick={toggleMobileMenu}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-full border border-border"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {staticLinks.filter(l => l.name !== "Home").map((link, idx) => (
            <Link 
              key={idx}
              href={link.href}
              onClick={toggleMobileMenu}
              className={`text-4xl font-heading font-semibold hover:text-primary transition-colors ${pathname === link.href ? 'text-primary' : 'text-foreground'}`}
            >
              {link.name}
            </Link>
          ))}
          {session && (
            <button 
              onClick={() => {
                signOut();
                toggleMobileMenu();
              }}
              className="text-4xl font-heading font-semibold text-red-500 hover:text-red-600 transition-colors uppercase tracking-tighter"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
