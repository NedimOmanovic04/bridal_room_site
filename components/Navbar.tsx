'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLink =
    'font-sans text-[13px] font-medium tracking-[0.18em] uppercase transition-colors duration-300';

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.25em] text-brown font-normal uppercase"
        >
          The Bridal Room
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/kolekcija" className={`${navLink} text-muted hover:text-gold`}>
            Kolekcija
          </Link>
          <Link href="/#o-nama" className={`${navLink} text-muted hover:text-gold`}>
            O nama
          </Link>
          <Link href="/#kontakt" className={`${navLink} text-muted hover:text-gold`}>
            Kontakt
          </Link>
          <Link
            href="/#kontakt"
            className="font-sans text-[12px] font-medium tracking-[0.2em] uppercase px-7 py-3 border border-gold text-gold hover:bg-gold hover:text-ivory transition-all duration-300"
          >
            ♡ Rezerviši
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-brown p-2 -mr-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Otvori meni"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-ivory/98 backdrop-blur-md border-t border-gold-light`}
      >
        <div className="flex flex-col items-center gap-7 py-10">
          {(['Kolekcija', 'O nama', 'Kontakt'] as const).map(label => (
            <Link
              key={label}
              href={label === 'Kolekcija' ? '/kolekcija' : `/#${label.toLowerCase().replace(' ', '-')}`}
              className={`${navLink} text-muted hover:text-gold`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#kontakt"
            className="font-sans text-[10px] tracking-[0.25em] uppercase px-10 py-3 border border-gold text-gold hover:bg-gold hover:text-ivory transition-all duration-300 mt-1"
            onClick={() => setMenuOpen(false)}
          >
            ♡ Rezerviši
          </Link>
        </div>
      </div>
    </nav>
  );
}
