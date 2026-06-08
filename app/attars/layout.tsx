import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Premium Attars — Buy Best Arabian Attar & Oud Online | Rahmani Perfumery Patna',
  description: 'Shop the finest selection of pure, long-lasting Arabian attars from Rahmani Perfumery (Rehmani Perfumery) — the best attar shop in Patna, Bihar. From deep oud to fresh floral notes, buy Rahmani attar, oud attar, musk, and more online with delivery across India.',
  keywords: [
    'Rahmani attar', 'Rehmani attar', 'Rahmani Perfumery attar', 'Rahmani oud',
    'best attar shop in Patna', 'best attars in Bihar', 'buy attar online',
    'pure attar', 'Arabian perfume', 'long-lasting fragrance', 'Oud attar',
    'Shamamatul Amber', 'oud attar Patna', 'musk attar', 'floral attar',
    'buy oud online India', 'best oud Patna', 'natural attar', 'ittar',
    'concentrated perfume oil', 'premium attar brand India',
  ],
  alternates: {
    canonical: 'https://www.rahmaniperfumery.com/attars',
  },
  openGraph: {
    title: 'Premium Attars — Buy Best Arabian Attar & Oud Online | Rahmani Perfumery',
    description: 'Shop the finest selection of pure, long-lasting Arabian attars from Rahmani Perfumery — the best attar shop in Patna, Bihar. Oud, musk, floral & more.',
    url: 'https://www.rahmaniperfumery.com/attars',
    siteName: 'Rahmani Perfumery',
    images: [
      {
        url: 'https://www.rahmaniperfumery.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Attars Collection — Rahmani Perfumery',
      },
    ],
  },
};

const attarsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Premium Attars Collection — Rahmani Perfumery',
  description: 'Shop the finest selection of pure, long-lasting Arabian attars from Rahmani Perfumery in Patna, Bihar.',
  url: 'https://www.rahmaniperfumery.com/attars',
  publisher: {
    '@type': 'Organization',
    name: 'Rahmani Perfumery',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.rahmaniperfumery.com/logo.png',
    },
  },
};

export default function AttarsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attarsJsonLd) }}
      />
      {children}
    </>
  );
}
