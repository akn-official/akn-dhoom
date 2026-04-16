import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Aspire Kinetic Network — Global Digital Growth Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0A0F1C 0%, #111827 50%, #0A0F1C 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo text */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            letterSpacing: '-2px',
            marginBottom: '20px',
            background: 'linear-gradient(90deg, #2A8B9D, #C87A4F)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          AKN
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          A Global Digital Growth Studio
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '20px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          Web Design &bull; Local SEO &bull; Social Media &bull; Growth Consulting
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: '40px',
            fontSize: '16px',
            color: '#2A8B9D',
            fontWeight: 600,
            letterSpacing: '1px',
          }}
        >
          aspirekineticnetwork.in
        </div>

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
