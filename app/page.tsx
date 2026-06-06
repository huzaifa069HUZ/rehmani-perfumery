import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rahmani Perfumery — Premium Attars, Oud & Perfumes | Patna, Bihar',
  alternates: {
    canonical: 'https://www.rahmaniperfumery.com',
  },
};

// SEO Content JSON-LD for the homepage (ItemList of top products)
const homepageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Featured Products — Rahmani Perfumery',
  description: 'Top-selling attars, oud, perfumes, and bakhoor from Rahmani Perfumery in Patna, Bihar.',
  itemListOrder: 'https://schema.org/ItemListUnordered',
  numberOfItems: 4,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      url: 'https://www.rahmaniperfumery.com/attars',
      name: 'Premium Attars Collection',
    },
    {
      '@type': 'ListItem',
      position: 2,
      url: 'https://www.rahmaniperfumery.com/perfumes',
      name: 'Luxury Perfumes Collection',
    },
    {
      '@type': 'ListItem',
      position: 3,
      url: 'https://www.rahmaniperfumery.com/bakhoor',
      name: 'Bakhoor & Oud Muattar',
    },
    {
      '@type': 'ListItem',
      position: 4,
      url: 'https://www.rahmaniperfumery.com/incense-sticks',
      name: 'Premium Incense Sticks',
    },
  ],
};

// FAQ Schema for common brand queries
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Rahmani Perfumery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rahmani Perfumery (also known as Rehmani Perfumery) is a premium Arabian attar and perfume brand based in Patna, Bihar. Established in 2015, we are recognized as one of the best attar shops in Patna, offering handcrafted long-lasting attars, luxury oud, musk, bakhoor, and imported perfumes delivered across India.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Rahmani Perfumery located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rahmani Perfumery has two stores in Patna, Bihar. Our main store is at Khagaul Rd, Fiya Colony, Maulana Azad Nagar, Phulwari Sharif, Patna (801505), and our second store is in Sabzibagh, Patna (800004). You can also shop online at rahmaniperfumery.com with delivery across India.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Rahmani Perfumery sell oud?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Rahmani Perfumery offers a premium collection of oud (agarwood) attars and oud-based perfumes. Our oud collection includes pure Cambodian oud, Indian oud attar, and blended oud fragrances. We are known for the best oud collection in Patna, Bihar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Rahmani Perfumery the same as Rehmani Perfumery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Rahmani Perfumery and Rehmani Perfumery refer to the same brand. The official spelling is "Rahmani Perfumery" but it is commonly searched as "Rehmani Perfumery" as well. Our website is rahmaniperfumery.com.',
      },
    },
    {
      '@type': 'Question',
      name: 'What products does Rahmani Perfumery offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rahmani Perfumery offers premium Arabian attars (concentrated perfume oils), luxury oud, musk, floral attars, imported spray perfumes for men and women, bakhoor (Arabian incense chips), and premium incense sticks (agarbatti). All attars are crafted to be rich and exceptionally long-lasting.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
      
      {/* ── SSR SEO Content Island — Crawlable by Google ── */}
      <section className="seo-content-island" aria-label="About Rahmani Perfumery">
        <div className="seo-content-inner">
          <h2 className="seo-heading">
            Rahmani Perfumery — Premium Arabian Attars, Oud & Perfumes in Patna, Bihar
          </h2>
          
          <div className="seo-columns">
            <div className="seo-col">
              <h3 className="seo-subheading">The Best Attar & Oud Shop in Patna</h3>
              <p>
                <strong>Rahmani Perfumery</strong> (also known as <strong>Rehmani Perfumery</strong>) is Patna's most trusted destination for premium Arabian attars, luxury oud, musk, and handcrafted perfume oils. Established in 2015, we have earned a reputation as the <em>best attar shop in Patna, Bihar</em>, serving thousands of fragrance enthusiasts across India.
              </p>
              <p>
                Our curated collection features pure, long-lasting attars sourced from the finest distilleries in Arabia, alongside imported long-lasting spray perfumes for men and women. Whether you're searching for <strong>Rahmani attar</strong>, <strong>Rahmani oud</strong>, or the perfect <strong>bakhoor</strong> for your home — we have it all.
              </p>
            </div>
            
            <div className="seo-col">
              <h3 className="seo-subheading">Explore Our Collections</h3>
              <ul className="seo-links">
                <li>
                  <Link href="/attars">Premium Attars</Link> — Handcrafted Arabian attars including oud, musk, floral, and spicy fragrances
                </li>
                <li>
                  <Link href="/perfumes">Luxury Perfumes</Link> — Long-lasting imported spray perfumes for men and women
                </li>
                <li>
                  <Link href="/bakhoor">Bakhoor & Oud Muattar</Link> — Authentic Arabian incense chips for home fragrance
                </li>
                <li>
                  <Link href="/incense-sticks">Incense Sticks</Link> — Premium aggarbatti for meditation, prayer, and ambiance
                </li>
                <li>
                  <Link href="/store">Visit Our Stores</Link> — Two locations in Patna: Phulwari Sharif & Sabzibagh
                </li>
                <li>
                  <Link href="/about-us">Our Story</Link> — Learn about Rahmani Perfumery's heritage and craftsmanship
                </li>
              </ul>
            </div>
          </div>
          
          <div className="seo-bottom-text">
            <p>
              Looking for the <strong>best oud in India</strong>? Rahmani Perfumery offers authentic Cambodian oud, Indian oud attar, and exclusive oud-based blends you won't find anywhere else. We ship <strong>premium attars and perfumes across India</strong> with secure packaging and fast delivery. Visit us at our Patna stores or shop online at <strong>rahmaniperfumery.com</strong>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
