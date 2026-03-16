"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ShoppingCartModel from "@/components/cart/ShoppingCartModel";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import CartProvider from "@/components/cart/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <ShoppingCartModel />
        {children}
        <Footer />
        <ToastContainer position="bottom-right" />
      </CartProvider>
    </AuthProvider>
  );
}
