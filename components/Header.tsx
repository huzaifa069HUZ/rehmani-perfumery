'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuOpen: () => void;
  onSearchOpen: () => void;
}

export default function Header({ onMenuOpen, onSearchOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const logoSrc = '/assets/logo with name removed bg.png';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll(); // Trigger instantly on load
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolled = !isHome || scrolled;

  return (
    <header id="main-header" className={`main-header${isScrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
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
          <Link href="/" className={`nav-link${isHome ? ' active' : ''}`}>HOME</Link>
          <Link href="/attars" className={`nav-link${pathname === '/attars' ? ' active' : ''}`}>ATTARS</Link>
          <Link href="/perfumes" className={`nav-link${pathname === '/perfumes' ? ' active' : ''}`}>PERFUMES</Link>
          <Link href="/#about" className="nav-link">ABOUT</Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <Link href={user ? "/profile" : "/auth"} className="icon-btn" aria-label={user ? "Profile" : "Login"} title={user ? "Profile" : "Login"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          <button className="icon-btn" aria-label="Search" onClick={onSearchOpen}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          
          <Link href="/wishlist" className="icon-btn" aria-label="Wishlist" title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <button id="cart-btn" className="icon-btn cart-icon-btn" onClick={toggleCart} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
          <button id="mobile-menu-btn" className="icon-btn mobile-only" onClick={onMenuOpen} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

