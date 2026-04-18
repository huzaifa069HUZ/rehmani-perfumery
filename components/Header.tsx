'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuOpen: () => void;
  onSearchOpen: () => void;
}

export default function Header({ onMenuOpen, onSearchOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const [homeHover, setHomeHover] = useState(false);
  const [attarsHover, setAttarsHover] = useState(false);

  const logoSrc = '/assets/logo with name removed bg.png';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll(); // Trigger instantly on load
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolled = !isHome || scrolled;

  return (
    <>
      <header id="main-header" className={`main-header${isScrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          {/* Mobile Menu Button - Moved to front for flex ordering on mobile */}
          <button id="mobile-menu-btn" className="icon-btn mobile-only modern-menu-btn" onClick={onMenuOpen} aria-label="Menu" style={{ zIndex: 10 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease-in-out' }}>
              <path d="M4 7h16" />
              <path d="M4 12h10" />
              <path d="M4 17h14" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="logo-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Rahmani Perfumery"
              className="header-logo-img"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <div 
              className="nav-item group"
              onMouseEnter={() => setHomeHover(true)}
              onMouseLeave={() => setHomeHover(false)}
            >
              <Link href="/" className={`nav-link${isHome ? ' active' : ''} flex items-center`}>
                HOME
                <svg className="nav-chevron transition-transform duration-300" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', marginTop: '1px' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
              <AnimatePresence>
                {homeHover && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="nav-dropdown"
                  >
                    <Link href="/#bestsellers" className="nav-dropdown-item">Best Seller</Link>
                    <Link href="/#signature" className="nav-dropdown-item">Signature Collection</Link>
                    <Link href="/#reels" className="nav-dropdown-item">Trending on Insta</Link>
                    <Link href="/#contact" className="nav-dropdown-item">Our Location</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div 
              className="nav-item group"
              onMouseEnter={() => setAttarsHover(true)}
              onMouseLeave={() => setAttarsHover(false)}
            >
              <Link href="/attars" className={`nav-link${pathname === '/attars' ? ' active' : ''} flex items-center`}>
                ATTARS
                <svg className="nav-chevron transition-transform duration-300" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', marginTop: '1px' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
              <AnimatePresence>
                {attarsHover && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="nav-dropdown"
                  >
                    <span className="nav-dropdown-category">Categories</span>
                    <Link href="/attars?filter=men" className="nav-dropdown-item">Men&apos;s Collection</Link>
                    <Link href="/attars?filter=women" className="nav-dropdown-item">Women&apos;s Collection</Link>
                    <Link href="/attars?filter=unisex" className="nav-dropdown-item">Unisex Favorites</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/perfumes" className={`nav-link${pathname === '/perfumes' ? ' active' : ''} flex items-center`}>PERFUMES</Link>
            <Link href="/#about" className="nav-link flex items-center">ABOUT</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions" style={{ marginLeft: 'auto', zIndex: 10 }}>
            <Link href={user ? "/profile" : "/auth"} className="icon-btn hide-on-mobile-strict" aria-label={user ? "Profile" : "Login"} title={user ? "Profile" : "Login"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            <button className="icon-btn desktop-search-btn" aria-label="Search" onClick={onSearchOpen}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            
            <Link href="/wishlist" className="icon-btn wishlist-icon-btn hide-on-mobile-strict" aria-label="Wishlist" title="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {totalWishlistItems > 0 && (
                <span className="wishlist-badge">{totalWishlistItems}</span>
              )}
            </Link>
            <button id="cart-btn" className="icon-btn cart-icon-btn" onClick={toggleCart} aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <Link href="/attars" className="bottom-nav-item">
          <img src="/assets/home.png" alt="Shop" width="22" height="22" style={{ objectFit: 'contain' }} />
          <span>Shop</span>
        </Link>
        <Link href="/wishlist" className="bottom-nav-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Wishlist</span>
        </Link>
        <button onClick={toggleCart} className="bottom-nav-item">
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {totalItems > 0 && <span className="bottom-nav-badge">{totalItems}</span>}
          </div>
          <span>Cart</span>
        </button>
        <Link href={user ? "/profile" : "/auth"} className="bottom-nav-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>My account</span>
        </Link>
      </div>
    </>
  );
}

