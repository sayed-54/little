import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { adminClient } from "@/lib/sanityAdmin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, productId } = await req.json();

    if (!productId || !["add", "remove"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Find the user document
    const user = await adminClient.fetch(
      `*[_type == "users" && email == $email][0]{ _id, wishlist }`,
      { email: session.user.email }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentWishlist = user.wishlist || [];
    let updatedWishlist = [...currentWishlist];

    const refObject = {
      _type: 'reference',
      _ref: productId,
      _key: productId // Need a unique key for arrays of references in Sanity
    };

    if (action === "add") {
      // Add only if not already there
      if (!currentWishlist.some((ref: any) => ref._ref === productId)) {
        updatedWishlist.push(refObject);
      }
    } else if (action === "remove") {
      // Remove the reference
      updatedWishlist = currentWishlist.filter((ref: any) => ref._ref !== productId);
    }

    // Patch the Sanity document securely with the admin client
    await adminClient
      .patch(user._id)
      .set({ wishlist: updatedWishlist })
      .commit();

    return NextResponse.json({ success: true, wishlist: updatedWishlist });
    
  } catch (error: any) {
    console.error("Wishlist sync error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
