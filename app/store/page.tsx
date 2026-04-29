'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import GlobalSearch from '@/components/GlobalSearch';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import Footer from '@/components/Footer';

export default function StorePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="top-bar-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }}>
        <AnnouncementBar />
        <Header
          onMenuOpen={() => setMobileMenuOpen(true)}
          onSearchOpen={() => setIsSearchOpen(true)}
        />
      </div>
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <style dangerouslySetInnerHTML={{
        __html: `
        @font-face {
            font-family: "Helvetica Regular";
            src: url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot");
            src: url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot?#iefix")format("embedded-opentype"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff2")format("woff2"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff")format("woff"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.ttf")format("truetype"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.svg#Helvetica Regular")format("svg");
        }
        .store-page {
          font-family: "Helvetica Regular", ui-sans-serif, system-ui, sans-serif;
          background-color: #F8F6F3;
          margin: 0;
          overflow-x: hidden;
        }
        .clip-slant-right {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 100%);
        }
        .clip-slant-left {
          clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);
        }
        @media (max-width: 1023px) {
          .clip-slant-right, .clip-slant-left {
            clip-path: none;
          }
        }
        .premium-glass-card {
          background: linear-gradient(135deg, rgba(253, 251, 249, 0.95) 0%, rgba(244, 239, 235, 0.85) 100%);
          border: 8px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .store-btn {
          position: relative;
          display: inline-block;
          cursor: pointer;
          outline: none;
          border: 0;
          vertical-align: middle;
          text-decoration: none;
          background: transparent;
          padding: 0;
          font-size: inherit;
          font-family: inherit;
          width: 12rem;
          height: 3rem;
        }
        .store-btn .circle {
          transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
          position: relative;
          display: block;
          margin: 0;
          width: 3rem;
          height: 3rem;
          background: #1C1F1C;
          border-radius: 1.625rem;
        }
        .store-btn .icon {
          transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          background: #fff;
        }
        .store-btn .icon.arrow {
          transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
          left: 0.625rem;
          width: 1.125rem;
          height: 0.125rem;
          background: none;
        }
        .store-btn .icon.arrow::before {
          position: absolute;
          content: '';
          top: -0.29rem;
          right: 0.0625rem;
          width: 0.625rem;
          height: 0.625rem;
          border-top: 0.125rem solid #fff;
          border-right: 0.125rem solid #fff;
          transform: rotate(45deg);
        }
        .store-btn .btn-text {
          transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0.75rem 0;
          margin: 0 0 0 1.85rem;
          color: #1C1F1C;
          font-weight: 700;
          line-height: 1.6;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.75rem;
        }
        .store-btn:hover .circle {
          width: 100%;
        }
        .store-btn:hover .icon.arrow {
          background: #fff;
          transform: translate(1rem, 0);
        }
        .store-btn:hover .btn-text {
          color: #fff;
        }
      `}} />

      <main className="store-page min-h-screen">
        {/* ═══ Hero Video Section ═══ */}
        <div className="w-full h-[100svh] flex items-center justify-center p-3 md:p-5 bg-[#F8F6F3]">
          <section className="relative w-full max-w-[1600px] h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-black/30 z-[1]" />
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
              src="/assets/mp_.mp4"
            />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-20">
              <div className="w-full flex flex-col items-center text-center max-w-5xl px-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-normal text-white mb-6 tracking-tight leading-[1.1]"
                  style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
                >
                  Experience the Essence
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl font-light mb-10"
                >
                  A legacy of authentic Arabian perfumery. Discover the timeless art of fragrance at Rahmani Perfumery, where every scent tells a story of heritage and luxury.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <button
                    onClick={() => {
                      const storesSection = document.getElementById('our-stores');
                      if (storesSection) {
                        storesSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                      }
                    }}
                    className="px-8 py-3.5 border border-[#888888] text-white text-[13px] tracking-[0.2em] uppercase font-medium hover:bg-white hover:text-black transition-colors duration-300 backdrop-blur-sm"
                  >
                    OUR SHOPS
                  </button>
                </motion.div>
              </div>
            </div>


          </section>
        </div>

        {/* ═══ Ultra Premium Stores Section ═══ */}
        <section id="our-stores" className="relative py-32 md:py-48 px-6 lg:px-12 bg-[#F6F8F6] overflow-hidden flex flex-col items-center">

          {/* Subtle glowing orbs in background - greenish tint */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#E5ECE5]/60 blur-[120px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E5ECE5]/50 blur-[120px]" />
          </div>

          <div className="w-full max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">

            {/* ── Section Title ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center text-center mb-20 md:mb-32 w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-[#8B9B8B]" />
                <span className="text-xs tracking-[0.35em] uppercase text-[#8B9B8B] font-semibold">  </span>
                <div className="w-12 h-[1px] bg-[#8B9B8B]" />
              </div>
              <h2
                className="text-5xl md:text-7xl text-[#1C1F1C] mb-6 leading-[1.1] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif', fontWeight: 500 }}
              >
                Visit Our Stores
              </h2>
              <p className="text-[#6D756D] text-base md:text-lg max-w-[460px] leading-relaxed mx-auto">
                Step into our world of artisanal fragrances. Discover meticulously handcrafted attars in spaces designed to inspire your senses.
              </p>
            </motion.div>

            {/* ── Store Cards Container ── */}
            <div className="flex flex-col items-center gap-12 md:gap-20 w-full">

              {/* Card 1: Phulwari Sharif */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 28px 70px 0 rgba(30, 60, 35, 0.18), inset 0 1px 2px 0 rgba(255,255,255,0.95)'
                }}
                style={{
                  background: 'linear-gradient(145deg, rgba(240,250,243,0.85) 0%, rgba(255,255,255,0.55) 40%, rgba(230,248,238,0.4) 100%)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  boxShadow: '0 8px 32px 0 rgba(30,60,35,0.07), inset 0 1.5px 1.5px 0 rgba(255,255,255,0.9)',
                  border: '1.5px solid rgba(200, 230, 210, 0.7)'
                }}
                className="group relative flex flex-col lg:flex-row w-full max-w-[1200px] p-4 md:p-6 lg:p-8 rounded-[40px] transition-all duration-500 mx-auto"
              >
                {/* Left Side: Info */}
                <div className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center p-8 md:p-12 lg:pr-12 lg:pl-12 z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#E0E8E2] w-fit mb-8 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#5C6E5C]" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C6E5C] font-bold">Phulwari</span>
                  </div>

                  <h3
                    className="text-4xl md:text-5xl lg:text-[52px] leading-[1.08] mb-6"
                    style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600, color: '#1a2e20', letterSpacing: '-0.01em' }}
                  >
                    Phulwari<br />Sharif
                  </h3>

                  <p className="text-[#5a6b5c] text-[15px] md:text-base leading-[1.85] mb-12 max-w-[340px] mx-auto">
                    A serene destination where tradition meets timeless fragrance. Immerse yourself in our signature collections and bespoke blends.
                  </p>

                  <Link href="#">
                    <button className="store-btn">
                      <span className="circle" aria-hidden="true">
                        <span className="icon arrow" />
                      </span>
                      <span className="btn-text">Explore Store</span>
                    </button>
                  </Link>
                </div>

                {/* Right Side: Image with Slant Cut */}
                <div className="w-full lg:w-1/2 h-[350px] lg:h-[500px] relative rounded-[28px] overflow-hidden">
                  <div
                    className="absolute inset-0 w-full h-full transform transition-transform duration-[1.2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-105"
                    style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
                  >
                    <img
                      src="/assets/store-phulwari.png"
                      alt="Phulwari Sharif Store"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Subtle Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F1C]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Sabzibagh */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 28px 70px 0 rgba(25, 50, 80, 0.18), inset 0 1px 2px 0 rgba(255,255,255,0.95)'
                }}
                style={{
                  background: 'linear-gradient(145deg, rgba(238,245,255,0.85) 0%, rgba(255,255,255,0.55) 40%, rgba(225,238,255,0.4) 100%)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  boxShadow: '0 8px 32px 0 rgba(25,50,80,0.07), inset 0 1.5px 1.5px 0 rgba(255,255,255,0.9)',
                  border: '1.5px solid rgba(180, 210, 240, 0.7)'
                }}
                className="group relative flex flex-col lg:flex-row w-full max-w-[1200px] p-4 md:p-6 lg:p-8 rounded-[40px] transition-all duration-500 mx-auto"
              >
                {/* Left Side: Info */}
                <div className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center p-8 md:p-12 lg:pr-12 lg:pl-12 z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#E0E8E2] w-fit mb-8 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#5C6E5C]" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#5C6E5C] font-bold">Sabzibagh</span>
                  </div>

                  <h3
                    className="text-4xl md:text-5xl lg:text-[52px] leading-[1.08] mb-6"
                    style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600, color: '#1a2030', letterSpacing: '-0.01em' }}
                  >
                    Sabzibagh
                  </h3>

                  <p className="text-[#5a6070] text-[15px] md:text-base leading-[1.85] mb-12 max-w-[340px] mx-auto">
                    Experience handcrafted attars in a space designed for fragrance lovers. Discover exclusive collections and personalized recommendations.
                  </p>

                  <Link href="#">
                    <button className="store-btn">
                      <span className="circle" aria-hidden="true">
                        <span className="icon arrow" />
                      </span>
                      <span className="btn-text">Explore Store</span>
                    </button>
                  </Link>
                </div>

                {/* Right Side: Image with Slant Cut */}
                <div className="w-full lg:w-1/2 h-[350px] lg:h-[500px] relative rounded-[28px] overflow-hidden">
                  <div
                    className="absolute inset-0 w-full h-full transform transition-transform duration-[1.2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-105"
                    style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
                  >
                    <img
                      src="/assets/store-sabzibagh.png"
                      alt="Sabzibagh Store"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Subtle Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F1C]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
