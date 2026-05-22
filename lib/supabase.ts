import { createClient } from '@supabase/supabase-js';
import type { Dress, Category } from './types';
import { PLACEHOLDER_DRESSES } from './constants';

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, value: 'ball_gown',  label: 'Ball Gown',  sort_order: 1 },
  { id: 2, value: 'a_line',     label: 'A-Linija',   sort_order: 2 },
  { id: 3, value: 'mermaid',    label: 'Sirena',      sort_order: 3 },
  { id: 4, value: 'princess',   label: 'Princeza',   sort_order: 4 },
  { id: 5, value: 'bohemian',   label: 'Boho',        sort_order: 5 },
  { id: 6, value: 'minimalist', label: 'Minimalist',  sort_order: 6 },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function getFeaturedDresses(): Promise<Dress[]> {
  if (!supabase) return PLACEHOLDER_DRESSES.filter(d => d.featured) as Dress[];

  const { data } = await supabase
    .from('dresses')
    .select('*')
    .eq('available', true)
    .order('sort_order')
    .limit(9);

  return (data as Dress[]) ?? (PLACEHOLDER_DRESSES as Dress[]);
}

export async function getAllDresses(category?: string): Promise<Dress[]> {
  if (!supabase) {
    const all = PLACEHOLDER_DRESSES as Dress[];
    return category && category !== 'all'
      ? all.filter(d => d.category === category)
      : all;
  }

  let query = supabase
    .from('dresses')
    .select('*')
    .eq('available', true)
    .order('sort_order');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return (data as Dress[]) ?? (PLACEHOLDER_DRESSES as Dress[]);
}

export async function getDressById(id: string): Promise<Dress | null> {
  if (!supabase) {
    return (PLACEHOLDER_DRESSES as Dress[]).find(d => d.id === id) ?? null;
  }

  const { data } = await supabase
    .from('dresses')
    .select('*')
    .eq('id', id)
    .single();

  return data as Dress | null;
}

export async function getCategories(): Promise<Category[]> {
  if (!supabase) return FALLBACK_CATEGORIES;
  const { data } = await supabase.from('categories').select('*').order('sort_order');
  return (data as Category[])?.length ? (data as Category[]) : FALLBACK_CATEGORIES;
}

export async function submitInquiry(payload: {
  name: string;
  phone?: string;
  message?: string;
}): Promise<{ ok: boolean }> {
  if (!supabase) return { ok: true };

  const { error } = await supabase.from('inquiries').insert(payload);
  return { ok: !error };
}
