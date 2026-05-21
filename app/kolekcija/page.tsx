import type { Metadata } from "next";
import { getAllDresses } from "@/lib/supabase";
import DressGrid from "@/components/DressGrid";

export const metadata: Metadata = {
  title: "Kolekcija",
  description:
    "Pregledaj cijelu kolekciju vjenčanica — ball gown, A-linija, sirena, princeza, boho i minimalist. The Bridal Room, Visoko.",
};

export default async function KolekcijaPage() {
  const dresses = await getAllDresses();

  return (
    <main className="min-h-screen bg-cream pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Page header */}
        <div className="text-center mb-18">
          <p className="font-sans text-[10px] tracking-[0.42em] text-gold uppercase mb-5">
            The Bridal Room
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-brown font-light italic">
            Kolekcija
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mt-7" />
          <p className="font-sans text-[14px] text-muted mt-6 max-w-lg mx-auto leading-relaxed">
            Odaberite kategoriju i pronađite haljinu koja priča vašu priču.
          </p>
        </div>

        <DressGrid dresses={dresses} showFilter />
      </div>
    </main>
  );
}
