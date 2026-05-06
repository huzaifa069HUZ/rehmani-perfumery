import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Rahmani Perfumery — Our Story & Heritage | Best Attar Shop in Patna',
  description:
    'Rahmani Perfumery (also known as Rehmani Perfumery) is the best attar shop in Patna, Bihar. Discover our story, heritage, and passion for crafting premium alcohol-free attars, luxury oud, imported perfumes, bakhoor, and Eid gift packs. Rated top perfumery across India.',
  keywords: [
    'about Rahmani Perfumery', 'Rahmani Perfumery story', 'Rehmani Perfumery',
    'best attar shop in Patna', 'best attar shop in Bihar', 
    'alcohol-free attar', 'oud perfume India', 'top fragrance store in Patna',
    'bakhoor', 'Eid gift pack', 'premium perfume', 'Arabian fragrance brand',
    'Rahmani attar', 'Rahmani oud', 'Patna perfumery',
  ],
  alternates: { canonical: 'https://rahmaniperfumery.com/about' },
  openGraph: {
    title: 'About Rahmani Perfumery — Our Story & Heritage',
    description: 'Rahmani Perfumery (Rehmani Perfumery) — the best attar shop in Patna. Premium alcohol-free attars, oud, bakhoor and Eid gift packs — handcrafted with love.',
    url: 'https://rahmaniperfumery.com/about',
    siteName: 'Rahmani Perfumery',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
