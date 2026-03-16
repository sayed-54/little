import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/types/order";

export async function POST(req: Request) {
  try {
    const { items, email, userId, discount, fees, customerDetails } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items = items.map((item: CartItem) => {
      let unitAmount = Math.round((item.sale_price || item.price) * 100);
      
      if (discount) {
        if (discount.type === 'percentage') {
          unitAmount = Math.round(unitAmount * (1 - discount.value / 100));
        } else if (discount.type === 'fixed') {
          // Proportionally distribute fixed discount to avoid negative prices
          const totalCartPrice = items.reduce((acc: number, i: CartItem) => acc + (i.sale_price || i.price) * i.quantity, 0);
          const proportion = (item.sale_price || item.price) / totalCartPrice;
          const itemDiscount = (discount.value * proportion) / item.quantity;
          unitAmount = Math.round(Math.max(0, (item.sale_price || item.price) - itemDiscount) * 100);
        }
      }

      return {
        price_data: {
          currency: item.currency || "egp",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Add Shipping Fee as a line item if applicable
    if (fees?.shipping && fees.shipping > 0) {
      line_items.push({
        price_data: {
          currency: items[0]?.currency || "egp",
          product_data: {
            name: "Standard Shipping",
          },
          unit_amount: Math.round(fees.shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: email,
      metadata: {
        userId: userId || "guest",
        address: customerDetails?.address || "",
        phone: customerDetails?.phone || "",
        shippingFee: fees?.shipping?.toString() || "0",
        discountVal: fees?.totalDiscount?.toString() || "0",
        // Storing minimal item data for webhook processing
        cartItems: JSON.stringify(items.map((i: any) => ({
          productId: i.productId || i.id,
          name: i.name,
          image: i.image,
          price: i.sale_price || i.price,
          quantity: i.quantity,
          size: i.size || "",
          color: i.color || ""
        }))),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
