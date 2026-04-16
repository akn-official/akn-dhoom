import type { MetadataRoute } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aspirekineticnetwork.in';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/founders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Dynamic routes from Supabase
  let insightRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createServerSupabase();

    const nowIso = new Date().toISOString();
    const { data: insights } = await supabase
      .from('insights')
      .select('slug, updated_at')
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`);

    if (insights) {
      insightRoutes = insights.map((insight) => ({
        url: `${baseUrl}/insights/${insight.slug}`,
        lastModified: new Date(insight.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Supabase not configured — return static routes only
  }

  return [...staticRoutes, ...insightRoutes];
}
