'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import GlobalSearch from '@/components/GlobalSearch';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import Footer from '@/components/Footer';

/* ── Sub-components for hero ── */
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/20 mx-auto mb-3 w-fit"
    >
      <Sparkles className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
      <span className="text-[14px] font-normal text-[rgba(30,50,90,0.9)]">Our Boutiques</span>
    </motion.div>
  );
}

function BottomLeftCard() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute bottom-28 right-4 left-auto md:left-6 md:right-auto md:bottom-6 lg:bottom-10 lg:left-10 p-3 md:p-4 lg:p-5 rounded-[1.2rem] md:rounded-[1.5rem] lg:rounded-[2.2rem] bg-white/30 backdrop-blur-xl flex flex-col gap-2 lg:gap-3 min-w-[140px] md:min-w-[150px] lg:min-w-[180px] w-fit"
    >
      <div className="flex flex-col">
        <span className="text-2xl md:text-3xl font-normal text-[rgba(30,50,90,0.9)] tracking-tight">50+</span>
        <span className="text-[10px] md:text-[12px] font-normal text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Signature Scents</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center bg-white rounded-full pl-1.5 pr-5 py-1.5 gap-2 hover:bg-white/90 transition-colors self-start group"
      >
        <div className="bg-[rgba(30,50,90,0.1)] p-1 rounded-full flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-[rgba(30,50,90,0.9)]" />
        </div>
        <span className="text-[14px] font-normal text-[rgba(30,50,90,0.9)]">Shop Online</span>
      </motion.button>
    </motion.div>
  );
}

