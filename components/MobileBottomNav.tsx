'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { GlassEffect, GlassFilter } from '@/components/ui/liquid-glass';

export default function MobileBottomNav() {
  const { totalItems, toggleCart } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();

  const isHomeActive = pathname === '/' || pathname === '/attars';
  const isWishlistActive = pathname === '/wishlist';
  const isAccountActive = pathname === '/profile' || pathname === '/auth';

  return (
    <>
      <GlassFilter />
      <GlassEffect className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] flex items-center justify-between p-2 w-[94%] max-w-[420px] md:hidden rounded-[100px]">
        {/* Home */}
        <Link href="/" className={`flex flex-col items-center justify-center gap-1 w-[72px] h-14 rounded-full transition-all duration-300 ${isHomeActive ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'text-black/80 hover:text-black'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isHomeActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isHomeActive ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round">
            {isHomeActive ? (
               <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            ) : (
              <>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </>
            )}
          </svg>
          <span className="text-[10px] font-semibold tracking-wide">Home</span>
        </Link>

        {/* Wishlist */}
        <Link href="/wishlist" className={`flex flex-col items-center justify-center gap-1 w-[72px] h-14 rounded-full transition-all duration-300 ${isWishlistActive ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'text-black/80 hover:text-black'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlistActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isWishlistActive ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-[10px] font-semibold tracking-wide">Wishlist</span>
        </Link>

        {/* Cart */}
        <button onClick={toggleCart} className="flex flex-col items-center justify-center gap-1 w-[72px] h-14 rounded-full transition-all duration-300 text-black/80 hover:text-black relative">
          <div className="relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {totalItems > 0 && <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-md border border-white dark:border-neutral-900">{totalItems}</span>}
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Cart</span>
        </button>

        {/* Account */}
        <Link href={user ? "/profile" : "/auth"} className={`flex flex-col items-center justify-center gap-1 w-[72px] h-14 rounded-full transition-all duration-300 ${isAccountActive ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'text-black/80 hover:text-black'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isAccountActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isAccountActive ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-[10px] font-semibold tracking-wide">Account</span>
        </Link>
      </GlassEffect>
    </>
  );
}
