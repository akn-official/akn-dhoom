import type { Metadata } from 'next';
import { NewsletterPageContent } from './content';

export const metadata: Metadata = {
  title: 'Newsletter | Aspire Kinetic Network',
  description: 'Get honest insights on digital growth, delivered straight to your inbox. No spam, just value.',
  openGraph: {
    title: 'Newsletter | Aspire Kinetic Network',
    description: 'Digital growth insights for modern businesses, straight to your inbox.',
  },
};

export default function NewsletterPage() {
  return <NewsletterPageContent />;
}
