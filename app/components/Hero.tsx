export const revalidate = 30;
import Image from "next/image";
import { client } from "../lib/sanity";
import Link from "next/link";

async function getData() {
  const query = `*[_type=='HeroImage'][0]{
    "imageUrl1":image1.asset->url,
    "imageUrl2":image2.asset->url
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function Hero() {
  const data = await getData();

  if (!data) {
    return (
      <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-[1440px] lg:px-8 mt-[128px]">
        <div className="mb-8 flex flex-wrap justify-between md:mb-16 ">
          <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt48">
            <h1 className="mb-4 text-4xl font-bold text-black sm:text5xl md:mb-8 md:text-6xl">
              Top Fashion for a top price!
            </h1>
            <p className="max-w-md leading-relaxed text-gray-700 xl:text-lg">
              We see only the most exclusive and high quality products for you.
              We are the best so come and shop with us
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-[1440px] lg:px-8 mt-[128px]">
      <div className="mb-8 flex flex-wrap justify-between md:mb-16 ">
        {/* hero images titles */}
        <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt48">
          <h1 className="mb-4 text-4xl font-bold text-black sm:text5xl md:mb-8 md:text-6xl">
            Top Fashion for a top price!
          </h1>
          <p className="max-w-md leading-relaxed text-gray-700 xl:text-lg ">
            We see only the most exclusive and high quality products for you. We
            are the best so come and shop with us
          </p>
        </div>
        {/* hero image container */}
        <div className=" mb-12 flex w-full md:mb-16 lg:w-2/3">
          {data.imageUrl1 && (
            <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0 ">
              <Image
                alt="heroPic"
                src={data.imageUrl1}
                className=" h-full w-full object-cover object-center "
                width={500}
                height={500}
                priority
              />
            </div>
          )}
          {data.imageUrl2 && (
            <div className=" overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0 ">
              <Image
                alt="heroPic"
                src={data.imageUrl2}
                className=" h-full w-full object-cover object-center "
                width={500}
                height={500}
                priority
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
        <div className="flex h-12 w-64 divide-x  overflow-hidden rounded-lg border mx-12">
          <Link
            href="/Products"
            className="flex w-1/2 items-center justify-center text-xl font-semibold text-gray-900 transition duration-100 bg-gray-300 hover:bg-gray-400 active:bg-gray-400"
          >
            Products
          </Link>
          <Link
            href="/Sale"
            className="flex w-1/2 items-center justify-center text-xl font-semibold text-gray-900 transition duration-100 bg-gray-300 hover:bg-gray-400 active:bg-gray-400"
          >
            Sale
          </Link>
        </div>
      </div>
    </section>
  );
}
