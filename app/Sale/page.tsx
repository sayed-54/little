import Link from "next/link";
import { client } from "../lib/sanity";
import Image from "next/image";
export const revalidate = 30;

interface simplifiedproduct {
  _id: string;
  imageUrl: string;
  OldPrice: number;
  NewPrice: number;
  slug: string;
  name: string;
}

async function getdata() {
  const query = `*[_type=='sales']{
    _id,
    OldPrice ,
    NewPrice ,
    name,
    "slug":slug.current,
    "imageUrl":images[0].asset->url,
    sizes
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function Products() {
  const data: simplifiedproduct[] = await getdata();

  // Conditionally render a message if there are no sale products
  if (data.length === 0) {
    return (
      <section className="bg-white mt-[128px]">
        <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 sm:py-12 lg:max-w-[1440px] lg:px-8">
          <h2 className="md:text-3xl sm:text-xl text-lg font-bold tracking-tight text-gray-900 w-full">
            No Sale Products Available
          </h2>
          <p className="mt-4 text-gray-600">
            Check back later for more products on sale!
          </p>
        </div>
      </section>
    );
  }

  // Render sale products if there are any
  return (
    <section className="bg-white mt-[128px]">
      <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 sm:py-12 lg:max-w-[1440px] lg:px-8">
        <h2 className="md:text-3xl sm:text-xl text-lg font-bold tracking-tight text-gray-900 w-full">
          On Sale Products
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <Link href={`/saleproduct/${product.slug}`} key={product._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-80 lg:h-88 shadow-md">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-full lg:h-full lg:w-full"
                />
                <span className="absolute top-0 left-0 bg-red-600 rounded-br-lg px-3 py-1.5 tracking-wider uppercase text-white">
                  sale
                </span>
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
                     {product.NewPrice}.00 EGP
                  </p>
                  <span className="text-red-500 line-through">
                     {product.OldPrice}.00 EGP
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
