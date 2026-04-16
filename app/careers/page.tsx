import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import { CareersPageContent } from './content';
import { ComingSoonPage } from '@/components/coming-soon-page';
import type { Career } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Careers | Aspire Kinetic Network',
  description: 'Join the team building a global digital growth studio. Explore open positions at AKN.',
  openGraph: {
    title: 'Careers | Aspire Kinetic Network',
    description: 'Explore career opportunities at Aspire Kinetic Network.',
  },
};

export const revalidate = 60;

export default async function CareersPage() {
  let careers: Career[] = [];
  let hiringEnabled = false;

  try {
    const supabase = await createServerSupabase();
    const [careersRes, settingRes] = await Promise.all([
      supabase
        .from('careers')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hiring_enabled')
        .maybeSingle(),
    ]);
    careers = careersRes.data || [];
    hiringEnabled = settingRes.data?.value === 'true';
  } catch {
    // Supabase not configured yet
  }

  if (!hiringEnabled || careers.length === 0) {
    return (
      <ComingSoonPage
        label="Careers"
        heading="Join The"
        headingAccent="Movement."
        description="We're a young studio with big ambitions. No open positions right now — but if you're obsessed with growth, we want to hear from you. Drop us a line."
        accentColor="copper"
      />
    );
  }

  return <CareersPageContent careers={careers} />;
}
