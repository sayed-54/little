import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sanity webhook payload verification could be added here
    // using @sanity/webhook if configured with a secret in Sanity Studio

    const { _id, _type, status, email, name, orderId } = body;

    // We only care about orders that have transitioned to "shipped"
    if (_type !== "order" || status !== "shipped") {
      return NextResponse.json({ message: "Ignored event" });
    }

    if (!email) {
      console.log(`Order ${_id} marked as shipped, but no email address found.`);
      return NextResponse.json({ message: "No email provided" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://littlelocals.com";

    // Send Shipping Notification Email
    await resend.emails.send({
      from: "Little Locals <orders@littlelocals.com>",
      to: email,
      subject: `Great news! Your order #${orderId || _id.slice(-8)} has shipped 📦`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
             <img src="${baseUrl}/icon.png" alt="Little Locals Logo" style="width: 80px;" />
          </div>
          <h2 style="color: #111;">Your order is on its way!</h2>
          <p style="color: #444; line-height: 1.6;">
            Hi ${name || 'there'},<br><br>
            We've packed your luxury pieces carefully, and they've just left our facility. 
            They are officially on their way to you!
          </p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 25px 0;">
             <p style="margin: 0; color: #555;"><strong>Order Number:</strong> #${orderId || _id.slice(-8)}</p>
             <p style="margin: 5px 0 0; color: #555;"><strong>Status:</strong> Shipped</p>
          </div>
          <p style="color: #444; line-height: 1.6;">
            If you have any questions about your delivery, please reply directly to this email or contact our support team.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${baseUrl}/orders" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Track My Orders</a>
          </div>
        </div>
      `
    });

    console.log(`Shipping email sent successfully for order ${_id} to ${email}`);
    return NextResponse.json({ success: true, message: "Shipping email sent" });

  } catch (error: any) {
    console.error("Sanity Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
