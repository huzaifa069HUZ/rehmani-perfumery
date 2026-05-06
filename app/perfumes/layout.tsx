import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Perfumes — Long-Lasting Imported Perfumes | Rahmani Perfumery',
  description: 'Explore our premium collection of long-lasting, luxury spray perfumes. Exotic fragrances crafted with the finest ingredients for men and women.',
  keywords: ['luxury perfumes', 'long-lasting perfume', 'best fragrance', 'imported perfumes in Patna', 'spray perfume', 'premium scent', 'perfume for men and women'],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/perfumes',
  },
  openGraph: {
    title: 'Luxury Perfumes — Long-Lasting Imported Perfumes',
    description: 'Explore our premium collection of long-lasting, luxury spray perfumes. Exotic fragrances crafted with the finest ingredients.',
    url: 'https://rahmaniperfumery.com/perfumes',
  },
};

export default function PerfumesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
