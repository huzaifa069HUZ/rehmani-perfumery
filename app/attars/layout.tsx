import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Attars in Patna — Buy Best Arabian Attar Online | Rahmani Perfumery',
  description: 'Shop the finest selection of pure, alcohol-free Arabian attars from the best attar shop in Patna, Bihar. From deep Oud to fresh floral notes, find your perfect fragrance online.',
  keywords: ['best attar shop in Patna', 'best attars in Bihar', 'buy attar online', 'pure attar', 'Arabian perfume', 'alcohol-free fragrance', 'Oud attar', 'Shamamatul Amber'],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/attars',
  },
  openGraph: {
    title: 'Premium Attars in Patna — Buy Best Arabian Attar Online',
    description: 'Shop the finest selection of pure, alcohol-free Arabian attars from the best attar shop in Patna, Bihar.',
    url: 'https://rahmaniperfumery.com/attars',
  },
};

export default function AttarsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
