'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E";

export default function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col overflow-hidden">
      {/* Ken Burns background */}
      <div
        className="absolute inset-0 animate-ken-burns"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=90')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Multi-stop dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url("${GRAIN}")`, opacity: 0.04 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6 py-20">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.45em' }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          className="font-sans text-[10px] text-gold-light uppercase block mb-7"
        >
          Visoko · TC Vizija
        </motion.span>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-light tracking-[0.12em] uppercase leading-none"
        >
          The Bridal Room
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1.1, ease: 'easeOut' }}
          className="w-28 h-px bg-gold my-7 origin-center"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.3, ease: 'easeOut' }}
          className="font-serif text-xl sm:text-2xl md:text-3xl text-white/90 font-light italic mb-12 max-w-md"
        >
          Pronađi haljinu svojih snova
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/kolekcija"
            className="btn-shimmer font-sans text-[10px] tracking-[0.3em] uppercase px-10 py-4 text-white"
          >
            Pogledaj kolekciju
          </Link>
          <Link
            href="/#kontakt"
            className="font-sans text-[10px] tracking-[0.3em] uppercase px-10 py-4 border border-white/60 text-white hover:bg-white/10 transition-colors duration-300"
          >
            Rezerviši probanje
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
