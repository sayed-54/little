import { Filter, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";

export const revalidate = 0;

async function getData(searchParams: any) {
  const categoryFilter = searchParams.category ? ` && references(*[_type=="category" && slug.current=="${searchParams.category}"]._id)` : "";
  const searchFilter = searchParams.q ? ` && name match "${searchParams.q}*"` : "";
  let orderFilter = ` | order(_createdAt desc)`;
  
  if (searchParams.sort === 'price_asc') orderFilter = ` | order(price asc)`;
  if (searchParams.sort === 'price_desc') orderFilter = ` | order(price desc)`;

  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const offset = (page - 1) * limit;

  const countQuery = `count(*[_type=='products'${categoryFilter}${searchFilter}])`;
  const dataQuery = `*[_type=='products'${categoryFilter}${searchFilter}]${orderFilter}[${offset}...${offset + limit}]{
    _id, 
    price,
    sale_price,
    name,
    "slug":slug.current,
    "imageUrl":images[0].asset->url,
    "category": categories[0]->name
  }`;
  
  try {
    const [total, data] = await Promise.all([
      client.fetch(countQuery),
      client.fetch(dataQuery)
    ]);
    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (e) {
    return { data: [], total: 0, totalPages: 0, currentPage: 1 };
  }
}

async function getCategories() {
  const query = `*[_type=='category']{ name, "slug":slug.current }`;
  try {
    return await client.fetch(query);
  } catch (e) {
    return [];
  }
}

export default async function Products({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const [result, categories] = await Promise.all([
    getData(searchParams),
    getCategories()
  ]);

  const { data, totalPages, currentPage, total } = result;

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-x-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 mb-10 md:mb-0">
            <div className="sticky top-32">
              <div className="flex items-center gap-2 font-heading font-bold text-xl mb-6 text-foreground">
                <Filter size={20} /> Filters
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/Products" className={`text-sm hover:text-primary transition-colors ${!searchParams.category ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      All Categories
                    </Link>
                  </li>
                  {categories?.map((cat: any, idx: number) => (
                    <li key={cat.slug || `cat-${idx}`}>
                      <Link 
                        href={`/Products?category=${cat.slug}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`} 
                        className={`text-sm hover:text-primary transition-colors ${searchParams.category === cat.slug ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Sort By</h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href={`/Products?sort=newest${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                      className={`text-sm hover:text-primary transition-colors ${!searchParams.sort || searchParams.sort === 'newest' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                    >
                      Newest Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/Products?sort=price_asc${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                      className={`text-sm hover:text-primary transition-colors ${searchParams.sort === 'price_asc' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                    >
                      Price: Low to High
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/Products?sort=price_desc${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                      className={`text-sm hover:text-primary transition-colors ${searchParams.sort === 'price_desc' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                    >
                      Price: High to Low
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
              <h1 className="text-3xl font-heading font-extrabold text-foreground">
                {searchParams.q ? `Search results for "${searchParams.q}"` : (searchParams.category ? categories.find((c:any) => c.slug === searchParams.category)?.name : "All Collection")}
              </h1>
              <span className="text-muted-foreground text-sm">{total} Products</span>
            </div>

            {data?.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <SlidersHorizontal size={48} className="text-muted mb-4" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or category selection.</p>
                <Link href="/Products" className="mt-6 text-primary font-medium hover:underline">Clear all filters</Link>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
                  {data?.map((product: any) => (
                    <ProductCard 
                      key={product._id} 
                      product={{
                        ...product,
                        categoryName: product.category
                      }} 
                    />
                  ))}
                </div>
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
