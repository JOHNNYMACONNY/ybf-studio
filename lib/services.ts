import { supabase } from './supabase';

export interface ActiveService {
  id: string;
  name: string;
  short_description: string;
  price: number;
  original_price?: number | null;
  turnaround_time?: string | null;
}

export interface ActiveFaqItem {
  question: string;
  answer: string;
}

export async function getActiveServices(): Promise<ActiveService[]> {
  const { data, error } = await supabase
    .from('active_services')
    .select('*');

  if (error) {
    console.error('getActiveServices error:', error);
    return [];
  }
  return data as ActiveService[];
}

export async function getActiveFaqs(): Promise<ActiveFaqItem[]> {
  const { data, error } = await supabase
    .from('active_faqs')
    .select('question, answer');

  if (error) {
    console.error('getActiveFaqs error:', error);
    return [];
  }
  return data as ActiveFaqItem[];
}


