import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Premium Gifting — Luxury Attar Gift Sets for Every Occasion | Rahmani Perfumery',
  description: 'Discover Rahmani Perfumery\'s premium gifting collection — luxury attar gift sets, corporate gifting solutions, wedding favours, and personalised fragrance gifts. The perfect present for every occasion, delivered pan-India from the best perfumery in Patna, Bihar.',
  keywords: [
    'Rahmani gifting', 'Rehmani gift set', 'attar gift set', 'perfume gift box',
    'corporate gifting perfume', 'wedding favour attar', 'luxury fragrance gift',
    'premium gift set India', 'personalised attar gift', 'Rahmani Perfumery gift',
    'bulk gifting perfume', 'custom fragrance gift', 'oud gift set', 'gift for partner',
    'celebration gift attar', 'Patna gifting', 'Bihar premium gift',
  ],
  alternates: {
    canonical: 'https://www.rahmaniperfumery.com/gifting',
  },
  openGraph: {
    title: 'Premium Gifting — Luxury Attar Gift Sets | Rahmani Perfumery',
    description: 'Luxury attar gift sets, corporate gifting, and wedding favours from Rahmani Perfumery — the best perfumery in Patna, Bihar.',
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
  name: 'Premium Gifting Collection — Rahmani Perfumery',
  description: 'Luxury attar gift sets, corporate gifting, wedding favours, and personalised fragrance gifts from Rahmani Perfumery in Patna, Bihar.',
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
            Premium Gifting — Luxury Attar Gift Sets for Every Occasion | Rahmani Perfumery
          </h2>
          <div className="seo-columns">
            <div className="seo-col">
              <h3 className="seo-subheading">The Art of Gifting by Rahmani Perfumery</h3>
              <p>
                <strong>Rahmani Perfumery</strong> (also known as <strong>Rehmani Perfumery</strong>) offers the finest selection of <em>luxury attar gift sets</em> for every special occasion. From premium corporate gifting solutions to elegant wedding favours and heartfelt gifts for your loved ones — each gift box features handcrafted Arabian attars in our signature packaging.
              </p>
              <p>
                Whether you need <strong>bulk corporate gifts</strong>, <strong>personalised wedding favours</strong>, or a beautiful <strong>attar gift set</strong> for your partner — Rahmani Perfumery delivers premium fragrance gifts across India with customisable branding and luxury packaging.
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
