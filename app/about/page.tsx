import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Rahmani Perfumery | Best Attar Shop in Patna, Bihar',
  description:
    'Rahmani Perfumery is the best attar shop in Patna, Bihar. Discover our story and explore premium alcohol-free attars, long-lasting imported perfumes, exclusive oud, bakhoor, and Eid gift packs. Rated top perfumery across India.',
  keywords: [
    'about Rahmani Perfumery', 'best attar shop in Patna', 'best attar shop in Bihar', 
    'alcohol-free attar', 'oud perfume India', 'top fragrance store in Patna',
    'bakhoor', 'Eid gift pack', 'premium perfume', 'Arabian fragrance brand',
  ],
  alternates: { canonical: 'https://rahmaniperfumery.com/about' },
  openGraph: {
    title: 'About Rahmani Perfumery | Best Attar Shop in Patna, Bihar',
    description: 'The best attar shop in Patna, Bihar. Premium alcohol-free attars, oud, bakhoor and Eid gift packs — handcrafted with love.',
    url: 'https://rahmaniperfumery.com/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
