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
import BestSellers from '@/components/BestSellers';
import BottleCarousel from '@/components/BottleCarousel';
import ContactSection from '@/components/ContactSection';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Fixed overlay: announcement + header sit on top of hero */}
      <div className="top-bar-overlay">
        <AnnouncementBar />
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      </div>

      {/* Full-screen hero with header overlapping */}
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
