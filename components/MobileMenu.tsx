'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [homeOpen, setHomeOpen] = useState(false);
  const [attarsOpen, setAttarsOpen] = useState(false);

  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={onClose} />}
      <nav className={`mobile-menu${isOpen ? ' open' : ''}`}>
        <div className="mobile-menu-inner">
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <a href="#" className="mobile-menu-logo" onClick={onClose} style={{ display: 'block', marginBottom: '2rem' }}>
            <img src="/logo-with-text.png" alt="Rahmani Perfumery" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          </a>
          <div className="mobile-nav-links">
            {/* HOME Accordion */}
            <div className="mobile-nav-group">
              <div className="mobile-nav-header flex justify-between items-center w-full">
                <a href="/#" className="mobile-nav-link m-0" onClick={onClose}>HOME</a>
                <button 
                  className="mobile-dropdown-toggle p-2 text-gray-500" 
                  onClick={() => setHomeOpen(!homeOpen)}
                  aria-label="Toggle Home menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${homeOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
              <AnimatePresence>
                {homeOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden flex flex-col pl-4 border-l-2 border-[#d3a958]/30 ml-2 mt-2"
                  >
                    <a href="/#bestsellers" className="mobile-sub-link py-2 text-sm text-[var(--charcoal)] opacity-80" onClick={onClose}>Best Seller</a>
                    <a href="/#signature" className="mobile-sub-link py-2 text-sm text-[var(--charcoal)] opacity-80" onClick={onClose}>Signature Collection</a>
                    <a href="/#reels" className="mobile-sub-link py-2 text-sm text-[var(--charcoal)] opacity-80" onClick={onClose}>Trending on Insta</a>
                    <Link href="/contact" className="mobile-sub-link py-2 text-sm text-[var(--charcoal)] opacity-80" onClick={onClose}>Our Location</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ATTARS Accordion */}
            <div className="mobile-nav-group">
              <div className="mobile-nav-header flex justify-between items-center w-full">
                <Link href="/attars" className="mobile-nav-link m-0" onClick={onClose}>ATTARS</Link>
                <button 
                  className="mobile-dropdown-toggle p-2 text-gray-500" 
                  onClick={() => setAttarsOpen(!attarsOpen)}
                  aria-label="Toggle Attars menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${attarsOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
              <AnimatePresence>
                {attarsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden flex flex-col pl-4 border-l-2 border-[#d3a958]/30 ml-2 mt-2"
                  >
                    <span className="text-xs font-bold text-[#d3a958] uppercase tracking-wider py-1">Categories</span>
                    <Link href="/attars?filter=men" className="mobile-sub-link py-2 text-sm text-[var(--charcoal)] opacity-80" onClick={onClose}>Men&apos;s Collection</Link>
                    <Link href="/attars?filter=women" className="mobile-sub-link py-2 text-sm text-[var(--charcoal)] opacity-80" onClick={onClose}>Women&apos;s Collection</Link>
                    <Link href="/attars?filter=unisex" className="mobile-sub-link py-2 text-sm text-[var(--charcoal)] opacity-80" onClick={onClose}>Unisex Favorites</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/perfumes" className="mobile-nav-link mt-2" onClick={onClose}>PERFUMES</Link>
            <a href="/#about" className="mobile-nav-link" onClick={onClose}>ABOUT</a>
          </div>
        </div>
      </nav>
    </>
  );
}
