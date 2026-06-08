import type { Metadata } from 'next';
import Link from 'next/link';

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
    canonical: 'https://www.rahmaniperfumery.com/incense-sticks',
  },
  openGraph: {
    title: 'Incense Sticks — Premium Aggarbatti | Rahmani Perfumery',
    description: 'Discover Rahmani Perfumery\'s collection of premium, long-lasting incense sticks. Perfect for meditation, prayer, or a serene ambiance.',
    url: 'https://www.rahmaniperfumery.com/incense-sticks',
    siteName: 'Rahmani Perfumery',
    images: [
      {
        url: 'https://www.rahmaniperfumery.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Incense Sticks — Rahmani Perfumery',
      },
    ],
  },
};

const incenseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Premium Incense Sticks Collection — Rahmani Perfumery',
  description: 'Shop premium, long-lasting incense sticks and aggarbatti from Rahmani Perfumery in Patna, Bihar.',
  url: 'https://www.rahmaniperfumery.com/incense-sticks',
  publisher: {
    '@type': 'Organization',
    name: 'Rahmani Perfumery',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.rahmaniperfumery.com/logo.png',
    },
  },
};

export default function IncenseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(incenseJsonLd) }}
      />
      {children}
    </>
  );
}
