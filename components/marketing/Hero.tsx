import Image from "next/image";
import { client } from "@/lib/sanity";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 30;

async function getData() {
  const query = `*[_type=='HeroImage'][0]{
    "imageUrl1":image1.asset->url,
    "imageUrl2":image2.asset->url
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    return null;
  }
}

export default async function Hero() {
  const data = await getData();

  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-muted">
      {data?.imageUrl1 && (
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src={data.imageUrl1}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center w-full h-full opacity-75 lg:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent lg:block hidden" />
        </div>
      )}
      
      <div className="container relative z-10 mx-auto px-6 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between mt-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-foreground tracking-tight leading-[1.1] mb-6 animate-in slide-in-from-bottom-8 duration-1000 fade-in fill-mode-both">
            Elevate Your <span className="text-primary italic block md:inline">Style.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground font-medium md:text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 animate-in slide-in-from-bottom-8 duration-1000 delay-200 fade-in fill-mode-both drop-shadow-sm lg:drop-shadow-none">
            Discover the most exclusive and high-quality curations designed for the modern lifestyle. Shop the new season's finest arrivals today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in slide-in-from-bottom-8 duration-1000 delay-300 fade-in fill-mode-both">
            <Link 
              href="/Products" 
              className="inline-flex h-14 items-center justify-center bg-primary text-primary-foreground px-10 rounded-full text-lg font-semibold hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 group"
            >
              Shop Collection 
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/Sale" 
              className="inline-flex h-14 items-center justify-center bg-background/90 backdrop-blur-md text-foreground border border-border px-10 rounded-full text-lg font-semibold hover:bg-muted transition-all shadow-lg hover:shadow-black/5 hover:-translate-y-1"
            >
              View Sale
            </Link>
          </div>
        </div>
        {data?.imageUrl2 && (
          <div className="hidden lg:block relative w-[400px] h-[550px] animate-in slide-in-from-right-10 duration-1000 delay-500 fade-in fill-mode-both">
            <Image
              src={data.imageUrl2}
              alt="Hero Fashion"
              fill
              className="object-cover rounded-3xl shadow-2xl border-4 border-background"
            />
          </div>
        )}
      </div>
    </section>
  );
}
