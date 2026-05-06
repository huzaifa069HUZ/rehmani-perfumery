import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Perfumes — Long-Lasting Imported Perfumes for Men & Women | Rahmani Perfumery',
  description: 'Explore Rahmani Perfumery\'s (Rehmani Perfumery) premium collection of long-lasting, luxury spray perfumes. Exotic imported fragrances crafted with the finest ingredients for men and women. Best perfumes in Patna, Bihar — shop oud perfumes, musk, and more online.',
  keywords: [
    'Rahmani perfume', 'Rehmani perfume', 'Rahmani Perfumery perfumes',
    'luxury perfumes', 'long-lasting perfume', 'best fragrance Patna',
    'imported perfumes in Patna', 'spray perfume', 'premium scent',
    'perfume for men', 'perfume for women', 'Rahmani oud perfume',
    'oud perfume online', 'best perfume India', 'buy perfume online',
    'musk perfume', 'Arabian perfume spray',
  ],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/perfumes',
  },
  openGraph: {
    title: 'Luxury Perfumes — Long-Lasting Imported Perfumes | Rahmani Perfumery',
    description: 'Explore Rahmani Perfumery\'s premium collection of long-lasting, luxury spray perfumes for men and women. Best perfumes in Patna.',
    url: 'https://rahmaniperfumery.com/perfumes',
    siteName: 'Rahmani Perfumery',
  },
};

export default function PerfumesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
