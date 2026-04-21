import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | Rahmani Perfumery',
  description:
    'Discover the story of Rahmani Perfumery — premium alcohol-free attars, long-lasting imported perfumes, exclusive oud, bakhoor, and Eid gift packs. Trusted by hundreds of happy customers across India.',
  keywords: [
    'about Rahmani Perfumery', 'alcohol-free attar', 'oud perfume India',
    'bakhoor', 'Eid gift pack', 'premium perfume', 'Arabian fragrance brand',
  ],
  alternates: { canonical: 'https://rahmaniperfumery.com/about' },
  openGraph: {
    title: 'About Us | Rahmani Perfumery',
    description: 'Premium alcohol-free attars, oud, bakhoor and Eid gift packs — handcrafted with love.',
    url: 'https://rahmaniperfumery.com/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
