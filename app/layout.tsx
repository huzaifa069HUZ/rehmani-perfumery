import type { Metadata } from 'next';
import { Playfair_Display, Amiri, Poppins, Montserrat, Bebas_Neue, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FreeAttarPopup from '@/components/FreeAttarPopup';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal', 'italic'], weight: ['400','500','600','700','800','900'] });
const amiri = Amiri({ subsets: ['arabic', 'latin'], variable: '--font-arabic', display: 'swap', weight: ['400', '700'] });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', display: 'swap', weight: ['300', '400', '500', '600', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap', weight: ['400', '500', '600', '700', '800'] });
const bebasNeue = Bebas_Neue({ subsets: ['latin'], variable: '--font-bebas', display: 'swap', weight: ['400'] });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', display: 'swap', style: ['normal', 'italic'], weight: ['300','400','500','600','700'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rahmaniperfumery.com'),
  title: {
    default: 'Rahmani Perfumery — Premium Attars, Oud & Perfumes | Patna, Bihar',
    template: '%s | Rahmani Perfumery',
  },
  description:
    'Rahmani Perfumery (also known as Rehmani Perfumery) is the best attar and oud shop in Patna, Bihar. Shop premium Arabian attars, luxury oud, musk, bakhoor, and long-lasting imported perfumes online. Handcrafted fragrances delivered across India.',
  keywords: [
    // Brand variations (typo coverage)
    'Rahmani Perfumery', 'Rehmani Perfumery', 'Rahmani Perfumary', 'Rehmani Perfumary',
    'Rahmani', 'Rehmani', 'rahmaniperfumery',
    // Brand + product queries
    'Rahmani attar', 'Rahmani oud', 'Rahmani perfume', 'Rahmani bakhoor',
    'Rehmani attar', 'Rehmani oud', 'Rehmani perfume',
    // Location queries
    'Rahmani Perfumery Patna', 'best attar shop in Patna', 'best attar shop in Bihar',
    'top perfumery in Patna', 'best fragrance store in Patna', 'attar shop Patna',
    // Product queries
    'buy attar online', 'buy oud online India', 'best oud India', 'oud attar',
    'Arabian perfume', 'musk perfume', 'floral attar', 'luxury fragrance',
    'concentrated perfume oil', 'natural attar', 'alcohol-free attar', 'ittar',
    'premium attar brand', 'best perfumes in Patna', 'imported perfumes Patna',
    // Specific products
    'Oud Nadira', 'Shamamatul Amber', 'Ruh Khus', 'best oud in India',
  ],
  authors: [{ name: 'Rahmani Perfumery', url: 'https://rahmaniperfumery.com' }],
  creator: 'Rahmani Perfumery',
  publisher: 'Rahmani Perfumery',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rahmaniperfumery.com',
    siteName: 'Rahmani Perfumery',
    title: 'Rahmani Perfumery — Premium Attars, Oud & Perfumes',
    description:
      'Rahmani Perfumery (Rehmani Perfumery) — the best attar and oud shop in Patna, Bihar. Premium Arabian attars, luxury oud, musk, and perfume oils handcrafted and delivered across India.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rahmani Perfumery — Premium Attars, Oud & Perfumes in Patna',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahmani Perfumery — Premium Attars, Oud & Perfumes',
    description: 'Rahmani Perfumery (Rehmani Perfumery) — best attar & oud shop in Patna. Handcrafted Arabian attars, premium oud, musk, and perfume oils.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://rahmaniperfumery.com',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Organization JSON-LD
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rahmani Perfumery',
  alternateName: [
    'Rehmani Perfumery',
    'Rahmani Perfumary',
    'Rehmani Perfumary',
    'Rahmani Attar',
    'Rahmani Oud',
    'Rahmani Perfumery Patna',
    'rahmaniperfumery',
  ],
  url: 'https://rahmaniperfumery.com',
  logo: 'https://rahmaniperfumery.com/assets/logo.png',
  image: 'https://rahmaniperfumery.com/og-image.jpg',
  description: 'Rahmani Perfumery (also known as Rehmani Perfumery) is the best attar and oud shop in Patna, Bihar. We offer premium Arabian attars, luxury oud, musk, bakhoor, and imported perfumes — handcrafted and delivered across India.',
  foundingDate: '2015',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'rahmaniperfumerypatna@gmail.com',
    telephone: '+919835612345',
    availableLanguage: ['English', 'Hindi', 'Urdu'],
  },
  sameAs: [
    'https://www.instagram.com/rahmaniperfumery',
  ],
  knowsAbout: [
    'Attar', 'Oud', 'Arabian Perfume', 'Musk', 'Bakhoor',
    'Perfume Oil', 'Ittar', 'Fragrance', 'Natural Perfume',
  ],
};

// WebSite JSON-LD (SearchAction for Google Sitelinks Search Box)
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: 'https://rahmaniperfumery.com',
  name: 'Rahmani Perfumery',
  alternateName: ['Rehmani Perfumery', 'Rahmani Perfumary', 'Rahmani Attar Shop'],
  description: 'Rahmani Perfumery — shop premium Arabian attars, oud, perfumes, bakhoor and incense sticks online. The best attar shop in Patna, Bihar.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://rahmaniperfumery.com/store?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

// LocalBusiness JSON-LD (for both stores in Patna)
const localBusinessJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Rahmani Perfumery - Phulwari Sharif',
    image: 'https://rahmaniperfumery.com/assets/store-phulwari.png',
    '@id': 'https://rahmaniperfumery.com/#store-phulwari',
    url: 'https://rahmaniperfumery.com/store',
    telephone: '+919835612345',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Phulwari Sharif',
      addressLocality: 'Patna',
      addressRegion: 'Bihar',
      postalCode: '801505',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.5750,
      longitude: 85.0784,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '21:00',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Rahmani Perfumery - Sabzibagh',
    image: 'https://rahmaniperfumery.com/assets/store-sabzibagh.png',
    '@id': 'https://rahmaniperfumery.com/#store-sabzibagh',
    url: 'https://rahmaniperfumery.com/store',
    telephone: '+919835612345',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sabzibagh',
      addressLocality: 'Patna',
      addressRegion: 'Bihar',
      postalCode: '800004',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.6174,
      longitude: 85.1485,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '21:00',
    },
  }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${amiri.variable} ${poppins.variable} ${montserrat.variable} ${bebasNeue.variable} ${cormorant.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <FreeAttarPopup />
              <CartDrawer />
              <MobileBottomNav />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
