import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Bridal Room | Vjenčanice Visoko",
    template: "%s | The Bridal Room",
  },
  description:
    "Ekskluzivna kolekcija vjenčanica u Visokom. Pronađi haljinu svojih snova u The Bridal Room, TC Vizija.",
  keywords: [
    "vjenčanice",
    "bridal",
    "visoko",
    "haljine",
    "nevjesta",
    "the bridal room",
    "vjenčanica visoko",
  ],
  openGraph: {
    title: "The Bridal Room",
    description: "Vjenčanice iz snova — Visoko, TC Vizija",
    type: "website",
    locale: "bs_BA",
    siteName: "The Bridal Room",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bs"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body className="font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
