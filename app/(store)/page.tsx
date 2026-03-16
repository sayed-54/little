import Hero from "@/components/marketing/Hero"
import Newest from "@/components/marketing/Newest";
import FeaturedCategories from "@/components/marketing/FeaturedCategories";
import Testimonials from "@/components/marketing/Testimonials";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <FeaturedCategories />
      <Newest />
      <Testimonials />
    </div>
  );
}
