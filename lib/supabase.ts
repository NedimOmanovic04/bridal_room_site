import { createClient } from '@supabase/supabase-js';
import type { Dress } from './types';
import { PLACEHOLDER_DRESSES } from './constants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function getFeaturedDresses(): Promise<Dress[]> {
  if (!supabase) return PLACEHOLDER_DRESSES.filter(d => d.featured) as Dress[];

  const { data } = await supabase
    .from('dresses')
    .select('*')
    .eq('featured', true)
    .eq('available', true)
    .order('sort_order');

  return (data as Dress[]) ?? (PLACEHOLDER_DRESSES.filter(d => d.featured) as Dress[]);
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

export async function submitInquiry(payload: {
  name: string;
  phone?: string;
  message?: string;
}): Promise<{ ok: boolean }> {
  if (!supabase) return { ok: true };

  const { error } = await supabase.from('inquiries').insert(payload);
  return { ok: !error };
}
