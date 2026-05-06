import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Incense Sticks — Premium Aggarbatti | Rahmani Perfumery Patna',
  description: 'Discover Rahmani Perfumery\'s (Rehmani Perfumery) collection of premium, long-lasting incense sticks. Perfect for meditation, prayer, or bringing a serene, fragrant ambiance to your home. Best aggarbatti in Patna, Bihar.',
  keywords: [
    'Rahmani incense sticks', 'Rehmani aggarbatti', 'Rahmani Perfumery incense',
    'incense sticks', 'aggarbatti', 'premium agarbatti', 'natural incense',
    'meditation fragrance', 'prayer sticks', 'home fragrance',
    'best aggarbatti Patna', 'incense sticks online India',
    'natural agarbatti', 'fragrance sticks',
  ],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/incense-sticks',
  },
  openGraph: {
    title: 'Incense Sticks — Premium Aggarbatti | Rahmani Perfumery',
    description: 'Discover Rahmani Perfumery\'s collection of premium, long-lasting incense sticks. Perfect for meditation, prayer, or a serene ambiance.',
    url: 'https://rahmaniperfumery.com/incense-sticks',
    siteName: 'Rahmani Perfumery',
  },
};

export default function IncenseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
