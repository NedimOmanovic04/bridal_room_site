'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageCircle, Music, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CONTACT } from '@/lib/constants';
import { CATEGORIES } from '@/lib/types';
import type { Dress } from '@/lib/types';

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

export default function HaljinaDetail({ dress }: { dress: Dress }) {
  const allImages = [
    dress.cover_image,
    ...dress.image_urls.filter(u => u !== dress.cover_image),
  ];
  const [active, setActive] = useState(allImages[0]);

  const label = CATEGORIES.find(c => c.value === dress.category)?.label ?? dress.category;

  const contactRow = (
    href: string,
    icon: React.ReactNode,
    text: string,
    external?: boolean,
    primary?: boolean,
  ) => (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`flex items-center gap-4 w-full py-4 px-6 transition-all duration-300 group ${
        primary
          ? 'bg-gold text-white hover:bg-gold-dark'
          : 'border border-gold-light hover:border-gold hover:bg-cream-dark'
      }`}
    >
      <span className={primary ? 'text-white' : 'text-gold'}>{icon}</span>
      <span
        className={`font-sans text-[10px] tracking-[0.2em] uppercase ${
          primary ? 'text-white' : 'text-muted group-hover:text-gold transition-colors'
        }`}
      >
        {text}
      </span>
    </a>
  );

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <Link
          href="/kolekcija"
          className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] text-muted hover:text-gold transition-colors uppercase mb-12"
        >
          <ArrowLeft size={13} />
          Nazad na kolekciju
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* ── Images column ── */}
          <div>
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative aspect-[3/4] overflow-hidden bg-cream-dark"
            >
              <Image
                src={active}
                alt={dress.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(img)}
                    className={`relative w-20 aspect-square overflow-hidden border-2 transition-colors duration-200 ${
                      active === img
                        ? 'border-gold'
                        : 'border-transparent hover:border-gold-light'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${dress.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info column ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:sticky lg:top-32"
          >
            <p className="font-sans text-[10px] tracking-[0.4em] text-gold uppercase mb-3">
              {label}
            </p>
            <h1 className="font-serif text-5xl text-brown font-light">{dress.name}</h1>
            <div className="w-12 h-px bg-gold my-7" />

            {dress.description && (
              <p className="font-sans text-[15px] text-muted font-light leading-relaxed mb-8">
                {dress.description}
              </p>
            )}

            {dress.price_range && (
              <p className="font-serif text-2xl text-gold-dark italic mb-6">
                {dress.price_range}
              </p>
            )}

            <div className="flex items-center gap-2 mb-9">
              <CheckCircle2 size={15} className="text-green-600" />
              <span className="font-sans text-[13px] text-muted">
                {dress.available ? 'Dostupno za probanje' : 'Trenutno nedostupno'}
              </span>
            </div>

            {/* Contact actions */}
            <div className="border-t border-gold-light pt-8 space-y-3">
              <p className="font-sans text-[10px] tracking-[0.2em] text-muted uppercase mb-4">
                Rezerviši probanje
              </p>

              {contactRow(
                CONTACT.whatsapp,
                <MessageCircle size={17} />,
                'WhatsApp',
                true,
              )}
              {contactRow(
                `tel:${CONTACT.phoneRaw}`,
                <Phone size={17} />,
                'Pozovi',
              )}
              {contactRow(
                CONTACT.viber,
                <MessageCircle size={17} />,
                'Viber',
              )}
              {contactRow(
                CONTACT.tiktok,
                <TikTokIcon size={17} />,
                'TikTok DM',
                true,
                true,
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
