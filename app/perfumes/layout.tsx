import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Luxury Perfumes — Long-Lasting Imported Perfumes for Men & Women | Rahmani Perfumery',
  description: 'Explore Rahmani Perfumery\'s (Rehmani Perfumery) premium collection of long-lasting, luxury spray perfumes. Exotic imported fragrances crafted with the finest ingredients for men and women. Best perfumes in Patna, Bihar — shop oud perfumes, musk, and more online.',
  keywords: [
    'Rahmani perfume', 'Rehmani perfume', 'Rahmani Perfumery perfumes',
    'luxury perfumes', 'long-lasting perfume', 'best fragrance Patna',
    'imported perfumes in Patna', 'spray perfume', 'premium scent',
    'perfume for men', 'perfume for women', 'Rahmani oud perfume',
    'oud perfume online', 'best perfume India', 'buy perfume online',
    'musk perfume', 'Arabian perfume spray',
  ],
  alternates: {
    canonical: 'https://www.rahmaniperfumery.com/perfumes',
  },
  openGraph: {
    title: 'Luxury Perfumes — Long-Lasting Imported Perfumes | Rahmani Perfumery',
    description: 'Explore Rahmani Perfumery\'s premium collection of long-lasting, luxury spray perfumes for men and women. Best perfumes in Patna.',
    url: 'https://www.rahmaniperfumery.com/perfumes',
    siteName: 'Rahmani Perfumery',
    images: [
      {
        url: 'https://www.rahmaniperfumery.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury Perfumes Collection — Rahmani Perfumery',
      },
    ],
  },
};

const perfumesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Luxury Perfumes Collection — Rahmani Perfumery',
  description: 'Explore long-lasting, luxury spray perfumes for men and women from Rahmani Perfumery in Patna, Bihar.',
  url: 'https://www.rahmaniperfumery.com/perfumes',
  publisher: {
    '@type': 'Organization',
    name: 'Rahmani Perfumery',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.rahmaniperfumery.com/logo.png',
    },
  },
};

export default function PerfumesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(perfumesJsonLd) }}
      />
      {children}
    </>
  );
}
