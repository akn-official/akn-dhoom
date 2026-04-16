import { createServerSupabase } from '@/lib/supabase/server';
import type { Insight } from '@/lib/supabase/types';

export const revalidate = 3600;

const SITE_URL = 'https://aspirekineticnetwork.in';
const SITE_TITLE = 'Aspire Kinetic Network — Insights';
const SITE_DESC = 'Honest thinking on digital growth for modern businesses.';

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let insights: Insight[] = [];
  try {
    const supabase = await createServerSupabase();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from('insights')
      .select('*')
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
      .order('created_at', { ascending: false })
      .limit(50);
    insights = data || [];
  } catch {
    // return empty feed
  }

  const lastBuild = insights[0]?.updated_at || new Date().toISOString();

  const items = insights
    .map((insight) => {
      const url = `${SITE_URL}/insights/${insight.slug}`;
      return `    <item>
      <title>${escapeXml(insight.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(insight.excerpt)}</description>
      <pubDate>${new Date(insight.created_at).toUTCString()}</pubDate>
      <author>noreply@aspirekineticnetwork.in (${escapeXml(insight.author)})</author>
      ${insight.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/insights</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
