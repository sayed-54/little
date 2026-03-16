import { NextResponse } from "next/server";
import { adminClient } from "@/lib/sanityAdmin";

// GET: Fetch approved reviews for a product
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const query = `*[_type == "review" && product._ref == $productId && isApproved == true] | order(createdAt desc) {
      _id,
      userName,
      rating,
      comment,
      createdAt
    }`;

    // Use adminClient (non-CDN) for fresh data
    const reviews = await adminClient.fetch(query, { productId });
    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Submit a new review and auto-update product rating/reviewsCount
export async function POST(req: Request) {
  try {
    const { productId, userName, rating, comment } = await req.json();

    if (!productId || !userName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Create the review — auto-approve for immediate visibility
    const review = await adminClient.create({
      _type: "review",
      product: {
        _type: "reference",
        _ref: productId,
      },
      userName,
      rating: Number(rating),
      comment: comment || "",
      isApproved: true, // Auto-approve for immediate display
      createdAt: new Date().toISOString(),
    });

    // Recalculate aggregate rating + count from all approved reviews
    const allReviews = await adminClient.fetch(
      `*[_type == "review" && product._ref == $productId && isApproved == true]{ rating }`,
      { productId }
    );

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
      const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

      // Patch the product document with fresh stats
      await adminClient
        .patch(productId)
        .set({
          rating: avgRating,
          reviewsCount: allReviews.length,
        })
        .commit();
    }

    return NextResponse.json({ success: true, reviewId: review._id });
  } catch (error: any) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
