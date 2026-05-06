import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Attars — Buy Best Arabian Attar Online | Rahmani Perfumery',
  description: 'Shop the finest selection of pure, alcohol-free Arabian attars. From deep Oud to fresh floral notes, find your perfect fragrance at the best attar shop in Patna.',
  keywords: ['best attars in Patna', 'buy attar online', 'pure attar', 'Arabian perfume', 'alcohol-free fragrance', 'Oud attar', 'Shamamatul Amber'],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/attars',
  },
  openGraph: {
    title: 'Premium Attars — Buy Best Arabian Attar Online',
    description: 'Shop the finest selection of pure, alcohol-free Arabian attars. From deep Oud to fresh floral notes.',
    url: 'https://rahmaniperfumery.com/attars',
  },
};

export default function AttarsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
