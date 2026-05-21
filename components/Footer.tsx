import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

function TikTokIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Brand */}
        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.25em] text-ivory font-light uppercase"
        >
          The Bridal Room
        </Link>

        <div className="w-14 h-px bg-gold" />

        {/* Address & phone */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <MapPin size={13} className="text-gold" />
            <a
              href={CONTACT.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[12px] text-ivory/55 hover:text-gold-light transition-colors tracking-wide"
            >
              {CONTACT.address}
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone size={13} className="text-gold" />
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="font-sans text-[12px] text-ivory/55 hover:text-gold-light transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
        </div>

        {/* TikTok */}
        <a
          href={CONTACT.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-ivory/55 hover:text-gold-light transition-colors"
          aria-label="TikTok profil @the.bridal.room.v"
        >
          <TikTokIcon />
          <span className="font-sans text-[11px] tracking-widest">@the.bridal.room.v</span>
        </a>

        {/* Nav links */}
        <div className="flex gap-7 flex-wrap justify-center">
          {[
            { label: 'Kolekcija', href: '/kolekcija' },
            { label: 'O nama',    href: '/#o-nama'   },
            { label: 'Kontakt',   href: '/#kontakt'  },
          ].map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="font-sans text-[10px] tracking-[0.2em] uppercase text-ivory/40 hover:text-gold-light transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="w-full max-w-xs h-px bg-white/8 mt-2" />

        <p className="font-sans text-[11px] text-ivory/30 tracking-wide">
          © 2025 The Bridal Room. Sva prava pridržana.
        </p>
      </div>
    </footer>
  );
}
