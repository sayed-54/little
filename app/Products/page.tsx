import Link from "next/link";
import { client } from "../lib/sanity";
import Image from "next/image";
export const revalidate = 30;

interface simplifiedproduct {
  _id: string;
  imageUrl: string;
 price:number;
  slug: string;
  name: string;
}

async function getdata() {
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

export default async function Products() {
  const data: simplifiedproduct[] = await getdata();

  

  return (
    <section className="bg-white mt-[128px]">
      <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 sm:py-12 lg:max-w-[1440px] lg:px-8">
        <h2 className="md:text-3xl sm:text-xl text-lg font-bold tracking-tight text-gray-900 w-full">
          All Products
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <Link href={`/product/${product.slug}`} key={product._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-80 lg:h-88 shadow-md">
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
                <h3 className="text-lg font-semibold sm:text-xl text-gray-900">
                  <Link href={`/product/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>
                <div className="flex items-end gap-2 py-2">
                  <p className="text-lg text-gray-800 font-medium md:text-xl">
                    LE {product.price}<sup>.00</sup>
                  </p>
                 
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
