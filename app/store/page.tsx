'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, MapPin, Phone, Clock, Eye, Droplet, Tag, ShieldCheck } from 'lucide-react';
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
        .store-btn-green .circle {
          background: #2B4C33;
        }
        .store-btn-green .btn-text {
          color: #2B4C33;
        }
        @keyframes floralFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(3deg); }
          50% { transform: translateY(-4px) rotate(-2deg); }
          75% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes floralFloatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg) scaleX(-1); }
          25% { transform: translateY(-10px) rotate(-3deg) scaleX(-1); }
          50% { transform: translateY(-4px) rotate(2deg) scaleX(-1); }
          75% { transform: translateY(-8px) rotate(-2deg) scaleX(-1); }
        }
        @keyframes floralPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        @keyframes floralSway {
          0%, 100% { transform: rotate(-5deg) translateX(0); }
          50% { transform: rotate(5deg) translateX(4px); }
        }
        @keyframes floralSwayReverse {
          0%, 100% { transform: rotate(5deg) translateX(0) scaleX(-1); }
          50% { transform: rotate(-5deg) translateX(-4px) scaleX(-1); }
        }
        .floral-left { animation: floralFloat 6s ease-in-out infinite; }
        .floral-right { animation: floralFloatReverse 6s ease-in-out infinite; }
        .floral-accent-left { animation: floralSway 5s ease-in-out infinite; }
        .floral-accent-right { animation: floralSwayReverse 5s ease-in-out infinite; }
        .floral-glow { animation: floralPulse 4s ease-in-out infinite; }
      `}} />

      <main className="store-page min-h-screen">
        {/* ═══ Hero Video Section ═══ */}
        <div className="w-full h-[100svh] flex items-center justify-center p-3 md:p-5 bg-[#F8F6F3]">
          <section className="relative w-full max-w-[1600px] h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-black/30 z-[1]" />
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
              src="/assets/our_store_vid.mp4"
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
        <section id="our-stores" className="relative py-24 sm:py-32 md:py-44 px-4 sm:px-6 lg:px-12 bg-[#F6F8F6] overflow-hidden flex flex-col items-center">

          {/* Subtle glowing orbs in background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#E5ECE5]/60 blur-[120px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E5ECE5]/50 blur-[120px]" />
          </div>

          <div className="w-full max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">

            {/* ── Section Title with Animated Florals ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 mb-16 sm:mb-20 md:mb-28 w-full py-6 relative"
            >
              {/* Left Floral Ornament */}
              <div className="relative w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 flex-shrink-0">
                {/* Main floral branch */}
                <svg className="floral-left absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none">
                  <path d="M100 60 C85 45, 70 35, 55 40 C40 45, 35 55, 40 65 C45 75, 55 78, 65 72 C75 66, 72 56, 62 52" stroke="#c4a46c" strokeWidth="1.2" fill="none" opacity="0.5" />
                  <circle cx="55" cy="40" r="6" fill="none" stroke="#c4a46c" strokeWidth="0.8" opacity="0.4" />
                  <circle cx="40" cy="65" r="5" fill="none" stroke="#c4a46c" strokeWidth="0.8" opacity="0.35" />
                  <circle cx="65" cy="72" r="4" fill="none" stroke="#c4a46c" strokeWidth="0.8" opacity="0.3" />
                  <path d="M55 40 C50 30, 42 28, 38 33" stroke="#c4a46c" strokeWidth="0.8" fill="none" opacity="0.35" />
                  <path d="M40 65 C30 62, 25 55, 28 48" stroke="#c4a46c" strokeWidth="0.8" fill="none" opacity="0.3" />
                </svg>
                {/* Accent petals */}
                <svg className="floral-accent-left absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none">
                  <ellipse cx="50" cy="50" rx="8" ry="12" fill="#c4a46c" opacity="0.08" transform="rotate(-30 50 50)" />
                  <ellipse cx="60" cy="65" rx="6" ry="10" fill="#c4a46c" opacity="0.06" transform="rotate(20 60 65)" />
                  <ellipse cx="38" cy="55" rx="5" ry="9" fill="#c4a46c" opacity="0.07" transform="rotate(-45 38 55)" />
                </svg>
                {/* Glowing dot */}
                <div className="floral-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#c4a46c]/20 blur-[2px]" />
              </div>

              {/* Title */}
              <h2
                className="text-[2.8rem] sm:text-[3.5rem] md:text-[5.5rem] text-[#1C1F1C] leading-[1.15] tracking-[0.15em] uppercase text-center"
                style={{ fontFamily: '"Didot", "Playfair Display", "Bodoni Moda", Georgia, serif', fontWeight: 400, letterSpacing: '0.18em' }}
              >
                OUR STORES
              </h2>

              {/* Right Floral Ornament (mirrored) */}
              <div className="relative w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 flex-shrink-0">
                {/* Main floral branch - mirrored */}
                <svg className="floral-right absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none">
                  <path d="M100 60 C85 45, 70 35, 55 40 C40 45, 35 55, 40 65 C45 75, 55 78, 65 72 C75 66, 72 56, 62 52" stroke="#c4a46c" strokeWidth="1.2" fill="none" opacity="0.5" />
                  <circle cx="55" cy="40" r="6" fill="none" stroke="#c4a46c" strokeWidth="0.8" opacity="0.4" />
                  <circle cx="40" cy="65" r="5" fill="none" stroke="#c4a46c" strokeWidth="0.8" opacity="0.35" />
                  <circle cx="65" cy="72" r="4" fill="none" stroke="#c4a46c" strokeWidth="0.8" opacity="0.3" />
                  <path d="M55 40 C50 30, 42 28, 38 33" stroke="#c4a46c" strokeWidth="0.8" fill="none" opacity="0.35" />
                  <path d="M40 65 C30 62, 25 55, 28 48" stroke="#c4a46c" strokeWidth="0.8" fill="none" opacity="0.3" />
                </svg>
                {/* Accent petals - mirrored */}
                <svg className="floral-accent-right absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none">
                  <ellipse cx="50" cy="50" rx="8" ry="12" fill="#c4a46c" opacity="0.08" transform="rotate(-30 50 50)" />
                  <ellipse cx="60" cy="65" rx="6" ry="10" fill="#c4a46c" opacity="0.06" transform="rotate(20 60 65)" />
                  <ellipse cx="38" cy="55" rx="5" ry="9" fill="#c4a46c" opacity="0.07" transform="rotate(-45 38 55)" />
                </svg>
                {/* Glowing dot */}
                <div className="floral-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#c4a46c]/20 blur-[2px]" />
              </div>
            </motion.div>

            {/* ── Store Cards Container ── */}
            <div className="flex flex-col items-center gap-12 md:gap-20 w-full">

              {/* Card 1: Phulwari Sharif */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 32px 80px 0 rgba(30, 60, 35, 0.22), 0 12px 24px 0 rgba(30,60,35,0.08), inset 0 1px 2px 0 rgba(255,255,255,0.95)'
                }}
                style={{
                  background: 'linear-gradient(145deg, rgba(240,250,243,0.9) 0%, rgba(255,255,255,0.6) 40%, rgba(230,248,238,0.45) 100%)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  boxShadow: '0 12px 40px 0 rgba(30,60,35,0.1), 0 4px 12px 0 rgba(30,60,35,0.05), inset 0 1.5px 1.5px 0 rgba(255,255,255,0.9)',
                  border: '1.5px solid rgba(200, 230, 210, 0.7)'
                }}
                className="group relative flex flex-col-reverse lg:flex-row w-full max-w-[1200px] p-2 sm:p-4 md:p-6 lg:p-8 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] transition-all duration-500 mx-auto"
              >
                {/* Left Side: Info */}
                <div className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center p-4 sm:p-8 md:p-10 lg:p-12 z-10">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 border border-[#E0E8E2] mb-4 sm:mb-8 shadow-sm">
                    <MapPin className="w-4 h-4 text-[#5C6E5C]" />
                  </div>

                  <h3
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.08] mb-4 sm:mb-6"
                    style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600, color: '#1a2e20', letterSpacing: '-0.01em' }}
                  >
                    Phulwari<br />Sharif
                  </h3>

                  <p className="text-[#5a6b5c] text-sm sm:text-[15px] md:text-base leading-[1.85] mb-6 sm:mb-8 max-w-[340px] mx-auto">
                    A serene destination where tradition meets timeless fragrance. Immerse yourself in our signature collections and bespoke blends.
                  </p>

                  {/* Store Details */}
                  <div className="flex flex-col gap-4 mb-8 sm:mb-10 w-full max-w-[340px] mx-auto">
                    <div className="flex items-center gap-3.5 text-left">
                      <MapPin className="w-[18px] h-[18px] text-[#b8955a] flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[#3a4a3c] text-[13px] sm:text-sm font-semibold leading-snug">Phulwari Sharif, Patna, Bihar 801505</span>
                    </div>
                    <div className="flex items-center gap-3.5 text-left">
                      <Phone className="w-[18px] h-[18px] text-[#b8955a] flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[#3a4a3c] text-[13px] sm:text-sm font-semibold">+91 8340783679</span>
                    </div>
                    <div className="flex items-center gap-3.5 text-left">
                      <Clock className="w-[18px] h-[18px] text-[#b8955a] flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[#3a4a3c] text-[13px] sm:text-sm font-semibold">10:00 AM – 9:00 PM, Mon – Sat</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10 sm:mt-14">
                    <Link href="#">
                      <button className="store-btn">
                        <span className="circle" aria-hidden="true">
                          <span className="icon arrow" />
                        </span>
                        <span className="btn-text">Explore Store</span>
                      </button>
                    </Link>
                    <a href="tel:+918340783679">
                      <button className="store-btn store-btn-green">
                        <span className="circle" aria-hidden="true">
                          <span className="icon arrow" />
                        </span>
                        <span className="btn-text">Call Now</span>
                      </button>
                    </a>
                  </div>
                </div>

                {/* Right Side: Image with Slant Cut */}
                <div className="w-full lg:w-1/2 h-[220px] sm:h-[320px] lg:h-[500px] relative rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] overflow-hidden mb-4 lg:mb-0">
                  <div
                    className="absolute inset-0 w-full h-full transform transition-transform duration-[1.2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-105 clip-slant-right"
                  >
                    <img
                      src="/assets/phulwari%20interior.jpeg"
                      alt="Phulwari Sharif Store"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F1C]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Sabzibagh */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 32px 80px 0 rgba(25, 50, 80, 0.22), 0 12px 24px 0 rgba(25,50,80,0.08), inset 0 1px 2px 0 rgba(255,255,255,0.95)'
                }}
                style={{
                  background: 'linear-gradient(145deg, rgba(238,245,255,0.9) 0%, rgba(255,255,255,0.6) 40%, rgba(225,238,255,0.45) 100%)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  boxShadow: '0 12px 40px 0 rgba(25,50,80,0.1), 0 4px 12px 0 rgba(25,50,80,0.05), inset 0 1.5px 1.5px 0 rgba(255,255,255,0.9)',
                  border: '1.5px solid rgba(180, 210, 240, 0.7)'
                }}
                className="group relative flex flex-col-reverse lg:flex-row w-full max-w-[1200px] p-2 sm:p-4 md:p-6 lg:p-8 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] transition-all duration-500 mx-auto"
              >
                {/* Left Side: Info */}
                <div className="w-full lg:w-1/2 flex flex-col items-center text-center justify-center p-4 sm:p-8 md:p-10 lg:p-12 z-10">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 border border-[#E0E8E2] mb-4 sm:mb-8 shadow-sm">
                    <MapPin className="w-4 h-4 text-[#5C6E5C]" />
                  </div>

                  <h3
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.08] mb-4 sm:mb-6"
                    style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600, color: '#1a2030', letterSpacing: '-0.01em' }}
                  >
                    Sabzibagh
                  </h3>

                  <p className="text-[#5a6070] text-sm sm:text-[15px] md:text-base leading-[1.85] mb-6 sm:mb-8 max-w-[340px] mx-auto">
                    Experience handcrafted attars in a space designed for fragrance lovers. Discover exclusive collections and personalized recommendations.
                  </p>

                  {/* Store Details */}
                  <div className="flex flex-col gap-4 mb-8 sm:mb-10 w-full max-w-[340px] mx-auto">
                    <div className="flex items-center gap-3.5 text-left">
                      <MapPin className="w-[18px] h-[18px] text-[#b8955a] flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[#3a4060] text-[13px] sm:text-sm font-semibold leading-snug">Sabzibagh, Patna, Bihar 800004</span>
                    </div>
                    <div className="flex items-center gap-3.5 text-left">
                      <Phone className="w-[18px] h-[18px] text-[#b8955a] flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[#3a4060] text-[13px] sm:text-sm font-semibold">+91 7484878288</span>
                    </div>
                    <div className="flex items-center gap-3.5 text-left">
                      <Clock className="w-[18px] h-[18px] text-[#b8955a] flex-shrink-0" strokeWidth={1.8} />
                      <span className="text-[#3a4060] text-[13px] sm:text-sm font-semibold">10:00 AM – 9:00 PM, Mon – Sat</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10 sm:mt-14">
                    <Link href="#">
                      <button className="store-btn">
                        <span className="circle" aria-hidden="true">
                          <span className="icon arrow" />
                        </span>
                        <span className="btn-text">Explore Store</span>
                      </button>
                    </Link>
                    <a href="tel:+917484878288">
                      <button className="store-btn store-btn-green">
                        <span className="circle" aria-hidden="true">
                          <span className="icon arrow" />
                        </span>
                        <span className="btn-text">Call Now</span>
                      </button>
                    </a>
                  </div>
                </div>

                {/* Right Side: Image with Slant Cut */}
                <div className="w-full lg:w-1/2 h-[220px] sm:h-[320px] lg:h-[500px] relative rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] overflow-hidden mb-4 lg:mb-0">
                  <div
                    className="absolute inset-0 w-full h-full transform transition-transform duration-[1.2s] ease-[0.25,0.46,0.45,0.94] group-hover:scale-105 clip-slant-right"
                  >
                    <img
                      src="/assets/sabjibagh%20interior.jpeg"
                      alt="Sabzibagh Store"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F1C]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* ── Cream In-Store Exclusive Section ── */}
        <section className="relative w-full bg-gradient-to-b from-[#FDFBF7] to-[#F1EBE1] py-24 sm:py-32 md:py-40 overflow-hidden flex flex-col items-center">
          
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Fully Centered Header */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex justify-center text-center w-full mt-10 mb-24 sm:mb-32"
            >
              <h2 
                className="text-4xl sm:text-5xl md:text-[64px] text-[#1c1a18] w-full leading-tight uppercase tracking-widest font-bold"
                style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", serif' }}
              >
                In-Store <span className="text-[#C62828]">Exclusive</span>
              </h2>
            </motion.div>

            {/* 4 Centered Symmetrical Cards (Always visible images with day/night hover effect) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
              
              {/* Card 1: Experience First */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="group relative h-[450px] sm:h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-700"
              >
                <div className="absolute inset-0 z-0">
                  <img src="/assets/minimal-boutique.png" alt="Experience First" className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-transparent group-hover:from-[#111] group-hover:via-[#111]/80 group-hover:to-[#111]/30 transition-colors duration-700" />
                  <div className="absolute inset-5 border border-[#c4a46c]/30 rounded-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                <div className="relative z-10 h-full flex flex-col p-8 text-center items-center justify-between">
                  <div className="w-full flex-1 flex items-center justify-center transform group-hover:-translate-y-4 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-full border border-[#d6c7b3] group-hover:border-[#c4a46c]/40 bg-white/60 group-hover:bg-[#111]/60 backdrop-blur-md flex items-center justify-center transition-colors duration-700">
                       <Eye className="w-6 h-6 text-[#8b7355] group-hover:text-[#c4a46c] transition-colors duration-700" />
                    </div>
                  </div>
                  <div className="w-full transform group-hover:-translate-y-2 transition-transform duration-700">
                    <h3 className="text-[#1c1a18] group-hover:text-white text-[13px] tracking-[0.25em] font-bold mb-4 uppercase transition-colors duration-700">Experience First</h3>
                    <div className="w-8 h-[1px] bg-[#d6c7b3] group-hover:bg-[#c4a46c]/50 mx-auto mb-4 transition-colors duration-700" />
                    <p className="text-[#5c534b] group-hover:text-[#ccc] text-[13px] leading-[1.8] transition-colors duration-700">
                      Unsure which fragrance matches your aura? Explore our complete collection in person before committing to your signature scent.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Exclusive Offers */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group relative h-[450px] sm:h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-700"
              >
                <div className="absolute inset-0 z-0">
                  <img src="/assets/minimal-perfume.png" alt="Exclusive Offers" className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-transparent group-hover:from-[#111] group-hover:via-[#111]/80 group-hover:to-[#111]/30 transition-colors duration-700" />
                  <div className="absolute inset-5 border border-[#c4a46c]/30 rounded-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                <div className="relative z-10 h-full flex flex-col p-8 text-center items-center justify-between">
                  <div className="w-full flex-1 flex items-center justify-center transform group-hover:-translate-y-4 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-full border border-[#d6c7b3] group-hover:border-[#c4a46c]/40 bg-white/60 group-hover:bg-[#111]/60 backdrop-blur-md flex items-center justify-center transition-colors duration-700">
                       <Tag className="w-6 h-6 text-[#8b7355] group-hover:text-[#c4a46c] transition-colors duration-700" />
                    </div>
                  </div>
                  <div className="w-full transform group-hover:-translate-y-2 transition-transform duration-700">
                    <h3 className="text-[#1c1a18] group-hover:text-white text-[13px] tracking-[0.25em] font-bold mb-4 uppercase transition-colors duration-700">Exclusive Offers</h3>
                    <div className="w-8 h-[1px] bg-[#d6c7b3] group-hover:bg-[#c4a46c]/50 mx-auto mb-4 transition-colors duration-700" />
                    <p className="text-[#5c534b] group-hover:text-[#ccc] text-[13px] leading-[1.8] transition-colors duration-700">
                      Enjoy special walk-in discounts, bundle deals, and complimentary samples strictly reserved for physical store visitors.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Premium Certified */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="group relative h-[450px] sm:h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-700"
              >
                <div className="absolute inset-0 z-0">
                  <img src="/assets/minimal-oud.png" alt="Premium Certified" className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-transparent group-hover:from-[#111] group-hover:via-[#111]/80 group-hover:to-[#111]/30 transition-colors duration-700" />
                  <div className="absolute inset-5 border border-[#c4a46c]/30 rounded-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                <div className="relative z-10 h-full flex flex-col p-8 text-center items-center justify-between">
                  <div className="w-full flex-1 flex items-center justify-center transform group-hover:-translate-y-4 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-full border border-[#d6c7b3] group-hover:border-[#c4a46c]/40 bg-white/60 group-hover:bg-[#111]/60 backdrop-blur-md flex items-center justify-center transition-colors duration-700">
                       <ShieldCheck className="w-6 h-6 text-[#8b7355] group-hover:text-[#c4a46c] transition-colors duration-700" />
                    </div>
                  </div>
                  <div className="w-full transform group-hover:-translate-y-2 transition-transform duration-700">
                    <h3 className="text-[#1c1a18] group-hover:text-white text-[13px] tracking-[0.25em] font-bold mb-4 uppercase transition-colors duration-700">Premium Certified</h3>
                    <div className="w-8 h-[1px] bg-[#d6c7b3] group-hover:bg-[#c4a46c]/50 mx-auto mb-4 transition-colors duration-700" />
                    <p className="text-[#5c534b] group-hover:text-[#ccc] text-[13px] leading-[1.8] transition-colors duration-700">
                      Every drop of our oud and musk is 100% authentic and ethically sourced. We guarantee purely premium fragrance oils.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Test On Skin */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="group relative h-[450px] sm:h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-700"
              >
                <div className="absolute inset-0 z-0">
                  <img src="/assets/minimal-skin.png" alt="Test on Skin" className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-transparent group-hover:from-[#111] group-hover:via-[#111]/80 group-hover:to-[#111]/30 transition-colors duration-700" />
                  <div className="absolute inset-5 border border-[#c4a46c]/30 rounded-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                <div className="relative z-10 h-full flex flex-col p-8 text-center items-center justify-between">
                  <div className="w-full flex-1 flex items-center justify-center transform group-hover:-translate-y-4 transition-transform duration-700">
                    <div className="w-16 h-16 rounded-full border border-[#d6c7b3] group-hover:border-[#c4a46c]/40 bg-white/60 group-hover:bg-[#111]/60 backdrop-blur-md flex items-center justify-center transition-colors duration-700">
                       <Droplet className="w-6 h-6 text-[#8b7355] group-hover:text-[#c4a46c] transition-colors duration-700" />
                    </div>
                  </div>
                  <div className="w-full transform group-hover:-translate-y-2 transition-transform duration-700">
                    <h3 className="text-[#1c1a18] group-hover:text-white text-[13px] tracking-[0.25em] font-bold mb-4 uppercase transition-colors duration-700">Test On Skin</h3>
                    <div className="w-8 h-[1px] bg-[#d6c7b3] group-hover:bg-[#c4a46c]/50 mx-auto mb-4 transition-colors duration-700" />
                    <p className="text-[#5c534b] group-hover:text-[#ccc] text-[13px] leading-[1.8] transition-colors duration-700">
                      Test the longevity and projection on your own skin. See exactly how the notes evolve with your unique body chemistry.
                    </p>
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
