'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Dress } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';

interface Props {
  dress: Dress;
  index?: number;
}

export default function DressCard({ dress, index = 0 }: Props) {
  const label = CATEGORIES.find(c => c.value === dress.category)?.label ?? dress.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: 'easeOut' }}
      className="group"
    >
      <Link href={`/haljina/${dress.id}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dress.cover_image}
            alt={dress.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />

          {/* Bottom gradient reveal */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out" />

          {/* Gold border inset */}
          <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-80 transition-opacity duration-400 pointer-events-none" />

          {/* Sliding name overlay */}
          <div className="absolute bottom-0 inset-x-0 px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
            <p className="font-serif text-xl text-white font-light italic">{dress.name}</p>
          </div>
        </div>

        {/* Card text */}
        <div className="pt-4 pb-2 px-1">
          <h3 className="font-serif text-xl text-brown font-light tracking-wide">{dress.name}</h3>
          <p className="font-sans text-[10px] text-muted tracking-[0.2em] uppercase mt-1">{label}</p>
          {dress.price_range && (
            <p className="font-sans text-[15px] text-gold font-medium mt-2">
              {/km/i.test(dress.price_range) ? dress.price_range : `${dress.price_range} KM`}
            </p>
          )}
          <p className={`font-sans text-[12px] tracking-[0.1em] font-medium mt-1.5 ${dress.available ? 'text-green-700' : 'text-red-500'}`}>
            {dress.available ? '● Dostupna' : '● Nedostupna'}
          </p>
          <div className="flex items-center gap-2 mt-3 text-gold group-hover:text-gold-dark transition-colors duration-300">
            <span className="font-sans text-[10px] tracking-[0.18em] uppercase">Pogledaj detalje</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
