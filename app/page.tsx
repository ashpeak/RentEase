import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HowItWorks } from "@/components/how-it-works"
import { Categories } from "@/components/categories"
import { Testimonials } from "@/components/testimonials"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  )
}
