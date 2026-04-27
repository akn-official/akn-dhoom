import type { Metadata } from 'next';
import { TrakFitnessPage } from './trak-page';

export const metadata: Metadata = {
  title: 'Trak Fitness · Sample Design | AKN',
  description: 'A coaching-first gym concept — sample microsite by AKN.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TrakFitnessPage />;
}
