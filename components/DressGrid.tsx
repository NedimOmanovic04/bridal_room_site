'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DressCard from './DressCard';
import CategoryFilter from './CategoryFilter';
import type { Dress } from '@/lib/types';

interface Props {
  dresses: Dress[];
  showFilter?: boolean;
}

export default function DressGrid({ dresses, showFilter = true }: Props) {
  const [active, setActive] = useState('all');

  const filtered = useMemo(
    () => (active === 'all' ? dresses : dresses.filter(d => d.category === active)),
    [dresses, active],
  );

  return (
    <div>
      {showFilter && (
        <div className="mb-14">
          <CategoryFilter active={active} onChange={setActive} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {filtered.map((dress, i) => (
            <DressCard key={dress.id} dress={dress} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-muted italic">
            Nema haljina u ovoj kategoriji
          </p>
        </div>
      )}
    </div>
  );
}
