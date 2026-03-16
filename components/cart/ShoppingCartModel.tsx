"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function ShoppingCartModel() {
  const { cart, isOpen, toggleCart, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;
 
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col p-0 border-l border-border bg-background shadow-2xl">
        <SheetHeader className="p-6 border-b border-border bg-muted/30">
          <SheetTitle className="text-2xl font-heading text-foreground">Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🛍️</span>
              </div>
              <h2 className="text-xl font-heading font-medium text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground">Looks like you havent added anything yet.</p>
              <Button onClick={toggleCart} className="mt-4" asChild>
                <Link href="/Products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.map((entry) => (
                <li key={entry.id} className="flex py-4 gap-6 relative group border-b border-border/50 pb-6">
                  <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                    <Image src={entry.image} alt={entry.name} width={100} height={120} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-base font-medium text-foreground">
                        <h3 className="font-heading truncate pr-4">{entry.name}</h3>
                        <p className="font-semibold text-primary">EGP {(entry.sale_price ?? entry.price).toLocaleString()}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {entry.size && <span className="bg-muted px-2 py-0.5 rounded-md">Size: {entry.size}</span>}
                        {entry.color && <span className="bg-muted px-2 py-0.5 rounded-md">Color: {entry.color}</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button 
                          className="px-3 py-1 hover:bg-muted text-muted-foreground transition-colors rounded-l-lg"
                          onClick={() => updateQuantity(entry.id, Math.max(1, entry.quantity - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-1 text-sm font-medium">{entry.quantity}</span>
                        <button 
                          className="px-3 py-1 hover:bg-muted text-muted-foreground transition-colors rounded-r-lg"
                          onClick={() => updateQuantity(entry.id, entry.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeItem(entry.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-border px-6 py-6 bg-muted/20 backdrop-blur-md">
            <div className="flex justify-between text-lg font-heading font-semibold text-foreground mb-4">
              <p>Subtotal</p>
              <p>EGP {totalPrice().toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Shipping and taxes calculated at checkout.</p>
            <div className="space-y-3">
              <Button className="w-full text-lg h-14 rounded-xl shadow-lg hover:shadow-primary/25 transition-all" onClick={toggleCart} asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-xl" onClick={toggleCart}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
