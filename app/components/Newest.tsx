
import Link from "next/link";
import { client } from "../lib/sanity";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import simplifiedproduct from "../interface";
export const revalidate = 30;

// Data fetching function
async function getData() {
  const query = `*[_type=='products'] | order(_createdAt desc){
    _id, 
    price ,
    name,
    "slug":slug.current,
    "imageUrl":images[0].asset->url
  }`;
  const data = await client.fetch(query);
  return data;
}

// The Newest component
export default async function Newest() {
  const data: simplifiedproduct[] = await getData();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:px-6 sm:py-24 lg:max-w-[1440px] lg:px-8">
        <div className="flex justify-between items-center">
          {/* Section Title */}
          <h2 className="md:text-3xl sm:text-xl text-xl font-bold tracking-tight text-gray-900 w-2/3">
            Our Newest products
          </h2>

          {/* See All Link */}
          <Link href={"/Products"} className="text-primary text-lg sm:text-xl md:text-2xl font-semibold flex flex-row items-center place-content-end gap-x-1 w-1/3">
            See All <span><ArrowRight /></span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {data.slice(0,4).map((product) => (
            <Link href={`/product/${product.slug}`} key={product._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-80 lg:h-88">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-full lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex flex-col justify-between ml-2">
                <p className="mb-2 text-sm text-gray-500">LittleLocals</p>
                <h3 className="text-lg sm:text-xl text-gray-900">
                  <Link href={`/product/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="text-lg text-gray-700">
                  EGP {product.price}.00
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
