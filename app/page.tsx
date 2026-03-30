'use client';
import { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesBar from '@/components/FeaturesBar';
import ProductGrid from '@/components/ProductGrid';
import FeaturedCategories from '@/components/FeaturedCategories';
import ReelsSection from '@/components/ReelsSection';
import BentoCategories from '@/components/BentoCategories';
import BannerSlider from '@/components/BannerSlider';
import ShopByOccasion from '@/components/ShopByOccasion';
import PerfumeJourney from '@/components/PerfumeJourney';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Sticky top bar */}
      <AnnouncementBar />
      {/* Sticky header below announcement bar */}
      <Header onMenuOpen={() => setMobileMenuOpen(true)} />

      {/* Full-width hero - no margin top needed, natural flow */}
      <main>
        <HeroSection />
        <FeaturesBar />
        <ProductGrid />
        <FeaturedCategories />
        <ReelsSection />
        <BentoCategories />
        <BannerSlider />
        <ShopByOccasion />
        <PerfumeJourney />
        <Testimonials />
        <Newsletter />
        <Footer />
      </main>

      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
