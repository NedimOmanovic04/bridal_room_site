'use client';

import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/types';

interface Props {
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`relative overflow-hidden font-sans text-[10px] tracking-[0.2em] uppercase px-6 py-3 border transition-colors duration-300 ${
            active === cat.value
              ? 'border-gold text-ivory'
              : 'border-gold-light text-muted hover:border-gold hover:text-gold'
          }`}
        >
          {active === cat.value && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 bg-gold -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          {cat.label}
        </button>
      ))}
    </div>
  );
}
