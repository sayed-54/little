"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types/order';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { CheckCircle2, ChevronLeft, Loader2, Lock, CreditCard, Banknote, Navigation } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { client } from '@/lib/sanity';
import { getStoreSettingsQuery } from '@/lib/queries';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
  const { cart, totalPrice } = useCartStore();
  const { data: session } = useSession();
  
  // Checkout & Setting State
  const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');
  const [settings, setSettings] = useState<any>(null);
  
  // App State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState<{ type: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  useEffect(() => {
    // Auto-fill user data if logged in
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        address: (session.user as any).address || '',
      });
    }

    // Fetch store settings for fees
    const fetchSettings = async () => {
      try {
        const data = await client.fetch(getStoreSettingsQuery);
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch store settings:", err);
      }
    };
    fetchSettings();
  }, [session]);

  const shippingFee = settings?.shippingFee || 0;
  const codFee = paymentMethod === 'cod' ? (settings?.codFee || 0) : 0;

  const calculateDiscountedSubtotal = () => {
    const subtotal = totalPrice();
    if (!discount) return subtotal;
    if (discount.type === 'percentage') {
      return subtotal - (subtotal * discount.value / 100);
    } else {
      return Math.max(0, subtotal - discount.value);
    }
  };

  const calculateTotal = () => {
    return calculateDiscountedSubtotal() + shippingFee + codFee;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon');
        setDiscount(null);
      } else {
        setDiscount({ type: data.discountType, value: data.discountValue });
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct payload
    const payload = {
      items: cart,
      customerDetails: formData,
      userId: session?.user?.id || "guest",
      discount: discount ? { type: discount.type, value: discount.value } : null,
      fees: { shipping: shippingFee, cod: codFee, totalDiscount: calculateDiscountedSubtotal() - totalPrice() }
    };

    try {
      if (paymentMethod === 'stripe') {
        // Handle Stripe Checkout
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, email: formData.email }),
        });

        const { sessionId, url, error } = await response.json();
    
        if (error) {
          alert(error);
          setIsSubmitting(false);
          return;
        }

        if (url) {
          window.location.href = url;
        } else {
          const stripe = await stripePromise;
          await stripe?.redirectToCheckout({ sessionId });
        }

      } else {
        // Handle Cash on Delivery
        const response = await fetch('/api/checkout/cod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
           setOrderId(data.orderId);
           setOrderSubmitted(true);
           // Clear cart after successful COD order
           useCartStore.getState().clearCart();
        } else {
           alert(data.error || 'Failed to process cash on delivery order');
           setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (orderSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. We've received your order and will begin processing it shortly.
          </p>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm text-foreground break-all border border-border">
            <span className="text-muted-foreground block mb-1">Order ID:</span>
            {orderId}
          </div>
          <div className="pt-8">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/Products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background min-h-screen py-10 lg:py-20 mt-[80px]">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/Products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Store
        </Link>
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground mb-12">Secure Checkout</h1>
        
        {cart.length === 0 ? (
          <div className="text-center bg-card border border-border rounded-xl py-24 shadow-sm">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some items before proceeding to checkout.</p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/Products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Form Section */}
            <div className="flex-1 space-y-10">
              
              {/* Step 1: Delivery Details */}
              <div className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
                   <div>
                     <h2 className="text-xl font-heading font-bold">Delivery Details</h2>
                     <p className="text-sm text-muted-foreground">Where should we send your items?</p>
                   </div>
                </div>
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="h-12 border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+20 123 456 7890" value={formData.phone} onChange={handleChange} required className="h-12 border-border" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className="h-12 border-border" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Delivery Address</Label>
                    <Input id="address" name="address" placeholder="123 Main St, City, District" value={formData.address} onChange={handleChange} required className="h-12 border-border" />
                  </div>
                </form>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">2</div>
                   <div>
                     <h2 className="text-xl font-heading font-bold">Payment Method</h2>
                     <p className="text-sm text-muted-foreground">All transactions are secure and encrypted.</p>
                   </div>
                </div>

                <div className="grid gap-4">
                  {/* Stripe Card Option */}
                  <label className={`relative flex cursor-pointer rounded-xl border p-5 ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-border bg-transparent'} transition-colors hover:bg-muted/50`}>
                    <input type="radio" name="payment_method" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="sr-only" />
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-primary' : 'border-input'}`}>
                            {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                         </div>
                         <div className="flex flex-col">
                           <span className="font-semibold text-foreground flex items-center gap-2">
                             Credit or Debit Card <CreditCard size={18} className="text-primary" />
                           </span>
                           <span className="text-xs text-muted-foreground mt-0.5">Pay securely via Stripe</span>
                         </div>
                      </div>
                      <div className="flex gap-1.5 opacity-60">
                         {/* Fake CC icons */}
                         <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                         <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-[8px] font-bold text-white">MC</div>
                      </div>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label className={`relative flex cursor-pointer rounded-xl border p-5 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border bg-transparent'} transition-colors hover:bg-muted/50`}>
                    <input type="radio" name="payment_method" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-input'}`}>
                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                         </div>
                         <div className="flex flex-col">
                           <span className="font-semibold text-foreground flex items-center gap-2">
                             Cash on Delivery <Banknote size={18} className="text-green-600" />
                           </span>
                           <span className="text-xs text-muted-foreground mt-0.5">Pay in cash when you receive your order</span>
                         </div>
                      </div>
                      {settings?.codFee > 0 && (
                        <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                          + EGP {settings.codFee} Fee
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full h-16 text-xl rounded-2xl shadow-xl hover:shadow-primary/40 transition-all font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Processing Order...
                    </>
                  ) : paymentMethod === 'stripe' ? (
                    <>Pay EGP {calculateTotal().toLocaleString()}</>
                  ) : (
                    <>Complete Order (EGP {calculateTotal().toLocaleString()})</>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
                  <Lock size={12} /> Securely encrypted via 256-bit SSL
                </p>
              </div>

            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-[420px]">
              <div className="bg-card border border-border shadow-sm rounded-2xl p-6 lg:sticky lg:top-32">
                <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                  <Navigation size={18} className="text-primary"/> Order Summary
                </h3>
                
                <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-20 rounded-md overflow-hidden bg-muted border border-border flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <div className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold z-10 shadow-sm">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                        <div className="text-xs text-muted-foreground mt-1 space-x-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <div className="font-bold text-sm">
                        EGP {((item.sale_price ?? item.price) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-6 pb-6">
                  <Label htmlFor="coupon" className="text-sm mb-3 block font-semibold text-foreground">Discount Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="coupon"
                      placeholder="Enter promo code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-12 bg-muted/50 border-input"
                      disabled={discount !== null}
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyCoupon}
                      className="h-12 px-6"
                      disabled={isValidatingCoupon || !couponCode || discount !== null}
                    >
                      {isValidatingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                  {discount && (
                    <div className="mt-4 flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/20 p-3 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-green-700 dark:text-green-500 tracking-wider">Applied Coupon</span>
                        <span className="text-sm font-bold text-green-800 dark:text-green-400">{couponCode}</span>
                      </div>
                      <button 
                        onClick={() => { setDiscount(null); setCouponCode(''); }}
                        className="text-xs font-bold text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-6 space-y-4 pb-6">
                  <div className="flex justify-between text-sm text-foreground">
                    <p className="text-muted-foreground font-medium">Subtotal</p>
                    <p className="font-bold">EGP {totalPrice().toLocaleString()}</p>
                  </div>
                  
                  {discount && (
                    <div className="flex justify-between text-sm">
                      <p className="text-green-600 font-medium">Custom Discount</p>
                      <p className="font-bold text-green-600">- EGP {(totalPrice() - calculateDiscountedSubtotal()).toLocaleString()}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-foreground">
                    <p className="text-muted-foreground font-medium">Standard Shipping</p>
                    <p className="font-bold">{shippingFee > 0 ? `EGP ${shippingFee}` : 'Free'}</p>
                  </div>

                  {paymentMethod === 'cod' && codFee > 0 && (
                    <div className="flex justify-between text-sm text-foreground">
                      <p className="text-muted-foreground font-medium flex items-center gap-1">COD Fee</p>
                      <p className="font-bold">EGP {codFee}</p>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-border pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-lg font-bold text-foreground">Total Due</p>
                    <p className="text-xs text-muted-foreground mt-1">Including all taxes and fees</p>
                  </div>
                  <p className="text-3xl font-black text-primary">EGP {calculateTotal().toLocaleString()}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
