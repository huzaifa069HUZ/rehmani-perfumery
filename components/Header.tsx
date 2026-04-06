'use client';
import { useState, useEffect, useRef } from 'react';
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
  const [logoSrc, setLogoSrc] = useState<string>('/logo-with-text.png');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Process logo to remove white background
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // Replace white/near-white pixels with transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If pixel is white or near-white (threshold 235+)
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0; // fully transparent
        }
        // Smooth transition for near-white pixels (220-235)
        else if (r > 220 && g > 220 && b > 220) {
          const avg = (r + g + b) / 3;
          data[i + 3] = Math.round(255 * (1 - (avg - 220) / 35));
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setLogoSrc(canvas.toDataURL('image/png'));
    };
    img.src = '/logo-with-text.png';
  }, []);

  return (
    <header id="main-header" className={`main-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        {/* Logo */}
        <a href="#" className="logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Rahmani Perfumery"
            className="header-logo-img"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <a href="/#" className="nav-link active">HOME</a>
          <Link href="/attars" className="nav-link">ATTARS</Link>
          <Link href="/perfumes" className="nav-link">PERFUMES</Link>
          <a href="/#about" className="nav-link">ABOUT</a>
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

