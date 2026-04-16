import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2A8B9D 0%, #C87A4F 100%)',
          color: 'white',
          fontSize: 128,
          fontWeight: 900,
          letterSpacing: -6,
          borderRadius: 40,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
