import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Premium Attar Giftset & Perfume Gifts in Patna | Rahmani Perfumery',
  description: 'Looking for the perfect perfume gift or attar giftset near you? Explore Rahmani Perfumery\'s premium gifting collection in Patna. Find luxury attar gift sets, curated perfume combos, corporate gifting solutions, and wedding favours. Order online for pan-India delivery.',
  keywords: [
    'attar giftset', 'perfume gift', 'attar gifts in patna', 'perfume gifts in patna', 
    'attar gifts near me', 'perfume gifts near me', 'best perfume gift set', 
    'best attar gift box', 'Rahmani gifting', 'Rehmani gift set', 'perfume gift box',
    'corporate gifting perfume', 'wedding favour attar', 'luxury fragrance gift',
    'premium gift set India', 'Rahmani Perfumery gift', 'Patna premium gift'
  ],
  alternates: {
    canonical: 'https://www.rahmaniperfumery.com/gifting',
  },
  openGraph: {
    title: 'Premium Attar Giftset & Perfume Gifts in Patna | Rahmani Perfumery',
    description: 'Looking for the perfect perfume gift or attar giftset near you? Explore Rahmani Perfumery\'s premium gifting collection in Patna. Luxury attar gift sets, curated perfume combos, and corporate gifting.',
    url: 'https://www.rahmaniperfumery.com/gifting',
    siteName: 'Rahmani Perfumery',
    images: [
      {
        url: 'https://www.rahmaniperfumery.com/assets/gifting%20hero.png',
        width: 1200,
        height: 630,
        alt: 'Premium Gifting Collection — Rahmani Perfumery',
      },
    ],
  },
};

const giftingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Premium Attar Giftset & Perfume Gifts in Patna | Rahmani Perfumery',
  description: 'Looking for the perfect perfume gift or attar giftset near you? Explore Rahmani Perfumery\'s premium gifting collection in Patna. Luxury attar gift sets, curated perfume combos, corporate gifting, and wedding favours.',
  url: 'https://www.rahmaniperfumery.com/gifting',
  publisher: {
    '@type': 'Organization',
    name: 'Rahmani Perfumery',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.rahmaniperfumery.com/logo.png',
    },
  },
};

export default function GiftingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(giftingJsonLd) }}
      />
      {children}
    </>
  );
}
