import { ImageResponse } from 'next/og';
import { createServerSupabase } from '@/lib/supabase/server';

export const runtime = 'edge';
export const alt = 'AKN Insights';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let title = 'AKN Insights';
  let tags: string[] = [];

  try {
    const supabase = await createServerSupabase();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from('insights')
      .select('title, tags')
      .eq('slug', slug)
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
      .single();
    if (data) {
      title = data.title;
      tags = data.tags || [];
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0A0F1C 0%, #111827 50%, #0A0F1C 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2A8B9D', letterSpacing: '2px' }}>
            AKN INSIGHTS
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '18px', color: '#71717a' }}>
            aspirekineticnetwork.in
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? '42px' : '52px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '30px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#C87A4F',
                  border: '1.5px solid rgba(200, 122, 79, 0.4)',
                  background: 'rgba(200, 122, 79, 0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2A8B9D, #C87A4F, #2A8B9D)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
