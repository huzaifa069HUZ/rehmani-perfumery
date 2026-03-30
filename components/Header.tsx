'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="main-header" className={`main-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        {/* Logo */}
        <a href="#" className="logo-text" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="rahmani Logo" width={42} height={63} style={{ objectFit: 'contain', height: '56px', width: 'auto' }} priority />
          <span>rahmani <span className="logo-gold">PERFUMERY</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <a href="#" className="nav-link active">HOME</a>
          <a href="#attars" className="nav-link">ATTARS</a>
          <a href="#collections" className="nav-link">COLLECTIONS</a>
          <a href="#about" className="nav-link">ABOUT</a>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {user ? (
            <button className="icon-btn" onClick={logout} aria-label="Logout" title="Logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          ) : (
            <Link href="/auth" className="icon-btn" aria-label="Login" title="Login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}

          <button className="icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
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
