import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | AKN',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      {children}
    </div>
  );
}
