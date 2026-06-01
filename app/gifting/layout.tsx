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

      {/* ── SSR SEO Content — Crawlable by Google ── */}
      <section className="seo-content-island" aria-label="About Rahmani Gifting">
        <div className="seo-content-inner">
          <h2 className="seo-heading">
            Premium Attar Giftset & Perfume Gifts in Patna | Rahmani Perfumery
          </h2>
          <div className="seo-columns">
            <div className="seo-col">
              <h3 className="seo-subheading">The Ultimate Perfume Gift Experience</h3>
              <p>
                <strong>Rahmani Perfumery</strong> (also known as <strong>Rehmani Perfumery</strong>) offers the finest <em>attar giftset</em> and <em>perfume gift</em> collections. If you are searching for premium <strong>attar gifts in Patna</strong> or the best <strong>perfume gifts near me</strong>, you have arrived at the perfect destination. Each luxury gift box features expertly curated Arabian attars and premium fragrances.
              </p>
              <p>
                Whether you need <strong>bulk corporate gifts</strong>, <strong>exquisite wedding favours</strong>, or a beautiful <strong>perfume gift box</strong> for your loved ones — Rahmani Perfumery delivers premium fragrance gifts across India with luxury packaging.
              </p>
            </div>
            <div className="seo-col">
              <h3 className="seo-subheading">Explore Our Gift Categories</h3>
              <ul className="seo-links">
                <li><Link href="/gifting">All Gift Sets</Link> — Browse our complete gifting collection</li>
                <li><Link href="/attars">Premium Attars</Link> — Handcrafted Arabian attar oils for gifting</li>
                <li><Link href="/perfumes">Luxury Perfumes</Link> — Long-lasting imported spray perfumes</li>
                <li><Link href="/store">Visit Our Stores</Link> — Two locations in Patna for in-person experience</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
