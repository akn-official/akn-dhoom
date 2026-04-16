import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import { WorkPageContent } from './content';
import { ComingSoonPage } from '@/components/coming-soon-page';
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
    // Supabase not configured yet — fall through to coming-soon
  }

  if (works.length === 0) {
    return (
      <ComingSoonPage
        label="Portfolio"
        heading="Our Work."
        headingAccent="Coming Into Focus."
        description="We launched in April 2025. Our first projects are underway. This page will be home to real results, real clients, and real before-and-afters — updated as we deliver."
        accentColor="teal"
      />
    );
  }

  return <WorkPageContent works={works} />;
}