function BottomRightCorner() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute bottom-0 right-0 p-3 pt-5 pl-8 sm:p-4 sm:pt-6 sm:pl-10 md:p-6 md:pt-8 md:pl-14 bg-[#f0f0f0] rounded-tl-[1.5rem] sm:rounded-tl-[2rem] md:rounded-tl-[3.5rem] flex items-center gap-3 sm:gap-4 md:gap-6"
    >
      <div className="absolute -top-[1.5rem] sm:-top-[2rem] md:-top-[3.5rem] right-0 w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#f0f0f0"/></svg>
      </div>
      <div className="absolute bottom-0 -left-[1.5rem] sm:-left-[2rem] md:-left-[3.5rem] w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="#f0f0f0"/></svg>
      </div>
      <div className="bg-[rgba(30,50,90,0.05)] w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-[rgba(30,50,90,0.1)]">
        <ArrowUpRight className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[16px] md:text-[20px] font-normal text-[rgba(30,50,90,0.95)]">Store Guide</span>
        <div className="flex items-center gap-1 text-[rgba(30,50,90,0.6)] cursor-pointer hover:text-[rgba(30,50,90,0.8)] transition-colors">
          <span className="text-[12px] md:text-[15px] font-normal">Collections</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Location Card ── */
function LocationCard({ 
  index, name, address, city, hours, phone, delay 
}: { 
  index: string; name: string; address: string; city: string; hours: string; phone: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div className="relative bg-white rounded-[4px] overflow-hidden border border-[#e5e5e5] hover:border-[#1a1a1a] transition-colors duration-500">
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-[#1a1a1a] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        
        <div className="p-10 md:p-14">
          {/* Index + Name */}
          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#999] font-normal">{index}</span>
            <h3 className="text-[22px] md:text-[28px] font-normal text-[#1a1a1a] tracking-[-0.02em] leading-none"
                style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}>
              {name}
            </h3>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e5e5e5] mb-10" />

          {/* Address & Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-[#999] mb-3 font-medium">Address</span>
              <p className="text-[15px] text-[#1a1a1a] leading-[1.8] font-normal">
                {address}<br/>{city}
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-[#999] mb-3 font-medium">Hours</span>
                <p className="text-[15px] text-[#1a1a1a] font-normal">{hours}</p>
              </div>
              <div>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-[#999] mb-3 font-medium">Contact</span>
                <p className="text-[15px] text-[#1a1a1a] font-normal">{phone}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex items-center gap-6">
            <Link 
              href="#" 
              className="inline-flex items-center gap-3 text-[13px] tracking-[0.15em] uppercase text-[#1a1a1a] font-medium group/link hover:opacity-60 transition-opacity duration-300"
            >
              Get Directions
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
            <span className="w-[1px] h-4 bg-[#ddd]" />
            <Link 
              href="#" 
              className="inline-flex items-center gap-3 text-[13px] tracking-[0.15em] uppercase text-[#999] font-medium hover:text-[#1a1a1a] transition-colors duration-300"
            >
              Call Store
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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

      <style dangerouslySetInnerHTML={{ __html: `
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
          background-color: #f0f0f0;
          margin: 0;
          overflow-x: hidden;
        }
      `}} />

      <main className="store-page min-h-screen bg-[#f0f0f0]">
        {/* ═══ Hero Video Section ═══ */}
        <div className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-[#f0f0f0]">
          <section className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/10 group">
            <video 
              autoPlay muted loop playsInline 
              className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"
            />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              <div className="w-full flex flex-col items-center text-center max-w-4xl px-6">
                <HeroBadge />
                <motion.h1
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#5E6470] mb-2 tracking-tight leading-[1.05]"
                >
                  Visit us at our store
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-sm sm:text-base md:text-lg text-[#5E6470] opacity-80 leading-relaxed max-w-xl font-normal mt-4"
                >
                  Step into our world of artisanal fragrances. Experience luxury attars and perfumes, in person.
                </motion.p>
              </div>
              <BottomLeftCard />
              <BottomRightCorner />
            </div>
          </section>
        </div>

        {/* ═══ Locations Section — ZARA Editorial Style ═══ */}
        <section className="bg-[#f0f0f0]">
          {/* Section header */}
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-32 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <div>
                <span className="block text-[11px] tracking-[0.35em] uppercase text-[#999] mb-5 font-medium">Find Us</span>
                <h2 
                  className="text-[clamp(2.5rem,5vw,4.5rem)] font-normal text-[#1a1a1a] tracking-[-0.03em] leading-[1]"
                  style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
                >
                  Our Locations
                </h2>
              </div>
              <p className="text-[15px] text-[#777] leading-[1.8] max-w-[380px] font-normal">
                Visit our exclusive boutiques to discover handcrafted Arabian attars and perfumes. Each store offers a curated sensory experience.
              </p>
            </motion.div>

            {/* Thin divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-[1px] bg-[#d5d5d5] mt-14 origin-left"
            />
          </div>

          {/* Location Cards */}
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LocationCard
                index="01"
                name="Flagship Boutique"
                address="Sabzibagh, Ashok Rajpath"
                city="Patna, Bihar 800004"
                hours="Mon – Sat, 10 AM – 9 PM"
                phone="+91 91223 34455"
                delay={0.1}
              />
              <LocationCard
                index="02"
                name="Heritage Studio"
                address="Kankarbagh Main Road"
                city="Patna, Bihar 800020"
                hours="Mon – Sun, 11 AM – 10 PM"
                phone="+91 99887 76655"
                delay={0.25}
              />
            </div>
          </div>
        </section>

        {/* ═══ Promise Strip — Minimal Editorial ═══ */}
        <section className="bg-[#1a1a1a]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8"
            >
              {[
                { num: '01', title: 'Complimentary Consultation', desc: 'Our fragrance experts guide you to your signature scent through a personal discovery session.' },
                { num: '02', title: 'Exclusive In-Store Blends', desc: 'Access limited-edition attars and bespoke blending services available only at our boutiques.' },
                { num: '03', title: 'The Full Experience', desc: 'Immerse yourself in our curated atmosphere — every detail designed to elevate the senses.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] tracking-[0.3em] text-[#555] uppercase mb-5 font-medium">{item.num}</span>
                  <h3 className="text-[20px] md:text-[22px] font-normal text-white tracking-[-0.01em] mb-4 leading-[1.3]"
                      style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#888] leading-[1.8] font-normal">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
