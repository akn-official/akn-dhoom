import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import { InsightsPageContent } from './content';
import { ComingSoonPage } from '@/components/coming-soon-page';
import type { Insight } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Insights | Aspire Kinetic Network',
  description: 'Honest thinking on what actually works for businesses trying to grow online. No recycled listicles. No generic tips.',
  openGraph: {
    title: 'Insights | Aspire Kinetic Network',
    description: 'Straight talk on digital growth for modern businesses.',
  },
};

export const revalidate = 60;

export default async function InsightsPage() {
  let insights: Insight[] = [];

  try {
    const supabase = await createServerSupabase();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from('insights')
      .select('*')
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
      .order('created_at', { ascending: false });
    insights = data || [];
  } catch {
    // Supabase not configured yet
  }

  if (insights.length === 0) {
    return (
      <ComingSoonPage
        label="Insights"
        heading="Straight Talk."
        headingAccent="Coming Soon."
        description="No recycled listicles. No generic tips. Just honest thinking on what actually works for local businesses trying to grow online. Our first articles are in the works."
        accentColor="copper"
      />
    );
  }

  return <InsightsPageContent insights={insights} />;
}
