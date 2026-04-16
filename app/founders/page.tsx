import type { Metadata } from 'next';
import { FoundersPageContent } from './content';

export const metadata: Metadata = {
  title: 'Our Founders | Aspire Kinetic Network',
  description: 'Two Founders. One Obsession. Your Growth. Meet the minds behind AKN — a global digital growth studio.',
  openGraph: {
    title: 'Our Founders | Aspire Kinetic Network',
    description: 'Two Founders. One Obsession. Your Growth. Meet the minds behind AKN.',
  },
};

export default function FoundersPage() {
  return <FoundersPageContent />;
}
