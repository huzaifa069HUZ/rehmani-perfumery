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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="mm-backdrop" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.nav 
            className="mm-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <div className="mm-inner">
              <div className="mm-header-row">
                <Link href="/" onClick={onClose} className="mm-logo">
                  <img src="/assets/logo with name removed bg.png" alt="Rahmani Perfumery" />
                </Link>
                <button className="mm-close-btn" onClick={onClose} aria-label="Close menu">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="mm-scroll-area">
                {/* HOME Accordion */}
                <div className="mm-group">
                  <div className="mm-group-header" onClick={() => setHomeOpen(!homeOpen)}>
                    <Link href="/" className="mm-link" onClick={onClose}>HOME</Link>
                    <button className={`mm-toggle ${homeOpen ? 'open' : ''}`} aria-label="Toggle Home menu">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        className="mm-submenu"
                      >
                        <Link href="/#bestsellers" className="mm-sublink" onClick={onClose}>Best Seller</Link>
                        <Link href="/#signature" className="mm-sublink" onClick={onClose}>Signature Collection</Link>
                        <Link href="/#reels" className="mm-sublink" onClick={onClose}>Trending on Insta</Link>
                        <Link 
                          href="/#contact" 
                          className="mm-sublink" 
                          onClick={(e) => {
                            onClose();
                            if (window.location.pathname === '/') {
                              e.preventDefault();
                              const el = document.getElementById('contact');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                              else setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300);
                            }
                          }}
                        >
                          Our Location
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ATTARS Accordion */}
                <div className="mm-group">
                  <div className="mm-group-header" onClick={() => setAttarsOpen(!attarsOpen)}>
                    <Link href="/attars" className="mm-link" onClick={onClose}>ATTARS</Link>
                    <button className={`mm-toggle ${attarsOpen ? 'open' : ''}`} aria-label="Toggle Attars menu">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        className="mm-submenu"
                      >
                        <span className="mm-sublabel">Categories</span>
                        <Link href="/attars?filter=men" className="mm-sublink" onClick={onClose}>Men&apos;s Collection</Link>
                        <Link href="/attars?filter=women" className="mm-sublink" onClick={onClose}>Women&apos;s Collection</Link>
                        <Link href="/attars?filter=unisex" className="mm-sublink" onClick={onClose}>Unisex Favorites</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mm-group">
                  <div className="mm-group-header">
                    <Link href="/perfumes" className="mm-link" onClick={onClose}>PERFUMES</Link>
                  </div>
                </div>

                <div className="mm-group">
                  <div className="mm-group-header">
                    <Link href="/about" className="mm-link" onClick={onClose}>ABOUT</Link>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Area */}
              <div className="mm-footer">
                <p className="mm-footer-text">Need help deciding?</p>
                <div className="mm-support">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <a href="mailto:rahmaniperfumerypatna@gmail.com">Talk to our experts</a>
                </div>
              </div>
            </div>
            
            <style>{`
              .mm-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
                z-index: 9998;
              }
              .mm-drawer {
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                width: 85vw;
                max-width: 400px;
                background: linear-gradient(180deg, #120e0a 0%, #0a0805 100%);
                border-right: 1px solid rgba(212, 175, 55, 0.15);
                box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
              }
              .mm-inner {
                display: flex;
                flex-direction: column;
                height: 100%;
                position: relative;
                z-index: 2;
              }
              /* Gentle floral background overlay */
              .mm-drawer::after {
                content: '';
                position: absolute;
                inset: 0;
                background: url('/assets/floral-transparent-pattern.png') no-repeat center bottom;
                background-size: cover;
                opacity: 0.05;
                pointer-events: none;
                z-index: 1;
              }
              .mm-header-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px 24px 30px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              }
              .mm-logo img {
                height: 44px;
                width: auto;
                filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.3));
              }
              .mm-close-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #fff;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
              }
              .mm-close-btn:hover {
                background: rgba(212, 175, 55, 0.2);
                border-color: rgba(212, 175, 55, 0.5);
                color: var(--gold);
              }
              .mm-scroll-area {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
              }
              .mm-group {
                margin-bottom: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);
              }
              .mm-group-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                padding: 16px 0;
              }
              .mm-link {
                font-family: var(--font-cinzel), serif;
                font-size: 1.15rem;
                font-weight: 500;
                letter-spacing: 0.12em;
                color: #f8f8f8;
                text-decoration: none;
                transition: color 0.3s ease;
              }
              .mm-group-header:hover .mm-link {
                color: var(--gold);
              }
              .mm-toggle {
                color: rgba(255, 255, 255, 0.5);
                transition: transform 0.3s ease, color 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.03);
              }
              .mm-toggle.open {
                transform: rotate(180deg);
                color: var(--gold);
                background: rgba(212, 175, 55, 0.1);
              }
              .mm-submenu {
                padding: 0 0 16px 12px;
                margin-top: -4px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                border-left: 1px solid rgba(212, 175, 55, 0.2);
                margin-left: 8px;
                overflow: hidden;
              }
              .mm-sublabel {
                font-size: 0.7rem;
                font-weight: 700;
                color: rgba(212, 175, 55, 0.8);
                text-transform: uppercase;
                letter-spacing: 0.15em;
                margin-top: 8px;
                margin-bottom: 4px;
              }
              .mm-sublink {
                font-size: 0.95rem;
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
                transition: all 0.2s ease;
                position: relative;
                padding-left: 12px;
              }
              .mm-sublink::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--gold);
                opacity: 0;
                transition: opacity 0.2s ease;
              }
              .mm-sublink:hover, .mm-sublink:active {
                color: var(--gold);
              }
              .mm-sublink:hover::before {
                opacity: 1;
              }
              .mm-footer {
                padding: 30px 24px 40px;
                background: rgba(255, 255, 255, 0.02);
                border-top: 1px solid rgba(212, 175, 55, 0.1);
              }
              .mm-footer-text {
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.5);
                margin-bottom: 12px;
              }
              .mm-support {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .mm-support a {
                color: var(--gold);
                font-size: 0.9rem;
                font-weight: 500;
                text-decoration: none;
              }
            `}</style>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
