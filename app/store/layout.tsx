import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visit Rahmani Perfumery Stores in Patna — Best Attar Shop in Bihar',
  description: 'Looking for the best attar shop in Patna? Visit Rahmani Perfumery (Rehmani Perfumery) stores in Phulwari Sharif and Sabzibagh, Bihar. Experience premium Arabian attars, oud, perfumes, and bakhoor in person. Two store locations in Patna.',
  keywords: [
    'Rahmani Perfumery store', 'Rehmani Perfumery store', 'Rahmani Perfumery Patna',
    'best attar shop in Patna', 'best attar shop in Bihar',
    'top fragrance store in Patna', 'attar shop in Patna',
    'Phulwari Sharif attar shop', 'Sabzibagh perfume store',
    'buy fragrance in Patna', 'oud shop Patna', 'perfume store Bihar',
    'Rahmani Perfumery location', 'Rahmani Perfumery address',
  ],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/store',
  },
  openGraph: {
    title: 'Visit Rahmani Perfumery Stores in Patna — Best Attar Shop in Bihar',
    description: 'Looking for the best attar shop in Patna? Visit Rahmani Perfumery stores in Phulwari Sharif and Sabzibagh, Bihar.',
    url: 'https://rahmaniperfumery.com/store',
    siteName: 'Rahmani Perfumery',
  },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
