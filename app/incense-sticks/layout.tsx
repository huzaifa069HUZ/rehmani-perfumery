import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Incense Sticks — Premium Aggarbatti | Rahmani Perfumery',
  description: 'Discover our collection of premium, long-lasting incense sticks. Perfect for meditation, prayer, or bringing a serene, fragrant ambiance to your home.',
  keywords: ['incense sticks', 'aggarbatti', 'premium agarbatti', 'natural incense', 'meditation fragrance', 'prayer sticks', 'home fragrance'],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/incense-sticks',
  },
  openGraph: {
    title: 'Incense Sticks — Premium Aggarbatti',
    description: 'Discover our collection of premium, long-lasting incense sticks. Perfect for meditation, prayer, or bringing a serene ambiance.',
    url: 'https://rahmaniperfumery.com/incense-sticks',
  },
};

export default function IncenseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
