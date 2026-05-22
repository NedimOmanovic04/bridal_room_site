'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import DressCard from './DressCard';
import type { Dress, Category } from '@/lib/types';

function parseMinPrice(priceRange: string | null): number {
  if (!priceRange) return -1;
  const nums = priceRange.match(/\d+/g);
  return nums ? parseInt(nums[0]) : -1;
}

const PRICE_RANGES = [
  { value: 'all',       label: 'Sve cijene' },
  { value: 'under500',  label: 'Do 500 KM' },
  { value: '500to1000', label: '500 – 1.000 KM' },
  { value: '1000to2000',label: '1.000 – 2.000 KM' },
  { value: 'over2000',  label: '2.000+ KM' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'all',         label: 'Sve' },
  { value: 'available',   label: 'Dostupne' },
  { value: 'unavailable', label: 'Nedostupne' },
];

const SORT_OPTIONS = [
  { value: 'default',    label: 'Podrazumijevani' },
  { value: 'name_asc',   label: 'Naziv A–Z' },
  { value: 'price_asc',  label: 'Cijena ↑' },
  { value: 'price_desc', label: 'Cijena ↓' },
];

interface Props {
  dresses: Dress[];
  categories: Category[];
  showFilter?: boolean;
}

export default function DressGrid({ dresses, categories, showFilter = true }: Props) {
  const [category,     setCategory]     = useState('all');
  const [availability, setAvailability] = useState('all');
  const [priceRange,   setPriceRange]   = useState('all');
  const [sortBy,       setSortBy]       = useState('default');
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const filtered = useMemo(() => {
    let result = [...dresses];

    if (category !== 'all') {
      result = result.filter(d => d.category === category);
    }

    if (availability === 'available') {
      result = result.filter(d => d.available);
    } else if (availability === 'unavailable') {
      result = result.filter(d => !d.available);
    }

    if (priceRange !== 'all') {
      result = result.filter(d => {
        const min = parseMinPrice(d.price_range);
        if (min === -1) return false;
        switch (priceRange) {
          case 'under500':   return min < 500;
          case '500to1000':  return min >= 500  && min < 1000;
          case '1000to2000': return min >= 1000 && min < 2000;
          case 'over2000':   return min >= 2000;
          default:           return true;
        }
      });
    }

    if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => parseMinPrice(a.price_range) - parseMinPrice(b.price_range));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => parseMinPrice(b.price_range) - parseMinPrice(a.price_range));
    } else {
      result.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    return result;
  }, [dresses, category, availability, priceRange, sortBy]);

  function resetAll() {
    setCategory('all');
    setAvailability('all');
    setPriceRange('all');
    setSortBy('default');
  }

  const activeCount = [
    category !== 'all',
    availability !== 'all',
    priceRange !== 'all',
    sortBy !== 'default',
  ].filter(Boolean).length;

  const allCats: Category[] = [
    { id: 0, value: 'all', label: 'Sve', sort_order: 0 },
    ...categories,
  ];

  return (
    <div>
      {showFilter && (
        <div className="mb-14">
          {/* Mobile toggle */}
          <div className="md:hidden flex items-center justify-between mb-5">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className="flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase border border-gold-light px-5 py-3 text-muted hover:border-gold hover:text-gold transition-colors"
            >
              <SlidersHorizontal size={13} />
              Filteri
              {activeCount > 0 && (
                <span className="bg-gold text-ivory text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
            <span className="font-sans text-[11px] text-muted">{filtered.length} haljina</span>
          </div>

          {/* Filter panel — always visible on desktop, toggle on mobile */}
          <div className={filtersOpen ? 'block' : 'hidden md:block'}>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-7">
              {allCats.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`font-sans text-[10px] tracking-[0.18em] uppercase px-5 py-2.5 border transition-colors duration-200 ${
                    category === cat.value
                      ? 'border-gold bg-gold text-ivory'
                      : 'border-gold-light text-muted hover:border-gold hover:text-gold'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Second row: dropdowns */}
            <div className="flex flex-wrap gap-3 items-center justify-center border-t border-gold-light/50 pt-6">
              <FilterSelect
                label="Dostupnost"
                value={availability}
                onChange={setAvailability}
                options={AVAILABILITY_OPTIONS}
              />
              <FilterSelect
                label="Cijena"
                value={priceRange}
                onChange={setPriceRange}
                options={PRICE_RANGES}
              />
              <FilterSelect
                label="Sortiraj"
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
              />
              {activeCount > 0 && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-muted hover:text-red-500 transition-colors border border-transparent hover:border-red-200 px-4 py-2.5"
                >
                  <X size={11} />
                  Resetuj
                </button>
              )}
            </div>

            {/* Result count — desktop */}
            <p className="hidden md:block text-center font-sans text-[11px] text-muted mt-5">
              {filtered.length} {filtered.length === 1 ? 'haljina' : 'haljine/haljina'}
            </p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${category}-${availability}-${priceRange}-${sortBy}`}
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
            Nema haljina za odabrane filtere
          </p>
          <button
            onClick={resetAll}
            className="mt-6 font-sans text-[11px] tracking-[0.2em] uppercase text-gold hover:text-gold-dark transition-colors"
          >
            Resetuj filtere
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const isActive = value !== options[0].value;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none font-sans text-[11px] tracking-[0.15em] uppercase border px-5 py-2.5 pr-9 bg-white focus:outline-none cursor-pointer transition-colors ${
          isActive
            ? 'border-gold text-gold'
            : 'border-gold-light text-muted hover:border-gold hover:text-gold'
        }`}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={11}
        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isActive ? 'text-gold' : 'text-muted'}`}
      />
    </div>
  );
}
