import type { Metadata } from 'next';
import Link from 'next/link';

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
        url: 'https://www.rahmaniperfumery.com/og-image.jpg',
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

      {/* ── SSR SEO Content — Crawlable by Google ── */}
      <section className="seo-content-island" aria-label="About Rahmani Bakhoor">
        <div className="seo-content-inner">
          <h2 className="seo-heading">
            Premium Bakhoor & Oud Muattar — Buy Authentic Arabian Incense Online
          </h2>
          <div className="seo-columns">
            <div className="seo-col">
              <h3 className="seo-subheading">Authentic Arabian Bakhoor in Patna</h3>
              <p>
                <strong>Rahmani Perfumery</strong> (also known as <strong>Rehmani Perfumery</strong>) offers the finest collection of <em>premium bakhoor and oud muattar</em> in Patna, Bihar. Our Arabian incense chips are sourced from the best producers in the Middle East, delivering rich, aromatic smoke that fills every corner of your home with luxury.
              </p>
              <p>
                Whether you&apos;re looking for traditional <strong>oud bakhoor</strong>, floral bakhoor blends, or <strong>premium oud muattar</strong>, Rahmani Perfumery has the perfect home fragrance for every occasion — from daily use to special gatherings and festivals.
              </p>
            </div>
            <div className="seo-col">
              <h3 className="seo-subheading">Browse Our Collections</h3>
              <ul className="seo-links">
                <li><Link href="/bakhoor">All Bakhoor</Link> — Complete Arabian incense and oud muattar collection</li>
                <li><Link href="/attars">Premium Attars</Link> — Pure, long-lasting concentrated perfume oils</li>
                <li><Link href="/incense-sticks">Incense Sticks</Link> — Premium aggarbatti for meditation and prayer</li>
                <li><Link href="/store">Visit Our Stores</Link> — Experience our fragrances in person in Patna</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
