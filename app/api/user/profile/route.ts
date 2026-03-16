import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminClient } from "@/lib/sanityAdmin";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address } = await req.json();

    // Find the user in Sanity first to get their _id
    const user = await adminClient.fetch(
      `*[_type == "users" && email == $email][0]`,
      { email: session.user.email }
    );

    if (!user) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user document
    const updatedUser = await adminClient
      .patch(user._id)
      .set({
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address
      })
      .commit();

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
