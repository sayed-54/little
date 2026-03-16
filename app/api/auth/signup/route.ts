import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminClient } from "@/lib/sanityAdmin";

export async function POST(req: Request) {
  try {
    if (!process.env.SANITY_API_TOKEN) {
      console.error("SANITY_API_TOKEN is missing from environment variables");
      return NextResponse.json(
        { error: "Server configuration error: Missing API Token" },
        { status: 500 }
      );
    }
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await adminClient.fetch(
      `*[_type == "users" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Sanity
    const newUser = await adminClient.create({
      _type: "users",
      name,
      email,
      password: hashedPassword,
      role: "customer",
      wishlist: [],
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
