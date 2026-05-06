import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Bakhoor — Arabian Incense & Oud Muattar | Rahmani Perfumery Patna',
  description: 'Elevate your home with premium bakhoor and oud muattar from Rahmani Perfumery (Rehmani Perfumery). Authentic Arabian incense chips that create a warm, inviting, and luxurious atmosphere. Best bakhoor in Patna, Bihar — buy online with all-India delivery.',
  keywords: [
    'Rahmani bakhoor', 'Rehmani bakhoor', 'Rahmani Perfumery bakhoor',
    'bakhoor', 'oud muattar', 'Arabian incense', 'home fragrance',
    'premium bakhoor', 'burn bakhoor', 'best bakhoor online',
    'bakhoor Patna', 'Arabian incense chips', 'oud chips',
    'bakhoor India', 'buy bakhoor online', 'luxury home fragrance',
  ],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/bakhoor',
  },
  openGraph: {
    title: 'Premium Bakhoor — Arabian Incense & Oud Muattar | Rahmani Perfumery',
    description: 'Elevate your home with premium bakhoor and oud muattar from Rahmani Perfumery. Authentic Arabian incense chips in Patna, Bihar.',
    url: 'https://rahmaniperfumery.com/bakhoor',
    siteName: 'Rahmani Perfumery',
  },
};

export default function BakhoorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
