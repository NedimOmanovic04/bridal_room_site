import { getFeaturedDresses } from "@/lib/supabase";
import Hero from "@/components/Hero";
import FeaturedSection from "@/components/FeaturedSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default async function HomePage() {
  const featured = await getFeaturedDresses();

  return (
    <main>
      <Hero />
      <FeaturedSection dresses={featured} />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
