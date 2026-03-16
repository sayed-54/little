import { client } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AccountSidebar from "@/components/auth/AccountSidebar";

async function getWishlist(userId: string) {
  const query = `*[_type == "users" && _id == $userId][0]{
    wishlist[]->{
      _id,
      name,
      price,
      sale_price,
      "slug": slug.current,
      "imageUrl": images[0].asset->url
    }
  }`;
  return await client.fetch(query, { userId });
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center mt-24">
        <Heart size={64} className="text-muted-foreground/20 mb-6" />
        <h1 className="text-3xl font-heading font-black mb-4 uppercase">Your Wishlist awaits</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">Sign in to sync your favorites across all your devices.</p>
        <Link href="/login" className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl hover:shadow-xl transition-all">
          Sign In
        </Link>
      </div>
    );
  }

  const data = await getWishlist(session.user.id);
  const wishlist = data?.wishlist || [];

  return (
    <div className="min-h-screen bg-background py-12 lg:py-24 mt-[80px]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="md:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground mb-4 uppercase tracking-tighter">
            THE <span className="text-primary italic">VAULT</span>
          </h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.3em]">
            Your curated collection of desired pieces ({wishlist.length})
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-[3rem]">
            <Heart size={48} className="text-muted-foreground/20 mb-6" />
            <p className="text-xl font-bold text-foreground mb-8">Your vault is currently empty.</p>
            <Link href="/Products" className="text-sm font-black uppercase tracking-widest border-b-2 border-primary pb-1">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((item: any) => (
              <div key={item._id} className="group relative">
                <Link href={`/product/${item.slug}`} className="block aspect-[3/4] rounded-[2rem] overflow-hidden bg-muted transition-all duration-700 hover:rounded-[3rem] group-hover:-rotate-1 shadow-md hover:shadow-2xl">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <button className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl">
                      View Piece
                    </button>
                  </div>
                </Link>
                <div className="mt-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-heading font-black uppercase group-hover:text-primary transition-colors">
                      <Link href={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-xl font-bold text-foreground">
                        EGP {(item.sale_price || item.price).toLocaleString()}
                      </span>
                      {item.sale_price && (
                        <span className="text-sm text-muted-foreground line-through decoration-primary/40">
                          EGP {item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
