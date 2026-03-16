import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { adminClient } from "@/lib/sanityAdmin";
import Stripe from "stripe";

import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const metadata = session.metadata;
    const items = JSON.parse(metadata?.cartItems || "[]");

    try {
      const orderDoc: any = {
        _type: "order",
        orderId: session.id,
        name: session.customer_details?.name || "Unknown",
        email: session.customer_details?.email || "No Email",
        phone: metadata?.phone || session.customer_details?.phone || "",
        address: metadata?.address || session.customer_details?.address?.line1 || "",
        totalPrice: (session.amount_total || 0) / 100,
        status: "processing",
        paymentMethod: "stripe",
        fees: {
          shipping: parseFloat(metadata?.shippingFee || "0"),
          cod: 0,
          discount: parseFloat(metadata?.discountVal || "0")
        },
        cartDetails: items.map((item: any, idx: number) => ({
          _key: `item_${idx}`,
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        })),
        createdAt: new Date().toISOString(),
      };

      if (metadata?.userId && metadata.userId !== "guest") {
        orderDoc.user = {
          _type: 'reference',
          _ref: metadata.userId
        };
      }

      // 1. Create Order in Sanity
      const order = await adminClient.create(orderDoc);

      // 2. Send Order Confirmation Email via Resend
      if (session.customer_details?.email) {
        await resend.emails.send({
          from: "Little Locals <orders@littlelocals.com>", // User should configure domain in Resend
          to: session.customer_details.email,
          subject: `Order Confirmed - #${session.id.slice(-8)}`,
          html: `
            <h1>Thank you for your order!</h1>
            <p>Hi ${session.customer_details.name},</p>
            <p>Your order has been confirmed and is being processed.</p>
            <p><strong>Order ID:</strong> ${session.id}</p>
            <p><strong>Total Amount:</strong> EGP ${(session.amount_total || 0) / 100}</p>
            <p>We'll notify you when your items are on the way.</p>
            <br/>
            <p>Best regards,<br/>The Little Locals Team</p>
          `,
        });
      }

      console.log("Order processed and email sent:", order._id);
    } catch (err) {
      console.error("Order fulfillment error:", err);
      return new NextResponse("Error processing order", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
