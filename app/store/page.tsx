'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, MapPin, Phone, Clock, Eye, Droplet, Tag, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  const [activeMap, setActiveMap] = useState<'phulwari' | 'sabzibagh'>('phulwari');
  const [activeExclusiveIndex, setActiveExclusiveIndex] = useState(0);
  
  // Auto-rotate exclusive cards every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExclusiveIndex((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2); transform: scale(1); }
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 0 50px rgba(255, 255, 255, 0.4); transform: scale(1.02); }
        }
        .btn-glow {
          animation: buttonGlow 2.5s ease-in-out infinite;
        }
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marqueeLeft 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight 40s linear infinite;
        }
        .text-stroke-transparent {
          -webkit-text-stroke: 2px rgba(248, 246, 243, 0.5);
          color: transparent;
        }
      `}} />

      <main className="store-page min-h-screen">
        {/* ═══ Hero Video Section ═══ */}
        <div className="relative w-full aspect-video h-auto bg-black flex flex-col items-center justify-center overflow-hidden mt-[70px] md:mt-0">
          <section className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-black/40 md:bg-black/20 z-[1]" />
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
              src="/assets/our_store_vid.mp4"
            />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8 md:pt-20 pb-4 md:pb-10">
              <div className="w-full flex flex-col items-center text-center max-w-5xl px-4 sm:px-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="hidden md:block text-3xl sm:text-5xl md:text-7xl lg:text-[90px] font-normal text-white mb-2 sm:mb-6 tracking-tight leading-[1.1] drop-shadow-xl"
                  style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
                >
                  Experience the Essence
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="hidden md:block text-xs sm:text-base md:text-xl text-white/90 leading-relaxed max-w-2xl font-light mb-4 sm:mb-12 drop-shadow-md"
                >
                  Visit any of our two stores in Patna to experience the true luxury of original attars.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="p-1 sm:p-3 border border-white/50 rounded-xl bg-white/10 backdrop-blur-md shadow-2xl">
                    <button
                      onClick={() => {
                        const storesSection = document.getElementById('our-stores');
                        if (storesSection) {
                          storesSection.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                        }
                      }}
                      className="btn-glow px-6 py-2.5 sm:px-14 sm:py-6 bg-white text-gray-800 text-[11px] sm:text-[18px] tracking-[0.25em] uppercase font-black hover:bg-[#c4a46c] hover:text-white transition-colors duration-300 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    >
                      VISIT OUR SHOPS
                    </button>
                  </div>
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group relative flex flex-col lg:flex-row w-full max-w-[1200px] bg-white rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-gray-100 mx-auto"
              >
                {/* Left Side: Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-16 z-10 bg-white">
                  <h3
                    className="text-[28px] sm:text-4xl lg:text-[44px] leading-tight mb-2 text-gray-900"
                    style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '-0.01em' }}
                  >
                    Phulwari Sharif
                  </h3>

                  <p className="text-gray-500 text-[14px] sm:text-base leading-relaxed mb-8 max-w-md">
                    Where tradition meets timeless fragrance. Discover signature blends crafted for connoisseurs.
                  </p>

                  {/* Minimalist Info List */}
                  <div className="flex flex-col gap-5 mb-10 w-full max-w-md border-y border-gray-100 py-6">
                    <div className="flex items-start gap-4 text-left">
                      <MapPin className="w-[18px] h-[18px] text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-gray-700 text-[14px] sm:text-[15px] font-medium leading-snug tracking-wide">Phulwari Sharif, Patna, Bihar 801505</span>
                    </div>
                    <div className="flex items-center gap-4 text-left">
                      <Phone className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-gray-700 text-[14px] sm:text-[15px] font-medium tracking-wide">+91 8340783679</span>
                    </div>
                    <div className="flex items-center gap-4 text-left">
                      <Clock className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-gray-700 text-[14px] sm:text-[15px] font-medium tracking-wide">10:00 AM – 9:00 PM, Mon – Sat</span>
                    </div>
                  </div>

                  {/* Elegant CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full max-w-md">
                    <a href="tel:+918340783679" className="w-full sm:w-auto flex-1">
                      <button className="w-full px-8 py-3.5 bg-gray-900 text-white text-[13px] font-semibold tracking-[0.1em] uppercase hover:bg-[#c4a46c] transition-colors duration-300 rounded-sm">
                        Call Store
                      </button>
                    </a>
                    <Link href="#" className="w-full sm:w-auto flex-1">
                      <button className="w-full px-8 py-3.5 bg-transparent border border-gray-200 text-gray-900 text-[13px] font-semibold tracking-[0.1em] uppercase hover:border-gray-900 transition-colors duration-300 rounded-sm">
                        Directions
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right Side: Image */}
                <div className="w-full lg:w-1/2 h-[260px] sm:h-[400px] lg:h-auto relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105">
                    <img
                      src="/assets/phulwari%20interior.jpeg"
                      alt="Phulwari Sharif Store"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Sabzibagh */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                className="group relative flex flex-col lg:flex-row w-full max-w-[1200px] bg-white rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-gray-100 mx-auto"
              >
                {/* Left Side: Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-16 z-10 bg-white">
                  <h3
                    className="text-[28px] sm:text-4xl lg:text-[44px] leading-tight mb-2 text-gray-900"
                    style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600, letterSpacing: '-0.01em' }}
                  >
                    Sabzibagh
                  </h3>

                  <p className="text-gray-500 text-[14px] sm:text-base leading-relaxed mb-8 max-w-md">
                    The heart of heritage perfumery. Step into a world of luxury and exclusive collections.
                  </p>

                  {/* Minimalist Info List */}
                  <div className="flex flex-col gap-5 mb-10 w-full max-w-md border-y border-gray-100 py-6">
                    <div className="flex items-start gap-4 text-left">
                      <MapPin className="w-[18px] h-[18px] text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-gray-700 text-[14px] sm:text-[15px] font-medium leading-snug tracking-wide">Sabzibagh, Patna, Bihar 800004</span>
                    </div>
                    <div className="flex items-center gap-4 text-left">
                      <Phone className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-gray-700 text-[14px] sm:text-[15px] font-medium tracking-wide">+91 7484878288</span>
                    </div>
                    <div className="flex items-center gap-4 text-left">
                      <Clock className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-gray-700 text-[14px] sm:text-[15px] font-medium tracking-wide">10:00 AM – 9:00 PM, Mon – Sat</span>
                    </div>
                  </div>

                  {/* Elegant CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full max-w-md">
                    <a href="tel:+917484878288" className="w-full sm:w-auto flex-1">
                      <button className="w-full px-8 py-3.5 bg-gray-900 text-white text-[13px] font-semibold tracking-[0.1em] uppercase hover:bg-[#c4a46c] transition-colors duration-300 rounded-sm">
                        Call Store
                      </button>
                    </a>
                    <Link href="#" className="w-full sm:w-auto flex-1">
                      <button className="w-full px-8 py-3.5 bg-transparent border border-gray-200 text-gray-900 text-[13px] font-semibold tracking-[0.1em] uppercase hover:border-gray-900 transition-colors duration-300 rounded-sm">
                        Directions
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right Side: Image */}
                <div className="w-full lg:w-1/2 h-[260px] sm:h-[400px] lg:h-auto relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105">
                    <img
                      src="/assets/sabjibagh%20interior.jpeg"
                      alt="Sabzibagh Store"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* ── Cream In-Store Exclusive Section ── */}
        <section className="relative w-full bg-gradient-to-b from-[#FDFBF7] to-[#F1EBE1] py-32 sm:py-40 md:py-52 overflow-hidden flex flex-col items-center">
          
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Fully Centered Header */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex justify-center text-center w-full mt-10 mb-32 sm:mb-40"
            >
              <h2 
                className="text-4xl sm:text-5xl md:text-[64px] text-[#1c1a18] w-full leading-tight uppercase tracking-widest font-bold"
                style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", serif' }}
              >
                In-Store <span className="text-[#C62828]">Exclusive</span>
              </h2>
            </motion.div>

            {/* 3D Auto-Rotating Carousel */}
            <div className="relative w-full h-[450px] sm:h-[500px] flex items-center justify-center [perspective:1200px]">
              {[
                { title: 'Experience First', desc: 'Unsure which fragrance matches your aura? Explore our complete collection in person.', img: '/assets/minimal-boutique.png', Icon: Eye },
                { title: 'Exclusive Offers', desc: 'Enjoy special walk-in discounts and complimentary samples strictly reserved for physical store visitors.', img: '/assets/minimal-perfume.png', Icon: Tag },
                { title: 'Premium Certified', desc: 'Every drop is 100% authentic and ethically sourced. We guarantee purely premium fragrance oils.', img: '/assets/minimal-oud.png', Icon: ShieldCheck },
                { title: 'Test On Skin', desc: 'Test longevity and projection on your own skin to see exactly how notes evolve with your chemistry.', img: '/assets/minimal-skin.png', Icon: Droplet }
              ].map((card, idx) => {
                const total = 4;
                let offset = (idx - activeExclusiveIndex) % total;
                if (offset < -total / 2) offset += total;
                if (offset > total / 2) offset -= total;
                
                const isCenter = offset === 0;
                const zIndex = 10 - Math.abs(offset);
                const absOffset = Math.abs(offset);
                
                return (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{
                      x: `${offset * 75}%`,
                      scale: isCenter ? 1 : 0.8 - (absOffset * 0.05),
                      rotateY: offset * -25,
                      opacity: absOffset > 1.5 ? 0 : 1 - (absOffset * 0.4),
                      zIndex
                    }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    className={`absolute top-0 group w-full max-w-[280px] sm:max-w-[340px] h-full rounded-2xl overflow-hidden shadow-2xl transition-shadow ${isCenter ? 'cursor-default' : 'cursor-pointer hover:shadow-[0_0_30px_rgba(196,164,108,0.3)]'}`}
                    onClick={() => {
                      if (!isCenter) setActiveExclusiveIndex(idx);
                    }}
                  >
                    <div className="absolute inset-0 z-0">
                      <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 via-[#111]/40 to-transparent transition-colors duration-700" />
                      <div className="absolute inset-5 border border-[#c4a46c]/30 rounded-xl z-20 pointer-events-none" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col p-6 sm:p-8 text-center items-center justify-start">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#c4a46c]/40 bg-[#111]/60 backdrop-blur-md flex items-center justify-center mb-6">
                         <card.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c4a46c]" />
                      </div>
                      <div className="w-full">
                        <h3 className="text-white text-[12px] sm:text-[13px] tracking-[0.25em] font-bold mb-3 sm:mb-4 uppercase">{card.title}</h3>
                        <div className="w-8 h-[1px] bg-[#c4a46c]/50 mx-auto mb-3 sm:mb-4" />
                        <p className="text-[#ccc] text-[12px] sm:text-[13px] leading-[1.6] sm:leading-[1.8]">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-8 pointer-events-none z-20 w-full max-w-[800px]">
                <button 
                  onClick={() => setActiveExclusiveIndex(p => (p - 1 + 4) % 4)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 backdrop-blur border border-[#d6c7b3] flex items-center justify-center text-[#8b7355] hover:bg-[#c4a46c] hover:text-white transition-colors pointer-events-auto shadow-lg"
                  aria-label="Previous card"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={() => setActiveExclusiveIndex(p => (p + 1) % 4)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 backdrop-blur border border-[#d6c7b3] flex items-center justify-center text-[#8b7355] hover:bg-[#c4a46c] hover:text-white transition-colors pointer-events-auto shadow-lg"
                  aria-label="Next card"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Dual Marquee Section ── */}
        <section className="relative w-full bg-[#1C1F1C] py-16 sm:py-24 overflow-hidden border-t border-b border-[#2A2D2A]">
          <div className="flex flex-col gap-4 sm:gap-8">
            {/* Marquee 1: Left to Right */}
            <div className="w-full overflow-hidden">
              <div className="animate-marquee-left flex" style={{ width: 'max-content' }}>
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex items-center shrink-0">
                    {Array(4).fill(null).map((_, i) => (
                      <span key={i} className="text-[#F8F6F3] text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-black uppercase tracking-tight whitespace-nowrap mx-4 sm:mx-6" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                        SUPER OFFER IN-STORE &bull; PURE ATTAR &bull;&nbsp;
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Marquee 2: Right to Left */}
            <div className="w-full overflow-hidden">
              <div className="animate-marquee-right flex" style={{ width: 'max-content' }}>
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex items-center shrink-0">
                    {Array(4).fill(null).map((_, i) => (
                      <span key={i} className="text-stroke-transparent text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-black uppercase tracking-tight whitespace-nowrap mx-4 sm:mx-6" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                        BEST EXPERIENCE ONLY IN STORE &bull; ROYAL OUD &bull;&nbsp;
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Dual Map Section (matching homepage dark design) ── */}
        <section style={{
          background: 'linear-gradient(135deg, #050011 0%, #0e0535 18%, #180850 32%, #0b1a55 48%, #081640 62%, #12063a 78%, #040010 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background glows */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: [
              'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(120,40,210,0.18) 0%, transparent 65%)',
              'radial-gradient(ellipse 55% 45% at 85% 60%, rgba(20,80,220,0.16) 0%, transparent 60%)',
              'radial-gradient(ellipse 45% 35% at 50% 90%, rgba(0,160,200,0.10) 0%, transparent 55%)',
            ].join(', '),
          }} />
          {/* Arabesque pattern */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.07,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='0.7'%3E%3Cpolygon points='40,4 76,22 76,58 40,76 4,58 4,22'/%3E%3Cpolygon points='40,14 66,28 66,52 40,66 14,52 14,28'/%3E%3Cpolygon points='40,24 56,32 56,48 40,56 24,48 24,32'/%3E%3Cline x1='40' y1='4' x2='40' y2='24'/%3E%3Cline x1='76' y1='22' x2='56' y2='32'/%3E%3Cline x1='76' y1='58' x2='56' y2='48'/%3E%3Cline x1='40' y1='76' x2='40' y2='56'/%3E%3Cline x1='4' y1='58' x2='24' y2='48'/%3E%3Cline x1='4' y1='22' x2='24' y2='32'/%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }} />

          <div className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <p style={{ color: 'rgba(255,255,255,0.75)', letterSpacing: '0.3em', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '12px' }}>
              LOCATE OUR STORES
            </p>
            <h2 style={{
              background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 30%, #d4a843 55%, #fce38a 75%, #b8820a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.55)) drop-shadow(0 0 40px rgba(212,175,55,0.25))',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              Find Us In Patna
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
              <span style={{ height: '1px', width: '50px', background: 'rgba(126,184,255,0.5)' }} />
              <span style={{ color: '#7eb8ff', fontSize: '10px' }}>◆</span>
              <span style={{ height: '1px', width: '50px', background: 'rgba(126,184,255,0.5)' }} />
            </div>

            {/* Map card with toggle */}
            <div className="w-full max-w-[1200px]" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,175,55,0.18)',
            }}>
              <div style={{ position: 'relative', width: '100%', minHeight: '500px', background: '#060412' }}>
                {/* Toggle overlay */}
                <div style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: 'rgba(8,6,30,0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  padding: '5px',
                  borderRadius: '30px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.2)',
                  zIndex: 1000,
                  display: 'flex', alignItems: 'center', gap: '2px',
                }}>
                  <button
                    type="button"
                    onClick={() => setActiveMap('phulwari')}
                    style={{
                      background: activeMap === 'phulwari' ? 'linear-gradient(135deg, #d4af37, #f5e27a)' : 'transparent',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '24px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: activeMap === 'phulwari' ? '#0a0520' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                      boxShadow: activeMap === 'phulwari' ? '0 2px 12px rgba(212,175,55,0.4)' : 'none',
                    }}
                  >
                    Phulwari
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMap('sabzibagh')}
                    style={{
                      background: activeMap === 'sabzibagh' ? 'linear-gradient(135deg, #d4af37, #f5e27a)' : 'transparent',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '24px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: activeMap === 'sabzibagh' ? '#0a0520' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                      boxShadow: activeMap === 'sabzibagh' ? '0 2px 12px rgba(212,175,55,0.4)' : 'none',
                    }}
                  >
                    Sabzibagh
                  </button>
                </div>

                {/* Map iframes */}
                <iframe
                  key={activeMap}
                  src={activeMap === 'phulwari'
                    ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.866834206912!2d85.06393990077616!3d25.57609678791896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2a9bcfa4d1d0b%3A0x6579f31439ab90f9!2sRahmani%20Perfumery!5e0!3m2!1sen!2sin!4v1776186526756!5m2!1sen!2sin"
                    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.642358292268!2d85.15491527517806!3d25.616797877443123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed59956165aef5%3A0xd5cbe379c9c2e72c!2sRahmani%20Perfumery!5e0!3m2!1sen!2sin!4v1776186560023!5m2!1sen!2sin"
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', top: 0, left: 0, filter: 'invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.85)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${activeMap === 'phulwari' ? 'Phulwari Sharif' : 'Sabzibagh'} Store Location`}
                />
              </div>
            </div>

            {/* Tagline below map */}
            <div style={{ textAlign: 'center', padding: '36px 20px 0', maxWidth: '700px', margin: '0 auto' }}>
              <p style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                fontWeight: 600, color: '#d4af37', marginBottom: '8px',
              }}>
                <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(212,175,55,0.5)' }} />
                Free Unlimited Demo Testing
                <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(212,175,55,0.5)' }} />
              </p>
              <p style={{
                fontSize: 'clamp(0.88rem, 1.5vw, 1.05rem)',
                color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontWeight: 400,
              }}>
                Walk into any of our outlets and explore our entire collection — smell, compare, and experience every attar as many times as you like, absolutely free.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
