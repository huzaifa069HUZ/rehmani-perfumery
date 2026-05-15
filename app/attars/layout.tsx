import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Attars — Buy Best Arabian Attar & Oud Online | Rahmani Perfumery Patna',
  description: 'Shop the finest selection of pure, alcohol-free Arabian attars from Rahmani Perfumery (Rehmani Perfumery) — the best attar shop in Patna, Bihar. From deep oud to fresh floral notes, buy Rahmani attar, oud attar, musk, and more online with delivery across India.',
  keywords: [
    'Rahmani attar', 'Rehmani attar', 'Rahmani Perfumery attar', 'Rahmani oud',
    'best attar shop in Patna', 'best attars in Bihar', 'buy attar online',
    'pure attar', 'Arabian perfume', 'alcohol-free fragrance', 'Oud attar',
    'Shamamatul Amber', 'oud attar Patna', 'musk attar', 'floral attar',
    'buy oud online India', 'best oud Patna', 'natural attar', 'ittar',
    'concentrated perfume oil', 'premium attar brand India',
  ],
  alternates: {
    canonical: 'https://www.rahmaniperfumery.com/attars',
  },
  openGraph: {
    title: 'Premium Attars — Buy Best Arabian Attar & Oud Online | Rahmani Perfumery',
    description: 'Shop the finest selection of pure, alcohol-free Arabian attars from Rahmani Perfumery — the best attar shop in Patna, Bihar. Oud, musk, floral & more.',
    url: 'https://www.rahmaniperfumery.com/attars',
    siteName: 'Rahmani Perfumery',
  },
};

export default function AttarsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
