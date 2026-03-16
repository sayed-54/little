import { client } from "@/lib/sanity";
import ImageGallary from "@/components/product/ImageGallary";
import ClientPDP from "@/components/product/ClientPDP";
import { Truck, ShieldCheck, RefreshCw, Star } from "lucide-react";
import ProductReviews from "@/components/product/ProductReviews";

export const revalidate = 30;

async function getProductData(slug: string) {
  const query = `*[_type=='products' && slug.current=="${slug}"][0]{
    _id,
    images,
    price,
    sale_price,
    name,
    description,
    sizes,
    colors,
    rating,
    reviewsCount,
    "slug": slug.current,
    "categoryName": categories[0]->name
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductData(params.slug);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h2 className="text-2xl font-semibold text-foreground">Product not found.</h2>
      </div>
    );
  }

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          <div className="md:sticky md:top-32 h-max">
            <ImageGallary images={product.images} />
          </div>
          
          <div className="py-4 flex flex-col">
            <div className="mb-4">
              <span className="uppercase tracking-widest text-sm text-primary font-bold mb-2 block">
                {product.categoryName || "Little Locals"}
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Inline rating display */}
              {product.reviewsCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">{product.rating?.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewsCount} {product.reviewsCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl text-foreground font-bold">
                EGP {(product.sale_price || product.price).toLocaleString()}
              </span>
              {product.sale_price && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  EGP {product.price.toLocaleString()}
                </span>
              )}
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 whitespace-pre-line">
              {product.description}
            </p>
            
            <ClientPDP product={product} />
            
            {/* Value Props */}
            <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Free Shipping</h4>
                  <p className="text-xs text-muted-foreground">On orders over EGP 2000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                  <RefreshCw size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Easy Returns</h4>
                  <p className="text-xs text-muted-foreground">14-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Secure Checkout</h4>
                  <p className="text-xs text-muted-foreground">100% secure payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews — full width below the product grid */}
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
}
