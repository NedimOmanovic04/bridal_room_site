'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Music } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactSection() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-gold-light focus:border-gold outline-none py-3 font-sans text-[14px] text-primary placeholder:text-muted/50 transition-colors duration-300';
  const labelClass =
    'font-sans text-[10px] tracking-[0.2em] text-muted uppercase block mb-2';

  return (
    <section id="kontakt" className="py-28 px-6 lg:px-12 bg-ivory">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <p className="font-sans text-[10px] tracking-[0.42em] text-gold uppercase mb-5">
            Stupite u kontakt
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-brown font-light italic">
            Rezerviši Probanje
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-7" />
          <p className="font-sans text-[14px] text-muted mt-6 leading-relaxed max-w-md mx-auto">
            Rezervacije se vrše putem DM na TikToku ili telefonski. Možete nam
            i ostaviti poruku ispod.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          onSubmit={handleSubmit}
          className="space-y-7 mb-14"
        >
          <div>
            <label className={labelClass}>
              Ime i prezime <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className={inputClass}
              placeholder="Vaše ime i prezime"
              autoComplete="name"
            />
          </div>

          <div>
            <label className={labelClass}>
              Email adresa <span className="text-gold">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className={inputClass}
              placeholder="vasa@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className={labelClass}>
              Poruka <span className="text-gold">*</span>
            </label>
            <textarea
              required
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Opišite šta tražite, datum vjenčanja, veličinu..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full btn-shimmer font-sans text-[10px] tracking-[0.28em] uppercase py-4 text-white disabled:opacity-60 transition-opacity"
            >
              {status === 'loading' ? 'Slanje...' : status === 'success' ? '✓ Poslano' : 'Pošalji Upit'}
            </button>
          </div>

          {status === 'success' && (
            <p className="text-center font-sans text-sm text-green-700">
              Hvala! Vaša poruka je uspješno poslana. Odgovorit ćemo na vaš email uskoro.
            </p>
          )}
          {status === 'error' && (
            <p className="text-center font-sans text-sm text-red-600">
              Greška pri slanju. Kontaktirajte nas direktno putem telefona ili TikToka.
            </p>
          )}
        </motion.form>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-9">
          <div className="flex-1 h-px bg-gold-light" />
          <span className="font-sans text-[9px] tracking-[0.22em] text-muted uppercase whitespace-nowrap">
            ili kontaktirajte direktno
          </span>
          <div className="flex-1 h-px bg-gold-light" />
        </div>

        {/* Direct contact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: CONTACT.whatsapp, icon: <MessageCircle size={17} className="text-gold" />, label: 'WhatsApp / Viber', external: true },
            { href: `tel:${CONTACT.phoneRaw}`, icon: <Phone size={17} className="text-gold" />, label: 'Pozovi', external: false },
            { href: CONTACT.tiktok, icon: <Music size={17} className="text-gold" />, label: 'TikTok DM', external: true },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="flex items-center justify-center gap-3 py-4 border border-gold-light hover:border-gold hover:bg-cream transition-all duration-300 group"
            >
              {item.icon}
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-muted group-hover:text-gold transition-colors">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
