"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const [formData, setFormData] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });

  // Pre-fill name from session
  useEffect(() => {
    if (session?.user?.name) {
      setFormData((prev) => ({ ...prev, userName: session.user!.name! }));
    }
  }, [session]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
      setFormData({ userName: session?.user?.name || "", rating: 5, comment: "" });
      // Re-fetch reviews to include the newly submitted one
      await fetchReviews();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Computed stats
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <div className="mt-24 pt-16 border-t border-border">
      <h2 className="text-3xl font-heading font-black text-foreground mb-12 uppercase tracking-tighter">
        Customer Reviews
      </h2>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Summary + Form */}
        <div className="lg:w-5/12">
          {/* Rating summary */}
          <div className="flex items-start gap-6 mb-8">
            <div className="text-center">
              <div className="text-6xl font-black text-foreground leading-none">{averageRating}</div>
              <div className="flex text-primary justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 space-y-1.5">
              {ratingDistribution.map(({ star, pct, count }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-muted-foreground font-bold">{star}</span>
                  <Star size={11} className="text-primary" fill="currentColor" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-4 text-right text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-muted/30 rounded-3xl p-8 border border-border">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Review Submitted!</h3>
                <p className="text-sm text-muted-foreground">
                  Thank you for your feedback. Your review is now live.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => setSubmitted(false)}
                >
                  Write Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
                    Your Name
                  </Label>
                  <Input
                    required
                    value={formData.userName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    placeholder="e.g. Sarah Johnson"
                    className="bg-background rounded-xl h-12"
                  />
                </div>

                <div>
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
                    Rating
                  </Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          formData.rating >= num
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "bg-background border border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <Star size={18} fill={formData.rating >= num ? "currentColor" : "none"} />
                      </button>
                    ))}
                    <span className="ml-2 flex items-center text-sm text-muted-foreground font-medium">
                      {formData.rating} star{formData.rating > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
                    Your Review
                  </Label>
                  <Textarea
                    required
                    value={formData.comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    placeholder="Share your experience with this product..."
                    className="bg-background rounded-xl min-h-[120px]"
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                <Button
                  disabled={submitting}
                  className="w-full h-14 font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : "Submit Review"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Reviews list */}
        <div className="lg:w-7/12">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-muted-foreground">
              <Loader2 className="animate-spin mr-2" /> Loading reviews...
            </div>
          ) : reviews.length > 0 ? (
            <div>
              <div className="space-y-8">
                {reviews.slice(0, visibleCount).map((review) => (
                  <div key={review._id} className="border-b border-border pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar initials */}
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm uppercase">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground capitalize tracking-tight text-sm">
                            {review.userName}
                          </h4>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-primary gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-sm pl-13">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              {reviews.length > visibleCount && (
                <button
                  onClick={() => setVisibleCount((v) => v + 4)}
                  className="mt-8 flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  Load more reviews <ChevronDown size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-[3rem] text-center px-8">
              <MessageSquare className="text-muted-foreground/30 mb-4" size={48} />
              <h3 className="font-bold text-foreground mb-2">No Reviews Yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Be the first to share your experience with this product.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
