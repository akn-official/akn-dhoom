import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function Icon() {
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
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: -1,
          borderRadius: 8,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
