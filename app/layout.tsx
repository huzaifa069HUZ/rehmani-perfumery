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
    default: 'Rahmani Perfumery | Best Attar Shops in Patna, Bihar',
    template: '%s | Best Attar Shop in Patna, Bihar | Rahmani Perfumery',
  },
  description:
    'Rahmani Perfumery is recognized as one of the best attar shops in Patna, Bihar, and across India. Discover handcrafted Arabian attars, premium oud, musk, and long-lasting floral perfume oils. Buy the finest authentic fragrances online.',
  keywords: [
    'best attar shops in Patna', 'best attar shop in Bihar', 'top perfumery in Patna', 
    'best fragrance store in Bihar', 'buy attar online in India', 'best perfumes in Patna',
    'Rahmani Perfumery Patna', 'attar shop in Patna', 'buy attar online', 
    'Arabian perfume', 'oud attar', 'musk perfume', 'Indian perfume', 'ittar', 
    'floral attar', 'luxury fragrance', 'concentrated perfume oil', 'natural attar',
    'Oud Nadira', 'Shamamatul Amber', 'Ruh Khus', 'best oud in India', 'premium attar brand'
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
    siteName: 'Rahmani Perfumery - Best Attar Shop in Patna',
    title: 'Rahmani Perfumery | Best Attar Shops in Patna, Bihar',
    description:
      'Recognized as one of the best attar shops in Patna, Bihar. Handcrafted Arabian attars, premium oud, musk, and floral perfume oils delivered across India.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rahmani Perfumery — Best Attar Shops in Patna, Bihar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahmani Perfumery | Best Attar Shops in Patna, Bihar',
    description: 'Recognized as one of the best attar shops in Patna, Bihar. Handcrafted Arabian attars, premium oud, musk, and floral perfume oils.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://rahmaniperfumery.com',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
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
  url: 'https://rahmaniperfumery.com',
  logo: 'https://rahmaniperfumery.com/assets/logo.png',
  description: 'Rahmani Perfumery is the best attar shop in Patna, Bihar. Premium Arabian attars, oud, musk, and floral perfume oils — handcrafted and delivered across India.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'rahmaniperfumerypatna@gmail.com',
    telephone: '+919835612345',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/rahmaniperfumery'
  ],
};

// WebSite JSON-LD (SearchAction for Google Sitelinks Search Box)
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: 'https://rahmaniperfumery.com',
  name: 'Rahmani Perfumery',
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
