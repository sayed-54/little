import Navbar from "@/components/layout/Navbar";
import ShoppingCartModel from "@/components/cart/ShoppingCartModel";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import CartProvider from "@/components/cart/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
