'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';
import ScrollImageSequence from '@/components/ScrollImageSequence';
import AboutContentSection from '@/components/AboutContentSection';

export default function AboutUsClient() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVideoSection, setIsVideoSection] = useState(true);

  const handlePreloaderComplete = useCallback(() => setShowPreloader(false), []);

  useEffect(() => {
    const handleScroll = () => {
      // The video container is 400vh tall. We fade out transparency right before the white section hits the top.
      const threshold = window.innerHeight * 3.5;
      setIsVideoSection(window.scrollY < threshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <AnimatePresence>
        {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      {/* Fixed top bar - NO announcement bar, Header is transparent initially */}
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, transition: 'background 0.3s ease' }}>
        <Header
          onMenuOpen={() => setMobileMenuOpen(true)}
          onSearchOpen={() => setIsSearchOpen(true)}
          forceTransparent={isVideoSection}
        />
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main content — starting at the very top to underlay the transparent header */}
      <main>
        {/* SECTION 1: GSAP Canvas Image Sequence */}
        <ScrollImageSequence 
          frameCount={192} 
          framePrefix="/assets/about-sequence/ezgif-frame-" 
          frameSuffix=".jpg" 
        />

        {/* SECTION 2: White Content — naturally stacks over sticky hero */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: '300vh' }}>
          <AboutContentSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
