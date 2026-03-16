import Link from "next/link";
import { client } from "@/lib/sanity";
import Image from "next/image";

export const revalidate = 30;

interface SimplifiedProduct {
  _id: string;
  imageUrl: string;
  OldPrice: number;
  NewPrice: number;
  slug: string;
  name: string;
}

async function getData() {
  const query = `*[_type=='sale'] | order(_createdAt desc) {
    _id,
    OldPrice,
    NewPrice,
    name,
    "slug": slug.current,
    "imageUrl": images[0].asset->url
  }`;
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Error fetching sale data:", error);
    return [];
  }
}

export default async function SaleProductsPage() {
  const data: SimplifiedProduct[] = await getData();

  if (data.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background px-4 mt-24">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🏷️</span>
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">No Sale Products Available</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Check back later for our exclusive discounts and curated seasonal offers.
        </p>
        <Link href="/Products" className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Dynamic Dramatic Hero Header */}
      <div className="relative overflow-hidden bg-[#0a0a0a] py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-orange-600/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 animate-pulse">
                Limited Time Offers
              </span>
              <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 leading-[0.9] tracking-tighter">
                SEASONAL <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">SHOWCASE</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed">
                Unlock unparalleled value on our most coveted pieces. A temporary exhibition of luxury at accessible prices.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="text-5xl md:text-7xl font-black text-white/10 mb-2">
                {data.length < 10 ? `0${data.length}` : data.length}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-500">Curated Steals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1440px] -mt-12 pb-24 relative z-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((product, idx) => {
            const savings = Math.round(((product.OldPrice - product.NewPrice) / product.OldPrice) * 100);
            return (
              <div 
                key={product._id} 
                className={`group flex flex-col ${idx % 2 !== 0 ? 'md:mt-12' : ''}`}
              >
                <Link href={`/saleproduct/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl transition-all duration-700 hover:rounded-[3rem] hover:-rotate-1">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1440px) 33vw, 25vw"
                    className="object-cover object-center transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
                  />
                  
                  {/* High Visibility Save Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-white text-black px-4 py-3 rounded-2xl flex flex-col items-center shadow-xl transform -rotate-6 group-hover:rotate-6 transition-transform duration-500">
                      <span className="text-[10px] font-black leading-none">SAVE</span>
                      <span className="text-2xl font-black leading-none">{savings}%</span>
                    </div>
                  </div>

                  {/* Hover Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-red-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <button className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Secure Item
                    </button>
                  </div>
                </Link>

                <div className="mt-8 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-heading font-black text-foreground group-hover:text-red-600 transition-colors uppercase tracking-tight">
                      <Link href={`/saleproduct/${product.slug}`}>{product.name}</Link>
                    </h3>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-2xl font-black text-foreground">
                      EGP {product.NewPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground line-through decoration-red-600/40">
                      EGP {product.OldPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
