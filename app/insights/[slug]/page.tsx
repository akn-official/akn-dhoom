import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { InsightArticle } from './article';
import type { Insight } from '@/lib/supabase/types';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let insight: Insight | null = null;

  try {
    const supabase = await createServerSupabase();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from('insights')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
      .single();
    insight = data;
  } catch {
    // fall through
  }

  if (!insight) return { title: 'Article Not Found | AKN' };

  return {
    title: `${insight.title} | AKN Insights`,
    description: insight.excerpt,
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
    },
  };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  let insight: Insight | null = null;
  let relatedInsights: Insight[] = [];

  try {
    const supabase = await createServerSupabase();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from('insights')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
      .single();
    insight = data;

    if (insight) {
      const { data: others } = await supabase
        .from('insights')
        .select('*')
        .eq('is_published', true)
        .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
        .neq('slug', slug)
        .order('created_at', { ascending: false });

      if (others && others.length > 0) {
        // Score by shared tags, fallback to recency
        const scored = others.map((o) => ({
          ...o,
          score: o.tags.filter((t: string) => insight!.tags.includes(t)).length,
        }));
        scored.sort((a, b) => b.score - a.score || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        relatedInsights = scored.slice(0, 3);
      }
    }
  } catch {
    // fall through
  }

  if (!insight) notFound();

  const siteUrl = 'https://aspirekineticnetwork.in';
  const articleUrl = `${siteUrl}/insights/${insight.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${articleUrl}#article`,
        headline: insight.title,
        description: insight.excerpt,
        image: insight.cover_image_url || `${siteUrl}/opengraph-image`,
        datePublished: insight.created_at,
        dateModified: insight.updated_at,
        author: { '@type': 'Person', name: insight.author },
        publisher: {
          '@type': 'Organization',
          name: 'Aspire Kinetic Network',
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
        keywords: insight.tags.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Insights', item: `${siteUrl}/insights` },
          { '@type': 'ListItem', position: 3, name: insight.title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsightArticle insight={insight} relatedInsights={relatedInsights} />
    </>
  );
}
