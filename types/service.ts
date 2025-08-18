export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  features: string[];
  turnaround_time: string | null;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  featured_image: string | null;
  before_audio_url: string | null;
  after_audio_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Ensure this file is treated as a module in isolatedModules/Babel transpilation
export {};