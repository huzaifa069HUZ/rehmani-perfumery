'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesBar from '@/components/FeaturesBar';
import ProductGrid from '@/components/ProductGrid';
import FeaturedCategories from '@/components/FeaturedCategories';
import PremiumBestSeller from '@/components/PremiumBestSeller';
import BentoCategories from '@/components/BentoCategories';
import BannerSlider from '@/components/BannerSlider';
import ShopByOccasion from '@/components/ShopByOccasion';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';

/* ── CSR-only lazy imports — heavy GPU/3D/map components ── */
const PerfumeJourney = dynamic(() => import('@/components/PerfumeJourney'), { ssr: false });
const BottleCarousel = dynamic(() => import('@/components/BottleCarousel'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/ContactSection'), { ssr: false });
const BestSellers = dynamic(() => import('@/components/BestSellers'), { ssr: false });
const LuxuryVideoSection = dynamic(() => import('@/components/LuxuryVideoSection'), { ssr: false });
const ReelsSection = dynamic(() => import('@/components/ReelsSection'), { ssr: false });

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Fixed overlay: announcement + header sit on top of hero */}
      <div className="top-bar-overlay">
        <AnnouncementBar />
        <Header 
          onMenuOpen={() => setMobileMenuOpen(true)} 
          onSearchOpen={() => setIsSearchOpen(true)}
        />
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Full-screen hero with header overlapping */}
      <main>
        <HeroSection />
        <FeaturesBar />
        <ProductGrid />
        <FeaturedCategories />
        <PremiumBestSeller />
        <LuxuryVideoSection />
        <ReelsSection />
        <BentoCategories />
        <BannerSlider />
        <ShopByOccasion />
        <PerfumeJourney />
        <BestSellers />
        <BottleCarousel />
        <ContactSection />
        <Testimonials />
        <Newsletter />
        <Footer />
      </main>

      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

