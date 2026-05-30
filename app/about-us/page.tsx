import type { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';

export const metadata: Metadata = {
  title: 'About Us — Rahmani Perfumery | Premium Attars, Oud & Bakhoor in Patna',
  description:
    'Discover Rahmani Perfumery — your trusted source for premium alcohol-free attars, long-lasting perfumes, oud, bakhoor, and exclusive Eid gift packs in Patna, Bihar. Wear confidence. Wear identity. Wear memories.',
  keywords: [
    'about Rahmani Perfumery', 'Rahmani Perfumery story', 'Rehmani Perfumery',
    'best attar shop in Patna', 'best attar shop in Bihar',
    'alcohol-free attar', 'oud perfume India', 'top fragrance store in Patna',
    'bakhoor', 'Eid gift pack', 'premium perfume', 'Arabian fragrance brand',
  ],
  alternates: { canonical: 'https://www.rahmaniperfumery.com/about-us' },
  openGraph: {
    title: 'About Us — Rahmani Perfumery',
    description: 'Premium alcohol-free attars, oud, bakhoor and Eid gift packs — handcrafted with love in Patna.',
    url: 'https://www.rahmaniperfumery.com/about-us',
    siteName: 'Rahmani Perfumery',
    images: [
      {
        url: 'https://www.rahmaniperfumery.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Rahmani Perfumery',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const aboutUsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Rahmani Perfumery',
  description: 'Rahmani Perfumery — premium alcohol-free attars, oud, bakhoor and Eid gift packs, handcrafted in Patna, Bihar.',
  url: 'https://www.rahmaniperfumery.com/about-us',
  publisher: {
    '@type': 'Organization',
    name: 'Rahmani Perfumery',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.rahmaniperfumery.com/logo.png'
    }
  }
};

export default function AboutUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutUsJsonLd) }}
      />
      <AboutUsClient />
    </>
  );
}
