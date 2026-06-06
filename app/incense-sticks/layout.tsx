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

      {/* ── SSR SEO Content — Crawlable by Google ── */}
      <section className="seo-content-island" aria-label="About Rahmani Incense Sticks">
        <div className="seo-content-inner">
          <h2 className="seo-heading">
            Premium Incense Sticks — Best Aggarbatti Online from Rahmani Perfumery
          </h2>
          <div className="seo-columns">
            <div className="seo-col">
              <h3 className="seo-subheading">Finest Aggarbatti in Patna, Bihar</h3>
              <p>
                <strong>Rahmani Perfumery</strong> (also known as <strong>Rehmani Perfumery</strong>) presents a curated collection of <em>premium, long-lasting incense sticks</em> perfect for meditation, prayer, and creating a serene ambiance in your home. Our aggarbatti is made from the finest natural ingredients including oud, sandalwood, rose, and herbal extracts.
              </p>
              <p>
                Each stick is handcrafted with care, delivering rich, soothing fragrance that lasts longer than ordinary incense. Experience the difference of <strong>Rahmani incense sticks</strong> — available for delivery across India from <strong>rahmaniperfumery.com</strong>.
              </p>
            </div>
            <div className="seo-col">
              <h3 className="seo-subheading">Explore More Collections</h3>
              <ul className="seo-links">
                <li><Link href="/incense-sticks">All Incense Sticks</Link> — Browse our complete aggarbatti collection</li>
                <li><Link href="/bakhoor">Bakhoor & Oud Muattar</Link> — Authentic Arabian incense chips</li>
                <li><Link href="/attars">Premium Attars</Link> — Pure, long-lasting concentrated perfume oils</li>
                <li><Link href="/store">Visit Our Stores</Link> — Experience our fragrances in person in Patna</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
