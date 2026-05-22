export interface Category {
  id: number;
  value: string;
  label: string;
  sort_order: number;
}

export interface Dress {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price_range: string | null;
  featured: boolean;
  available: boolean;
  image_urls: string[];
  cover_image: string;
  sort_order: number;
  created_at: string;
}

export interface Inquiry {
  name: string;
  phone?: string;
  message?: string;
}

export const CATEGORIES = [
  { value: 'all',        label: 'Sve'        },
  { value: 'ball_gown',  label: 'Ball Gown'  },
  { value: 'a_line',     label: 'A-Linija'   },
  { value: 'mermaid',    label: 'Sirena'      },
  { value: 'princess',   label: 'Princeza'   },
  { value: 'bohemian',   label: 'Boho'        },
  { value: 'minimalist', label: 'Minimalist'  },
] as const;

export type CategoryValue = typeof CATEGORIES[number]['value'];
