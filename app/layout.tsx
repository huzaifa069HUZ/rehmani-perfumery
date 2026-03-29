import type { Metadata } from 'next';
import { Cinzel, Playfair_Display, Inter, Amiri, Poppins, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap', weight: ['400','500','600','700','800','900'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal','italic'] });
const amiri = Amiri({ subsets: ['arabic','latin'], variable: '--font-arabic', display: 'swap', weight: ['400','700'] });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', display: 'swap', weight: ['300','400','500','600','700'] });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap', weight: ['400','500','600','700','800'] });

export const metadata: Metadata = {
  title: 'REHMANI | Premium Perfumes & Attars',
  description: 'Discover premium Arabian attars, luxurious oud, musk, and floral perfume oils.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${playfair.variable} ${amiri.variable} ${poppins.variable} ${montserrat.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
