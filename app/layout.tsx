import type { Metadata } from 'next';
import { Playfair_Display, Amiri, Poppins, Montserrat, Bebas_Neue, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FreeAttarPopup from '@/components/FreeAttarPopup';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal', 'italic'], weight: ['400','500','600','700','800','900'] });
const amiri = Amiri({ subsets: ['arabic', 'latin'], variable: '--font-arabic', display: 'swap', weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', display: 'swap', weight: ['300', '400', '500', '600', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap', weight: ['400', '500', '600', '700', '800'] });
const bebasNeue = Bebas_Neue({ subsets: ['latin'], variable: '--font-bebas', display: 'swap', weight: ['400'] });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', display: 'swap', style: ['normal', 'italic'], weight: ['300','400','500','600','700'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rahmaniperfumery.com'),
  title: {
    default: 'Rahmani Perfumery | Premium Arabian Attars & Perfumes',
    template: '%s | Rahmani Perfumery',
  },
  description:
    'Discover handcrafted Arabian attars, premium oud, musk, and floral perfume oils from Rahmani Perfumery. Pure concentrated fragrances, ethically sourced and delivered across India.',
  keywords: [
    'attar', 'Arabian perfume', 'oud attar', 'musk perfume', 'Indian perfume', 'ittar', 'floral attar',
    'Rahmani Perfumery', 'luxury fragrance', 'concentrated perfume oil', 'natural attar',
  ],
  authors: [{ name: 'Rahmani Perfumery', url: 'https://rahmaniperfumery.com' }],
  creator: 'Rahmani Perfumery',
  publisher: 'Rahmani Perfumery',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rahmaniperfumery.com',
    siteName: 'Rahmani Perfumery',
    title: 'Rahmani Perfumery | Premium Arabian Attars & Perfumes',
    description:
      'Handcrafted Arabian attars, oud, musk, and floral perfume oils — pure concentrated luxury.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rahmani Perfumery — Premium Arabian Attars & Perfumes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahmani Perfumery | Premium Arabian Attars & Perfumes',
    description: 'Handcrafted Arabian attars, oud, musk, and floral perfume oils.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://rahmaniperfumery.com',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add Google Search Console verification key here when you get it
    // google: 'your-verification-code',
  },
};


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rahmani Perfumery',
  url: 'https://rahmaniperfumery.com',
  logo: 'https://rahmaniperfumery.com/logo.png',
  description: 'Premium Arabian attars, oud, musk, and floral perfume oils — handcrafted and delivered across India.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'rahmaniperfumerypatna@gmail.com',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${amiri.variable} ${poppins.variable} ${montserrat.variable} ${bebasNeue.variable} ${cormorant.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <FreeAttarPopup />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
