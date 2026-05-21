import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDresses, getDressById } from "@/lib/supabase";
import HaljinaDetail from "@/components/HaljinaDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const dresses = await getAllDresses();
  return dresses.map(d => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dress = await getDressById(id);
  if (!dress) return {};
  return {
    title: dress.name,
    description:
      dress.description ??
      `${dress.name} — ekskluzivna vjenčanica iz kolekcije The Bridal Room, Visoko.`,
    openGraph: {
      title: `${dress.name} | The Bridal Room`,
      description:
        dress.description ??
        `${dress.name} — ekskluzivna vjenčanica iz kolekcije The Bridal Room.`,
      images: dress.cover_image ? [{ url: dress.cover_image }] : [],
    },
  };
}

export default async function HaljinaPage({ params }: Props) {
  const { id } = await params;
  const dress = await getDressById(id);
  if (!dress) notFound();

  return <HaljinaDetail dress={dress} />;
}
