import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Bakhoor — Arabian Incense & Oud Muattar | Rahmani Perfumery Patna',
  description: 'Elevate your home with premium bakhoor and oud muattar from Rahmani Perfumery (Rehmani Perfumery). Authentic Arabian incense chips that create a warm, inviting, and luxurious atmosphere. Best bakhoor in Patna, Bihar — buy online with all-India delivery.',
  keywords: [
    'Rahmani bakhoor', 'Rehmani bakhoor', 'Rahmani Perfumery bakhoor',
    'bakhoor', 'oud muattar', 'Arabian incense', 'home fragrance',
    'premium bakhoor', 'burn bakhoor', 'best bakhoor online',
    'bakhoor Patna', 'Arabian incense chips', 'oud chips',
    'bakhoor India', 'buy bakhoor online', 'luxury home fragrance',
  ],
  alternates: {
    canonical: 'https://www.rahmaniperfumery.com/bakhoor',
  },
  openGraph: {
    title: 'Premium Bakhoor — Arabian Incense & Oud Muattar | Rahmani Perfumery',
    description: 'Elevate your home with premium bakhoor and oud muattar from Rahmani Perfumery. Authentic Arabian incense chips in Patna, Bihar.',
    url: 'https://www.rahmaniperfumery.com/bakhoor',
    siteName: 'Rahmani Perfumery',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Bakhoor — Rahmani Perfumery',
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

const bakhoorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Premium Bakhoor and Oud Muattar Collection',
  description: 'Shop premium bakhoor, oud muattar, and Arabian incense chips from Rahmani Perfumery.',
  url: 'https://www.rahmaniperfumery.com/bakhoor',
  publisher: {
    '@type': 'Organization',
    name: 'Rahmani Perfumery',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.rahmaniperfumery.com/logo.png'
    }
  }
};

export default function BakhoorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bakhoorJsonLd) }}
      />
      {children}
    </>
  );
}
