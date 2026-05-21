'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export default function AboutSection() {
  return (
    <section id="o-nama" className="py-28 bg-cream-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="relative"
          >
            {/* Offset gold frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/30 pointer-events-none" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80"
                alt="The Bridal Room salon"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.15, ease: 'easeOut' }}
          >
            <p className="font-sans text-[10px] tracking-[0.42em] text-gold uppercase mb-5">
              Naša priča
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-brown font-light leading-tight mb-6">
              Više od <em>haljine</em>
            </h2>
            <div className="w-14 h-px bg-gold mb-9" />

            <div className="space-y-4 font-sans text-[15px] text-muted font-light leading-relaxed">
              <p>
                The Bridal Room je salon vjenčanica smješten u srcu Visokog, gdje svaka
                nevjesta može pronaći haljinu koja odražava njenu jedinstvenu priču.
              </p>
              <p>
                Naša pažljivo odabrana kolekcija obuhvata stilove od klasičnih do
                modernih — ball gown, sirena, boho, minimalistički — sve za ženu
                koja zna što želi.
              </p>
              <p>
                Svako probanje je privatno i personalizirano. Rezervacije su dostupne
                putem TikTok DM-a ili telefonski.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-gold mt-0.5 shrink-0" />
                <a
                  href={CONTACT.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[13px] text-primary hover:text-gold transition-colors"
                >
                  {CONTACT.address}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-gold shrink-0" />
                <span className="font-sans text-[13px] text-primary">
                  {CONTACT.workingHours}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
