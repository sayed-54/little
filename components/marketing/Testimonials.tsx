import { client } from "@/lib/sanity";
import { getTestimonialsQuery } from "@/lib/queries";
import { Star } from "lucide-react";

async function getTestimonials() {
  try {
    return await client.fetch(getTestimonialsQuery);
  } catch (e) {
    return [];
  }
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground">Don&apos;t just take our word for it. Hear from our satisfied community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t: any, idx: number) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-6 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < (t.rating || 5) ? 'currentColor' : 'none'} className={i >= (t.rating || 5) ? 'text-muted' : ''} />
                ))}
              </div>
              <p className="text-foreground leading-relaxed italic mb-8">&quot;{t.quote}&quot;</p>
              <div>
                <p className="font-heading font-semibold text-foreground text-lg">{t.author}</p>
                <p className="text-muted-foreground text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
