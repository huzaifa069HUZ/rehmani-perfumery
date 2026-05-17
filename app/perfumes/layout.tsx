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

      {/* ── SSR SEO Content — Crawlable by Google ── */}
      <section className="seo-content-island" aria-label="About Rahmani Perfumes">
        <div className="seo-content-inner">
          <h2 className="seo-heading">
            Luxury Imported Perfumes — Buy Long-Lasting Perfumes Online from Rahmani Perfumery
          </h2>
          <div className="seo-columns">
            <div className="seo-col">
              <h3 className="seo-subheading">Premium Spray Perfumes for Men & Women</h3>
              <p>
                <strong>Rahmani Perfumery</strong> (also known as <strong>Rehmani Perfumery</strong>) brings you the finest collection of <em>long-lasting imported spray perfumes</em> in Patna, Bihar. Each fragrance is crafted using exotic ingredients — from rich <strong>oud perfume</strong> and warm <strong>musk</strong> to fresh citrus and elegant floral compositions.
              </p>
              <p>
                Our luxury perfumes are sourced from world-class fragrance houses and deliver outstanding projection and longevity. Whether you need a <strong>perfume for men</strong>, <strong>perfume for women</strong>, or a unisex fragrance — discover it at <strong>rahmaniperfumery.com</strong>.
              </p>
            </div>
            <div className="seo-col">
              <h3 className="seo-subheading">Explore More Collections</h3>
              <ul className="seo-links">
                <li><Link href="/attars">Premium Attars</Link> — Handcrafted Arabian attars including oud, musk, and floral notes</li>
                <li><Link href="/perfumes">All Perfumes</Link> — Browse our complete luxury perfume collection</li>
                <li><Link href="/bakhoor">Bakhoor & Oud Muattar</Link> — Authentic Arabian incense chips</li>
                <li><Link href="/store">Visit Our Stores</Link> — Two locations in Patna for in-person experience</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
