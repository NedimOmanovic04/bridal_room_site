'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import DressCard from './DressCard';
import type { Dress } from '@/lib/types';

export default function FeaturedSection({ dresses }: { dresses: Dress[] }) {
  return (
    <section className="py-28 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-18"
        >
          <p className="font-sans text-[10px] tracking-[0.42em] text-gold uppercase mb-5">
            Naša selekcija
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-brown font-light italic">
            Naše Favoriti
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-7" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {dresses.map((dress, i) => (
            <DressCard key={dress.id} dress={dress} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link
            href="/kolekcija"
            className="font-sans text-[10px] tracking-[0.28em] uppercase px-12 py-4 border border-gold text-gold hover:bg-gold hover:text-ivory transition-all duration-300 inline-block"
          >
            Pogledaj cijelu kolekciju
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
