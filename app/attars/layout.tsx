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

      {/* ── SSR SEO Content — Crawlable by Google ── */}
      <section className="seo-content-island" aria-label="About Rahmani Attars">
        <div className="seo-content-inner">
          <h2 className="seo-heading">
            Premium Arabian Attars — Buy Best Attar Online from Rahmani Perfumery
          </h2>
          <div className="seo-columns">
            <div className="seo-col">
              <h3 className="seo-subheading">The Finest Attar Collection in Patna</h3>
              <p>
                <strong>Rahmani Perfumery</strong> (also known as <strong>Rehmani Perfumery</strong>) offers the most exquisite collection of <em>pure, long-lasting Arabian attars</em> in Patna, Bihar. Our handcrafted attar oils include deep oud, delicate floral, warm musk, spicy, and fresh citrus fragrances — each crafted using traditional distillation techniques.
              </p>
              <p>
                Whether you&apos;re searching for <strong>Rahmani attar</strong>, <strong>oud attar</strong>, <strong>musk attar</strong>, or a unique <strong>floral attar blend</strong>, our collection features the finest concentrated perfume oils sourced from the best distilleries in Arabia and India.
              </p>
            </div>
            <div className="seo-col">
              <h3 className="seo-subheading">Explore Our Attar Categories</h3>
              <ul className="seo-links">
                <li><Link href="/attars">All Attars</Link> — Browse our complete collection of handcrafted Arabian attar oils</li>
                <li><Link href="/perfumes">Luxury Perfumes</Link> — Long-lasting imported spray perfumes for men and women</li>
                <li><Link href="/bakhoor">Bakhoor & Oud Muattar</Link> — Authentic Arabian incense for home fragrance</li>
                <li><Link href="/store">Visit Our Stores</Link> — Two locations in Patna: Phulwari Sharif & Sabzibagh</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
