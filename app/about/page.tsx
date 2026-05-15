import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Rahmani Perfumery — Our Story & Heritage | Best Attar Shop in Patna',
  description:
    'Rahmani Perfumery (also known as Rehmani Perfumery) is the best attar shop in Patna, Bihar. Discover our story, heritage, and passion for crafting premium alcohol-free attars, luxury oud, imported perfumes, bakhoor, and Eid gift packs. Rated top perfumery across India.',
  keywords: [
    'about Rahmani Perfumery', 'Rahmani Perfumery story', 'Rehmani Perfumery',
    'best attar shop in Patna', 'best attar shop in Bihar', 
    'alcohol-free attar', 'oud perfume India', 'top fragrance store in Patna',
    'bakhoor', 'Eid gift pack', 'premium perfume', 'Arabian fragrance brand',
    'Rahmani attar', 'Rahmani oud', 'Patna perfumery',
  ],
  alternates: { canonical: 'https://www.rahmaniperfumery.com/about' },
  openGraph: {
    title: 'About Rahmani Perfumery — Our Story & Heritage',
    description: 'Rahmani Perfumery (Rehmani Perfumery) — the best attar shop in Patna. Premium alcohol-free attars, oud, bakhoor and Eid gift packs — handcrafted with love.',
    url: 'https://www.rahmaniperfumery.com/about',
    siteName: 'Rahmani Perfumery',
    images: [
      {
        url: '/og-image.jpg',
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

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Rahmani Perfumery',
  description: 'Rahmani Perfumery (also known as Rehmani Perfumery) is the best attar shop in Patna, Bihar. Discover our story, heritage, and passion for crafting premium alcohol-free attars.',
  url: 'https://www.rahmaniperfumery.com/about',
  publisher: {
    '@type': 'Organization',
    name: 'Rahmani Perfumery',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.rahmaniperfumery.com/logo.png'
    }
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <AboutClient />
    </>
  );
}
