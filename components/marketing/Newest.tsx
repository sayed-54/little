import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 30;

async function getData() {
  const query = `*[_type=='products'] | order(_createdAt desc){
    _id, 
    price,
    sale_price,
    name,
    "slug":slug.current,
    "imageUrl":images[0].asset->url
  }`;
  try {
    return await client.fetch(query);
  } catch (e) {
    return [];
  }
}

export default async function Newest() {
  const data = await getData();

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-border pb-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4">
              New Arrivals
            </h2>
            <p className="text-muted-foreground">Discover the latest additions to our premium collection.</p>
          </div>
          <Link href="/Products" className="group inline-flex items-center text-primary font-semibold mt-6 sm:mt-0 hover:text-primary/80 transition-colors">
            View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
          {data?.slice(0, 4).map((product: any) => (
            <ProductCard 
              key={product._id} 
              product={{
                ...product,
                categoryName: "New Arrival"
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
