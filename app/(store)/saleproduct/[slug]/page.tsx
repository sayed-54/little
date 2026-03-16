import { client } from "@/lib/sanity";
import ImageGallarySale from "@/components/product/ImageGallarySale";
import { Truck, ShieldCheck, RefreshCcw, ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import ClientSalePDP from "@/components/product/ClientSalePDP";
import ProductReviews from "@/components/product/ProductReviews";

interface FullProduct {
  _id: string;
  images: any[];
  OldPrice: number;
  NewPrice: number;
  slug: string;
  name: string;
  description: string;
  sizes: string[];
  rating?: number;
  reviewsCount?: number;
}

async function getProductData(slug: string): Promise<FullProduct | null> {
  const query = `*[_type == 'sale' && slug.current == "${slug}"][0]{
    _id,
    images,
    OldPrice,
    NewPrice,
    name,
    description,
    sizes,
    rating,
    reviewsCount,
    "slug": slug.current
  }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

export default async function SalePage({ params }: { params: { slug: string } }) {
  const product = await getProductData(params.slug);

  if (!product) {
    return (
       <div className="min-h-screen flex items-center justify-center mt-24">
         <div className="text-center">
            <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
            <Link href="/Sale" className="text-primary hover:underline">Return to Sale</Link>
         </div>
       </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1440px] py-12 lg:py-20 mt-16 md:mt-24">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
          <Link href="/Sale" className="hover:text-red-600 transition-colors flex items-center gap-1 group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Showcase
          </Link>
          <span className="mx-2 opacity-30">/</span>
          <span className="text-foreground/40">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-32 items-start">
          <div className="relative">
             <ImageGallarySale images={product.images} />
             <div className="absolute -top-4 -left-4 z-10">
                <div className="bg-red-600 text-white p-6 rounded-2xl shadow-2xl transform -rotate-12">
                   <span className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1">Save</span>
                   <span className="block text-3xl font-black italic leading-none">
                     {Math.round(((product.OldPrice - product.NewPrice) / product.OldPrice) * 100)}%
                   </span>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col">
             <div className="mb-12 border-b-2 border-foreground/5 pb-12">
                <span className="inline-block px-3 py-1 bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-md mb-6">
                  Vault Selection
                </span>
                <h1 className="text-4xl lg:text-7xl font-heading font-black text-foreground mb-8 leading-[0.9] tracking-tighter uppercase">
                  {product.name}
                </h1>

                {/* Inline rating display */}
                {product.reviewsCount && product.reviewsCount > 0 ? (
                  <div className="flex items-center gap-2 mb-8">
                    <div className="flex text-primary">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={18}
                          fill={i <= Math.round(product.rating || 0) ? "currentColor" : "none"}
                          className="stroke-[1.5]"
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-foreground">{(product.rating || 0).toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                      ({product.reviewsCount} {product.reviewsCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center gap-6">
                  <div className="bg-foreground text-background px-6 py-4 rounded-2xl">
                    <span className="text-3xl lg:text-4xl font-black">
                      EGP {product.NewPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg text-muted-foreground/50 line-through font-bold">
                      EGP {product.OldPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em]">
                      Exclusive Drop
                    </span>
                  </div>
                </div>
             </div>

             <ClientSalePDP product={product} />

             {/* Narrative Section */}
             <div className="mt-16 space-y-12">
                <div className="relative">
                   <div className="absolute -left-6 top-0 w-1 h-full bg-red-600/30" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-6">The Narrative</h3>
                   <p className="text-lg lg:text-xl text-foreground/80 leading-relaxed font-medium">
                     {product.description || "A masterpiece of contemporary aesthetics, merging industrial resilience with organic grace. This piece is a testament to the pursuit of perfection, now accessible for a limited engagement."}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="flex flex-col p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-transparent hover:border-red-600/20 transition-colors">
                      <Truck className="text-red-600 mb-4" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Global Logistics</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Express Tier</span>
                   </div>
                   <div className="flex flex-col p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-transparent hover:border-red-600/20 transition-colors">
                      <ShieldCheck className="text-red-600 mb-4" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Provenance</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Verified Authentic</span>
                   </div>
                   <div className="flex flex-col p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-transparent hover:border-red-600/20 transition-colors">
                      <RefreshCcw className="text-red-600 mb-4" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Assurance</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Extended Window</span>
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

