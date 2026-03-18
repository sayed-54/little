"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useCartStore } from '@/store/cartStore';
import { useSession, signOut } from "next-auth/react";
import { ShoppingBagIcon, Menu, X, Search, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client } from "@/lib/sanity";
import { getStoreSettingsQuery, getAllCategoriesQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const staticLinks = [
  { name: "Home", href: "/" },
  { name: "Sale", href: "/Sale" },
  { name: "Contact", href: "/Contacts" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { toggleCart, totalItems } = useCartStore();
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
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
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ease-in-out",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
          : "bg-transparent py-5 lg:py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-3 lg:flex items-center justify-between">
          
          {/* Mobile Menu Toggle (Left) */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 flex items-center justify-center focus:outline-none z-[1001]"
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <span className={cn(
                  "h-0.5 bg-foreground transition-all duration-300 origin-right",
                  mobileMenuOpen ? "-rotate-45 translate-x-[-1px] translate-y-[1px]" : ""
                )} />
                <span className={cn(
                  "h-0.5 bg-foreground transition-all duration-300",
                  mobileMenuOpen ? "opacity-0 translate-x-2" : "opacity-100"
                )} />
                <span className={cn(
                  "h-0.5 bg-foreground transition-all duration-300 origin-right",
                  mobileMenuOpen ? "rotate-45 translate-x-[-1px] translate-y-[-1px]" : ""
                )} />
              </div>
            </button>
          </div>

          {/* Logo (Centered on mobile) */}
          <motion.div 
            animate={{ 
              opacity: isSearchOpen && mounted && window.innerWidth < 1024 ? 0 : 1,
              scale: isSearchOpen && mounted && window.innerWidth < 1024 ? 0.95 : 1
            }}
            className={cn(
              "flex justify-center lg:justify-start order-2 lg:order-1 items-center transition-all duration-300",
              isSearchOpen && mounted && window.innerWidth < 1024 ? "pointer-events-none" : ""
            )}
          >
            <Link href="/" className="flex items-center gap-2 group">
              {settings?.logoUrl ? (
                <div className="relative w-8 h-8 lg:w-9 lg:h-9 overflow-hidden transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <Image 
                    src={settings.logoUrl} 
                    alt={settings.storeName || "Logo"} 
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shrink-0">
                  <div className="w-4 h-4 text-primary-foreground fill-current" />
                </div>
              )}
              <span className={cn(
                "font-heading font-black tracking-tighter transition-all duration-500 whitespace-nowrap",
                scrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl lg:text-3xl"
              )}>
                {settings?.storeName ? (
                  <>
                    {settings.storeName.split(' ')[0]}<span className="text-primary">{settings.storeName.split(' ')[1] ? ` ${settings.storeName.split(' ')[1]}` : '.'}</span>
                  </>
                ) : (
                  <>Little<span className="text-primary">Locals.</span></>
                )}
              </span>
            </Link>
          </motion.div>

          {/* Desktop Links (Hidden on Mobile) */}
          <nav className="hidden lg:flex items-center gap-10 order-2">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "text-sm font-black tracking-widest uppercase relative transition-all duration-300 hover:text-primary group",
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Home
              <span className={cn(
                "absolute -bottom-2 left-0 h-0.5 bg-primary rounded-full transition-all duration-300",
                pathname === '/' ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>

            {/* Shop Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShopDropdownOpen(prev => !prev)}
                className={cn(
                  "flex items-center gap-1 text-sm font-black tracking-widest uppercase relative transition-all duration-300 hover:text-primary group",
                  isShopActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Shop
                <ChevronDown size={14} className={cn("transition-transform duration-300", shopDropdownOpen ? 'rotate-180' : '')} />
                <span className={cn(
                  "absolute -bottom-2 left-0 h-0.5 bg-primary rounded-full transition-all duration-300",
                  isShopActive ? "w-full" : "w-0 group-hover:w-full"
                )} />
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
                  className={cn(
                    "text-sm font-black tracking-widest uppercase relative transition-all duration-300 hover:text-primary group",
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-2 left-0 h-0.5 bg-primary rounded-full transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* Action Icons (Right) */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-6 relative z-50 order-3">
            {/* Animated Search Area */}
            <div className={cn(
              "relative flex items-center transition-all duration-500",
              isSearchOpen && mounted && window.innerWidth < 1024 ? "absolute right-0 z-[60]" : "relative"
            )} ref={searchRef}>
              <motion.div 
                animate={{ 
                  width: isSearchOpen ? (mounted && window.innerWidth < 1024 ? 'calc(100vw - 120px)' : '300px') : '40px' 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "flex items-center h-10 rounded-full transition-all duration-300 relative overflow-hidden",
                  isSearchOpen ? "bg-background ring-1 ring-primary/20 shadow-lg" : "bg-transparent"
                )}
              >
                {/* Search Activation Icon / Toggle */}
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={cn(
                    "flex-shrink-0 text-muted-foreground hover:text-primary transition-all p-2 rounded-full",
                    isSearchOpen ? "text-primary bg-background/50 scale-90" : "hover:bg-muted/50"
                  )}
                >
                  {isSearchOpen ? <X size={18} /> : <Search size={20} className="stroke-[2]" />}
                </button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={handleSearch} 
                      className="flex-1 pr-2 flex items-center"
                    >
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none py-1.5 px-2 text-xs md:text-sm focus:ring-0 outline-none placeholder:text-muted-foreground/60"
                      />
                      <button type="submit" className="text-primary p-1.5 hover:scale-110 transition-transform">
                        <Search size={16} className="stroke-[3]" />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            
            {/* User Profile - Hidden on mobile, drawer handles it */}
            <div className="hidden lg:block">
              {session ? (
                <div className="relative group/account">
                  <button className="flex items-center gap-2 outline-none">
                    {session.user?.image ? (
                      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
                        <Image 
                          src={session.user.image} 
                          alt={session.user.name || "User"} 
                          width={36} 
                          height={36}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20">
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
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted/50">
                  <User size={22} className="stroke-[1.8]" />
                </Link>
              )}
            </div>

            <button 
              onClick={toggleCart} 
              className="flex text-foreground hover:text-primary transition-all relative items-center group p-2 rounded-full hover:bg-muted/80"
            >
              <ShoppingBagIcon size={22} className="stroke-[2]" />
              {mounted && totalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center ring-2 ring-background ring-offset-0">
                  {totalItems()}
                </span>
              )}
            </button>

            <Link 
              href="/Products"
              className="hidden lg:flex px-8 py-3 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-500"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] lg:hidden transition-all duration-500",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={toggleMobileMenu}
      />

      {/* Mobile Menu Drawer - Premium Slide from Right */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-background z-[1001] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] lg:hidden border-l border-border/40 flex flex-col",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header in Drawer */}
          <div className="px-8 pt-20 pb-10">
            <div className="h-px w-10 bg-primary mb-6" />
            <h2 className="text-sm font-black tracking-[0.2em] text-muted-foreground uppercase mb-12">Navigation</h2>
            
            <nav className="flex flex-col gap-8">
              <Link 
                href="/"
                onClick={toggleMobileMenu}
                className={cn(
                  "text-4xl font-heading font-black tracking-tighter transition-all hover:translate-x-2",
                  pathname === '/' ? 'text-primary' : 'text-foreground'
                )}
              >
                HOME
              </Link>

              <div className="flex flex-col gap-4">
                <Link
                  href="/Products"
                  onClick={toggleMobileMenu}
                  className={cn(
                    "text-4xl font-heading font-black tracking-tighter transition-all hover:translate-x-2",
                    isShopActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  SHOP
                </Link>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/Products?category=${cat.slug}`}
                        onClick={toggleMobileMenu}
                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all px-4 py-2 rounded-full bg-muted/50 border border-border/50"
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
                  className={cn(
                    "text-4xl font-heading font-black tracking-tighter transition-all hover:translate-x-2",
                    pathname === link.href ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {link.name.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto px-8 py-12 bg-muted/30 border-t border-border/40">
            {session ? (
              <div className="flex flex-col gap-6">
                <Link
                  href="/profile"
                  onClick={toggleMobileMenu}
                  className="flex items-center gap-3 text-lg font-bold text-foreground hover:text-primary transition-colors"
                >
                  <User size={20} className="text-primary" />
                  Account Settings
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    toggleMobileMenu();
                  }}
                  className="flex items-center gap-3 text-lg font-bold text-red-500 hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center w-full py-4 bg-primary text-primary-foreground text-sm font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20"
              >
                Login / Join
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
