import Image from "next/image";
import { client } from "@/lib/sanity";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getCategories() {
  const query = `*[_type=='category'] | order(name asc) {
    _id, 
    name,
    "slug":slug.current,
    "imageUrl":image.asset->url
  }`;
  try {
    return await client.fetch(query);
  } catch (e) {
    return [];
  }
}

export default async function FeaturedCategories() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg">Explore our curated collections designed for every occasion.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat: any) => (
            <Link key={cat._id} href={`/Products?category=${cat.slug}`} className="group relative h-[400px] rounded-2xl overflow-hidden block">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out z-0"
                />
              ) : (
                <div className="absolute inset-0 bg-secondary z-0"></div>
              )}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex justify-between items-end">
                <h3 className="text-3xl font-heading font-semibold text-white">{cat.name}</h3>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowRight size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
