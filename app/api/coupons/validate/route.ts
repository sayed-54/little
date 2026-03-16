import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const query = `*[_type == "coupons" && code == $code && isActive == true][0]{
      code,
      discountType,
      discountValue,
      validFrom,
      validUntil
    }`;

    const coupon = await client.fetch(query, { code });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 404 });
    }

    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return NextResponse.json({ error: "Coupon is not yet valid" }, { status: 400 });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    return NextResponse.json(coupon);
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
