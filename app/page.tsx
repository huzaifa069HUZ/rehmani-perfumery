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
    </>
  );
}
