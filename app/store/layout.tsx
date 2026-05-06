import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Attar Shop in Patna, Bihar — Visit Rahmani Perfumery Stores',
  description: 'Looking for the best attar shop in Patna? Visit Rahmani Perfumery stores in Phulwari Sharif and Sabzibagh, Bihar. Experience premium Arabian attars, perfumes, and bakhoor in person.',
  keywords: ['best attar shop in Patna', 'best attar shop in Bihar', 'top fragrance store in Patna', 'Rahmani Perfumery store', 'attar shop in Patna', 'Phulwari Sharif attar shop', 'Sabzibagh perfume store', 'buy fragrance in Patna'],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/store',
  },
  openGraph: {
    title: 'Best Attar Shop in Patna, Bihar — Visit Rahmani Perfumery Stores',
    description: 'Looking for the best attar shop in Patna? Visit Rahmani Perfumery stores in Phulwari Sharif and Sabzibagh, Bihar.',
    url: 'https://rahmaniperfumery.com/store',
  },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
