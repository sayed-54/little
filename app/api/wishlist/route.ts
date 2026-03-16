import { NextResponse } from "next/server";
import { adminClient } from "@/lib/sanityAdmin";

export async function POST(req: Request) {
  try {
    const { userId, wishlist } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the user document in Sanity with new wishlist references
    // Filter to ensure we only have strings
    const validWishlist = Array.isArray(wishlist) 
      ? wishlist.filter(id => typeof id === 'string')
      : [];

    await adminClient
      .patch(userId)
      .set({ 
        wishlist: validWishlist.map((id: string) => ({
          _type: 'reference',
          _ref: id,
          _key: `wishlist_${id}`
        })) 
      })
      .commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Wishlist Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
