import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Stores in Patna — Visit Rahmani Perfumery',
  description: 'Visit Rahmani Perfumery stores in Phulwari Sharif and Sabzibagh, Patna. Experience premium Arabian attars, perfumes, and bakhoor in person.',
  keywords: ['Rahmani Perfumery store', 'attar shop in Patna', 'Phulwari Sharif attar shop', 'Sabzibagh perfume store', 'buy fragrance in Patna'],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/store',
  },
  openGraph: {
    title: 'Our Stores in Patna — Visit Rahmani Perfumery',
    description: 'Visit Rahmani Perfumery stores in Phulwari Sharif and Sabzibagh, Patna. Experience premium Arabian attars.',
    url: 'https://rahmaniperfumery.com/store',
  },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
