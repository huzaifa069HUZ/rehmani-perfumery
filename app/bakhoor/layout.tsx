import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Bakhoor — Arabian Incense Chips | Rahmani Perfumery',
  description: 'Elevate your home with our premium Bakhoor and Oud Muattar. Authentic Arabian incense chips that create a warm, inviting, and luxurious atmosphere.',
  keywords: ['bakhoor', 'oud muattar', 'Arabian incense', 'home fragrance', 'premium bakhoor', 'burn bakhoor', 'best bakhoor online'],
  alternates: {
    canonical: 'https://rahmaniperfumery.com/bakhoor',
  },
  openGraph: {
    title: 'Premium Bakhoor — Arabian Incense Chips',
    description: 'Elevate your home with our premium Bakhoor and Oud Muattar. Authentic Arabian incense chips.',
    url: 'https://rahmaniperfumery.com/bakhoor',
  },
};

export default function BakhoorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
