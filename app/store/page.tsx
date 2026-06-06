'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, MapPin, Phone, Clock, Eye, Droplet, Tag, ShieldCheck, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [heroSliderIdx, setHeroSliderIdx] = useState(0);
  const [store1SliderIdx, setStore1SliderIdx] = useState(0);
  const [store2SliderIdx, setStore2SliderIdx] = useState(0);
  const [dynamicIslandOpen, setDynamicIslandOpen] = useState(false);
  const [activeStoreIsland, setActiveStoreIsland] = useState<0 | 1>(0);

  const HERO_SLIDES = [
    '/assets/fullsizestore.png',
    '/assets/phulwari interior.jpeg',
    '/assets/sabzibaghshopinterior.png',
    '/assets/sabzibagh shop out.jpeg',
  ];

  const STORE1_IMAGES = [
    '/assets/fullsizestore.png',
    '/assets/phulwari interior.jpeg',
    '/assets/store-phulwari.png',
    '/assets/visit-outlet.webp',
  ];

  const STORE2_IMAGES = [
    '/assets/sabzibaghshopinterior.png',
    '/assets/sabjibagh interior.jpeg',
    '/assets/sabzibagh shop out.jpeg',
    '/assets/store-sabzibagh.png',
  ];

  // Auto-rotate exclusive cards every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExclusiveIndex((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate hero slider every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSliderIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

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
                  className="hidden md:flex items-center gap-5"
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
                    style={{
                      padding: '18px 44px',
                      background: 'linear-gradient(135deg, #c4a46c 0%, #e0c98a 100%)',
                      color: '#1a1a1a',
                      fontSize: '13px',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase' as const,
                      fontWeight: 800,
                      borderRadius: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 12px 40px rgba(196,164,108,0.45), 0 0 0 1px rgba(255,255,255,0.15)',
                      transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 18px 50px rgba(196,164,108,0.55), 0 0 0 1px rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(196,164,108,0.45), 0 0 0 1px rgba(255,255,255,0.15)'; }}
                  >
                    Explore Stores
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </button>
                  <a
                    href="https://maps.google.com/?q=Rehmani+Perfumery+Patna"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <button
                      style={{
                        padding: '18px 36px',
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        color: '#ffffff',
                        fontSize: '13px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const,
                        fontWeight: 700,
                        borderRadius: '14px',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        cursor: 'pointer',
                        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      Get Directions
                      <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </a>
                </motion.div>
              </div>
            </div>


          </section>
        </div>

        {/* ═══ OUR STORES — Exact Reference Layout ═══ */}
        <section id="our-stores" className="relative w-full bg-[#F6F2EB] py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="w-full flex flex-col items-center justify-center mb-6 md:mb-16"
            >
              <p style={{ color: '#c4a46c', fontSize: '12px', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
                Visit Our Stores
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
                {/* Left flourish */}
                <svg width="60" height="24" viewBox="0 0 80 30" fill="none" style={{ color: 'rgba(196, 164, 108, 0.4)' }}>
                  <path d="M78 15 C60 15, 50 5, 35 8 C20 11, 15 20, 2 15" stroke="currentColor" strokeWidth="1" />
                  <circle cx="35" cy="8" r="2" fill="currentColor" opacity="0.5" />
                  <path d="M35 8 C30 2, 22 3, 20 8" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                </svg>
                <h2
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: '1.1', fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600, color: '#1a1f1a', textAlign: 'center', margin: 0 }}
                >
                  Our <span style={{ fontStyle: 'italic' }}>Stores</span>
                </h2>
                {/* Right flourish */}
                <svg width="60" height="24" viewBox="0 0 80 30" fill="none" style={{ color: 'rgba(196, 164, 108, 0.4)', transform: 'scaleX(-1)' }}>
                  <path d="M78 15 C60 15, 50 5, 35 8 C20 11, 15 20, 2 15" stroke="currentColor" strokeWidth="1" />
                  <circle cx="35" cy="8" r="2" fill="currentColor" opacity="0.5" />
                  <path d="M35 8 C30 2, 22 3, 20 8" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.75rem' }}>
                <span style={{ color: 'rgba(196, 164, 108, 0.4)', fontSize: '10px' }}>✦ ✦ ✦</span>
              </div>
            </motion.div>
          </div>

          {/* Store Cards Stack — FULL WIDTH EDGE TO EDGE (hidden on mobile) */}
          <div className="hidden md:flex flex-col w-full gap-8">

            {/* ── CARD 1: Phulwari Sharif ── */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: '640px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              {/* Background Image */}
              <div style={{ position: 'absolute', inset: 0 }}>
                <Image
                  src="/assets/fullsizestore.png"
                  alt="Phulwari Sharif Store Interior"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 3s' }}
                  priority
                />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.15)' }} />
              </div>

              {/* Content: Info Card LEFT + Image Slider RIGHT (desktop only) */}
              <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '640px', padding: '0 2rem' }}>
                {/* Left: Glassmorphic Info Card */}
                <div
                  style={{
                    width: '90%',
                    maxWidth: '500px',
                    padding: '3rem',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    gap: '1.5rem',
                    background: 'rgba(15, 20, 15, 0.65)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin style={{ width: '18px', height: '18px', color: '#c4a46c' }} strokeWidth={2} />
                    <span style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 'bold', color: '#c4a46c' }}>Store 01</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: '1.1', color: '#ffffff', marginBottom: '12px', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}>
                      Phulwari Sharif
                    </h3>
                    <p style={{ color: '#a0a5a0', fontSize: '15px', margin: 0 }}>Patna, Bihar 801505</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem 0', margin: '0.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Phone style={{ width: '18px', height: '18px', color: '#c4a46c' }} strokeWidth={1.8} />
                      <a href="tel:+918340783679" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>+91 8340783679</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Clock style={{ width: '18px', height: '18px', color: '#c4a46c' }} strokeWidth={1.8} />
                      <div style={{ color: '#e0e0e0', fontSize: '15px', fontWeight: 500 }}>
                        10:00 AM – 9:00 PM <span style={{ color: '#8a9a8c', marginLeft: '8px', fontSize: '13px' }}>Mon – Sat</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', width: '100%', paddingTop: '0.5rem' }}>
                    <a href="tel:+918340783679" style={{ textDecoration: 'none' }}>
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px 32px', backgroundColor: '#c4a46c', color: '#ffffff', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(196, 164, 108, 0.4)' }}>
                        Call Store
                        <Phone style={{ width: '16px', height: '16px' }} />
                      </button>
                    </a>
                    <a href="https://maps.google.com/?q=Rehmani+Perfumery+Phulwari+Sharif+Patna" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px 32px', backgroundColor: 'transparent', color: '#ffffff', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                        Directions
                        <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                      </button>
                    </a>
                  </div>
                </div>

                {/* Right: 4-Image Slider (Desktop only) */}
                <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '14px', maxWidth: '520px', height: '420px' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => setStore1SliderIdx(p => (p - 1 + STORE1_IMAGES.length) % STORE1_IMAGES.length)}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>

                  {/* Slider Cards */}
                  <div style={{ display: 'flex', gap: '12px', height: '100%', overflow: 'hidden', alignItems: 'center' }}>
                    {/* Main large card */}
                    <div style={{ width: '280px', height: '380px', borderRadius: '18px', overflow: 'hidden', flexShrink: 0, position: 'relative', border: '4px solid rgba(255,255,255,0.85)', boxShadow: '0 20px 50px rgba(0,0,0,0.35)', transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                      <Image
                        src={STORE1_IMAGES[store1SliderIdx]}
                        alt="Phulwari Sharif Store"
                        fill
                        style={{ objectFit: 'cover', transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
                      />
                      {/* Location label */}
                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0 }}>Phulwari Sharif</p>
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: 0 }}>Store Interior</p>
                        </div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(196,164,108,0.3)', border: '1px solid rgba(196,164,108,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MapPin style={{ width: '13px', height: '13px', color: '#c4a46c' }} />
                        </div>
                      </div>
                    </div>
                    {/* Secondary smaller card (peek) */}
                    <div style={{ width: '140px', height: '320px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, position: 'relative', border: '4px solid rgba(255,255,255,0.65)', opacity: 0.7, transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                      <Image
                        src={STORE1_IMAGES[(store1SliderIdx + 1) % STORE1_IMAGES.length]}
                        alt="Store view"
                        fill
                        style={{ objectFit: 'cover', transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
                      />
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => setStore1SliderIdx(p => (p + 1) % STORE1_IMAGES.length)}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── CARD 2: Sabzibagh ── */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              style={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: '640px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              {/* Background Image */}
              <div style={{ position: 'absolute', inset: 0 }}>
                <Image
                  src="/assets/sabzibaghshopinterior.png"
                  alt="Sabzibagh Store Interior"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 3s' }}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.15)' }} />
              </div>

              {/* Content: Image Slider LEFT + Info Card RIGHT (desktop only) */}
              <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '640px', padding: '0 2rem' }}>

                {/* Left: 4-Image Slider (Desktop only) */}
                <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '14px', maxWidth: '520px', height: '420px' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => setStore2SliderIdx(p => (p - 1 + STORE2_IMAGES.length) % STORE2_IMAGES.length)}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>

                  {/* Slider Cards */}
                  <div style={{ display: 'flex', gap: '12px', height: '100%', overflow: 'hidden', alignItems: 'center' }}>
                    {/* Secondary smaller card (peek) — left side */}
                    <div style={{ width: '140px', height: '320px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, position: 'relative', border: '4px solid rgba(255,255,255,0.65)', opacity: 0.7, transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                      <Image
                        src={STORE2_IMAGES[(store2SliderIdx + 3) % STORE2_IMAGES.length]}
                        alt="Store view"
                        fill
                        style={{ objectFit: 'cover', transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
                      />
                    </div>
                    {/* Main large card */}
                    <div style={{ width: '280px', height: '380px', borderRadius: '18px', overflow: 'hidden', flexShrink: 0, position: 'relative', border: '4px solid rgba(255,255,255,0.85)', boxShadow: '0 20px 50px rgba(0,0,0,0.35)', transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                      <Image
                        src={STORE2_IMAGES[store2SliderIdx]}
                        alt="Sabzibagh Store"
                        fill
                        style={{ objectFit: 'cover', transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
                      />
                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0 }}>Sabzibagh</p>
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: 0 }}>Store Interior</p>
                        </div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(196,164,108,0.3)', border: '1px solid rgba(196,164,108,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MapPin style={{ width: '13px', height: '13px', color: '#c4a46c' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => setStore2SliderIdx(p => (p + 1) % STORE2_IMAGES.length)}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>

                {/* Right: Glassmorphic Info Card */}
                <div
                  style={{
                    width: '90%',
                    maxWidth: '500px',
                    padding: '3rem',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    gap: '1.5rem',
                    background: 'rgba(15, 20, 15, 0.65)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin style={{ width: '18px', height: '18px', color: '#c4a46c' }} strokeWidth={2} />
                    <span style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 'bold', color: '#c4a46c' }}>Store 02</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: '1.1', color: '#ffffff', marginBottom: '12px', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}>
                      Sabzibagh
                    </h3>
                    <p style={{ color: '#a0a5a0', fontSize: '15px', margin: 0 }}>Patna, Bihar 800004</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem 0', margin: '0.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Phone style={{ width: '18px', height: '18px', color: '#c4a46c' }} strokeWidth={1.8} />
                      <a href="tel:+917484878288" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>+91 7484878288</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Clock style={{ width: '18px', height: '18px', color: '#c4a46c' }} strokeWidth={1.8} />
                      <div style={{ color: '#e0e0e0', fontSize: '15px', fontWeight: 500 }}>
                        10:00 AM – 9:00 PM <span style={{ color: '#8a9a8c', marginLeft: '8px', fontSize: '13px' }}>Mon – Sat</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', width: '100%', paddingTop: '0.5rem' }}>
                    <a href="tel:+917484878288" style={{ textDecoration: 'none' }}>
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px 32px', backgroundColor: '#c4a46c', color: '#ffffff', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(196, 164, 108, 0.4)' }}>
                        Call Store
                        <Phone style={{ width: '16px', height: '16px' }} />
                      </button>
                    </a>
                    <a href="https://maps.google.com/?q=Rehmani+Perfumery+Sabzibagh+Patna" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px 32px', backgroundColor: 'transparent', color: '#ffffff', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                        Directions
                        <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ═══ Mobile Store Card (always visible) ═══ */}
          <div className="md:hidden flex justify-center px-4">
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                background: '#1a1a1a',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              {/* Store Toggle Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '16px 16px 0',
                }}
              >
                {['Phulwari Sharif', 'Sabzibagh'].map((name, idx) => (
                  <button
                    key={name}
                    onClick={() => setActiveStoreIsland(idx as 0 | 1)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: '14px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      background: activeStoreIsland === idx ? 'rgba(196,164,108,0.2)' : 'rgba(255,255,255,0.06)',
                      color: activeStoreIsland === idx ? '#c4a46c' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Store Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStoreIsland}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  style={{ padding: '20px 20px 24px' }}
                >
                  {/* Store Image */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: '3px solid rgba(255,255,255,0.1)' }}>
                    <Image
                      src={activeStoreIsland === 0 ? '/assets/fullsizestore.png' : '/assets/sabzibaghshopinterior.png'}
                      alt={activeStoreIsland === 0 ? 'Phulwari Sharif' : 'Sabzibagh'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '10px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin style={{ width: '12px', height: '12px', color: '#c4a46c' }} />
                      <span style={{ fontSize: '11px', color: '#c4a46c', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Store {activeStoreIsland === 0 ? '01' : '02'}
                      </span>
                    </div>
                  </div>

                  {/* Store Name */}
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '4px', fontFamily: '"Playfair Display", Georgia, serif' }}>
                    {activeStoreIsland === 0 ? 'Phulwari Sharif' : 'Sabzibagh'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                    Patna, Bihar {activeStoreIsland === 0 ? '801505' : '800004'}
                  </p>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 0', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Phone style={{ width: '14px', height: '14px', color: '#c4a46c' }} strokeWidth={1.8} />
                      <a
                        href={`tel:${activeStoreIsland === 0 ? '+918340783679' : '+917484878288'}`}
                        style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
                      >
                        {activeStoreIsland === 0 ? '+91 8340783679' : '+91 7484878288'}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Clock style={{ width: '14px', height: '14px', color: '#c4a46c' }} strokeWidth={1.8} />
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                        10 AM – 9 PM <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginLeft: '4px' }}>Mon – Sat</span>
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                      href={`tel:${activeStoreIsland === 0 ? '+918340783679' : '+917484878288'}`}
                      style={{ flex: 1, textDecoration: 'none' }}
                    >
                      <button style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px 0',
                        background: 'linear-gradient(135deg, #c4a46c, #d4b87a)',
                        color: '#fff', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
                        fontWeight: 700, borderRadius: '14px', border: 'none', cursor: 'pointer',
                      }}>
                        Call
                        <Phone style={{ width: '13px', height: '13px' }} />
                      </button>
                    </a>
                    <a
                      href={`https://maps.google.com/?q=Rehmani+Perfumery+${activeStoreIsland === 0 ? 'Phulwari+Sharif' : 'Sabzibagh'}+Patna`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ flex: 1, textDecoration: 'none' }}
                    >
                      <button style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px 0',
                        background: 'transparent',
                        color: '#fff', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
                        fontWeight: 700, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer',
                      }}>
                        Directions
                        <ArrowUpRight style={{ width: '13px', height: '13px' }} />
                      </button>
                    </a>
                  </div>

                  {/* Pagination dots */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
                    <button
                      onClick={() => setActiveStoreIsland(p => (p === 0 ? 1 : 0) as 0 | 1)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronLeft style={{ width: '14px', height: '14px' }} />
                    </button>
                    {[0, 1].map(i => (
                      <div
                        key={i}
                        style={{
                          width: activeStoreIsland === i ? '20px' : '6px',
                          height: '6px',
                          borderRadius: '3px',
                          background: activeStoreIsland === i ? '#c4a46c' : 'rgba(255,255,255,0.15)',
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                    <button
                      onClick={() => setActiveStoreIsland(p => (p === 0 ? 1 : 0) as 0 | 1)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronRight style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
            {/* ── Help / Contact Banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 sm:mt-16 lg:mt-20 w-full rounded-2xl px-6 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(196,164,108,0.15)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-9 h-9 rounded-full bg-[#c4a46c]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#c4a46c]" strokeWidth={2} />
                </div>
                <p className="text-[#2a352c] text-[13px] sm:text-[14px] font-medium">
                  <span className="font-bold">Need Help Choosing the Right Fragrance?</span>
                  <span className="text-[#7a857c] ml-1.5">Our experts are here for you!</span>
                </p>
              </div>
              <Link href="/about-us">
                <button className="px-6 py-2.5 bg-[#c4a46c] text-[#0f2a4a] text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:bg-[#b08d50] hover:text-white transition-all duration-300 whitespace-nowrap shadow-md border border-[#c4a46c]">
                  Contact Us
                </button>
              </Link>
            </motion.div>

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
                { title: 'Experience First', desc: 'Unsure which fragrance matches your aura? Explore our complete collection in person.', img: '/assets/minimal-boutique.png' },
                { title: 'Exclusive Offers', desc: 'Enjoy special walk-in discounts and complimentary samples strictly reserved for physical store visitors.', img: '/assets/minimal-perfume.png' },
                { title: 'Premium Certified', desc: 'Every drop is 100% authentic and ethically sourced. We guarantee purely premium fragrance oils.', img: '/assets/minimal-oud.png' },
                { title: 'Test On Skin', desc: 'Test longevity and projection on your own skin to see exactly how notes evolve with your chemistry.', img: '/assets/minimal-skin.png' }
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
                      <Image src={card.img} alt={card.title} fill style={{ objectFit: 'cover' }} className="transform scale-110 group-hover:scale-100 transition-transform duration-[1.5s]" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 via-[#111]/40 to-transparent transition-colors duration-700" />
                      <div className="absolute inset-5 border border-[#c4a46c]/30 rounded-xl z-20 pointer-events-none" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col p-6 sm:p-8 text-center items-center justify-between">
                      <div className="w-full flex-1" />
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
