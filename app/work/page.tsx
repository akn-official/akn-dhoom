import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import { WorkPageContent } from './content';
import type { Work } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Our Work | Aspire Kinetic Network',
  description: 'Real results, real clients, real before-and-afters. Our portfolio is being built with our first batch of early clients worldwide.',
  openGraph: {
    title: 'Our Work | Aspire Kinetic Network',
    description: 'Portfolio of digital growth work for businesses worldwide.',
  },
};

export const revalidate = 60; // ISR — refresh every 60 seconds

export default async function WorkPage() {
  let works: Work[] = [];

  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from('works')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    works = data || [];
  } catch {
    // Supabase not configured yet — render with empty works; component handles it.
  }

  return <WorkPageContent works={works} />;
}
