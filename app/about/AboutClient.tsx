'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';

import { Great_Vibes } from 'next/font/google';
import { CharacterV1 } from '@/components/ui/text-scroll-animation';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });



export default function AboutClient() {
    const [showPreloader, setShowPreloader] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const heroRef = useRef(null);
    const section2Ref = useRef(null);

    const { scrollYProgress: section2Scroll } = useScroll({
        target: section2Ref,
        offset: ["start start", "end end"]
    });
    
    // Animate text opacity and position based on scroll progress of Section 2
    // Finishes animation by 30% scroll, leaving 70% of the pinned time to read the text
    const textOpacity = useTransform(section2Scroll, [0, 0.4], [0, 1]);
    const textY = useTransform(section2Scroll, [0, 0.4], [120, 0]);

    const handlePreloaderComplete = useCallback(() => setShowPreloader(false), []);

    const HF = "font-['Impact',_'Arial_Black',_sans-serif] uppercase tracking-[-0.02em]";

    return (
        <div className="bg-black min-h-screen text-white selection:bg-[#ccff00] selection:text-black font-sans">
            <AnimatePresence>
                {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
            </AnimatePresence>

            <div className="fixed top-0 w-full z-50">
                <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
            </div>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <CartDrawer />
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <main className="relative z-20 w-full">

                {/* ── SECTION 1: DARK STRUCTURAL HERO ── */}
                <section ref={heroRef} className="relative w-full min-h-[140vh] bg-black text-white pb-20" style={{ paddingTop: 'calc(var(--announce-h) + var(--header-h) + 3vw)' }}>
                    {/* Vertical grid lines */}
                    <div className="absolute inset-0 z-0 pointer-events-none grid grid-cols-4 divide-x divide-white/10 opacity-40">
                        <div /><div /><div /><div />
                    </div>

                    {/* Chrome metallic figure — in front of text (z:15 > text z:10) */}
                    <div className="absolute top-0 left-0 w-[48vw] h-full pointer-events-none" style={{ zIndex: 15 }}>
                        <Image
                            src="/assets/chrome-figure-v2nobg.png"
                            alt="Chrome Sculpture"
                            fill
                            priority
                            style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                        />
                    </div>

                    {/* Full-width title — BEHIND the figure (z:10 < figure z:15) */}
                    <div className="relative w-full overflow-hidden" style={{ zIndex: 10 }}>
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                            className={`${HF} text-[15vw] leading-[0.85] select-none`}
                        >
                            <h1 className="text-left pl-[3vw]">REDEFINING</h1>
                            <h1 className="text-center text-[#ccff00] pr-[8vw]">PERFUMERY</h1>
                            <h1 className="text-right pr-[3vw] opacity-80">RESHAPING</h1>
                            <h1 className="text-right text-[#ccff00] pr-[3vw]">NORMS</h1>
                        </motion.div>
                    </div>

                    {/* Stats / Info grid — inside constrained container */}
                    <div className="relative max-w-[1600px] mx-auto px-4 md:px-8 mt-16 md:mt-24" style={{ zIndex: 10 }}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-white/20 pt-16">
                            <div className="col-span-1 md:col-span-2">
                                <h2 className={`${HF} text-6xl md:text-[5vw] leading-[0.9]`}>
                                    ABOUT <br /><span className="text-[#ccff00]">RAHMANI PERFUMERY</span>
                                </h2>
                            </div>
                            <div className="col-span-1 md:col-span-1 font-mono text-xs uppercase text-white/70 leading-relaxed space-y-4">
                                <p>Rethinking Arabian formulation techniques to forge uncompromised, hyper-durable profiles.</p>
                                <p>Constructed in the Middle East. Bottled strictly without alcohol.</p>
                            </div>
                            <div className="col-span-1 md:col-span-1 font-mono text-xs uppercase text-white/50 leading-relaxed hidden md:block">
                                <p>Sourced ethically. Macerated extensively. Designed to outlast all volatile standards.<br /><br />Welcome to the architecture of scent.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECTION 2: SCROLL-PINNED IMAGE WITH ANIMATED TEXT ── */}
                <section ref={section2Ref} className="relative w-full h-[300vh] z-30">
                    <div className="sticky top-0 w-full h-screen overflow-hidden">
                        {/* Pinned Background Image */}
                        <div className="absolute inset-0">
                            <Image src="/assets/category_attar.png" alt="Pure Form" fill className="object-cover object-center opacity-70 contrast-110" />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>

                        {/* Grid Lines Overlay */}
                        <div className="absolute inset-0 z-0 pointer-events-none grid grid-cols-4 divide-x divide-white/10 opacity-30">
                            <div /><div /><div /><div />
                        </div>

                        {/* Animated Text */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 md:px-8 pointer-events-none">
                            <motion.h2
                                style={{ opacity: textOpacity, y: textY, perspective: "800px" }}
                                className={`${HF} text-[6vw] leading-[1.1] text-white max-w-[1600px] mx-auto w-full`}
                            >
                                {(() => {
                                    const parts = [
                                        { text: "MERGING EASTERN ", color: "text-white" },
                                        { text: "CRAFT HERITAGE", color: "text-[#ccff00]" },
                                        { text: " WITH BOLD MODERNITY, WE ", color: "text-white" },
                                        { text: "CREATE", color: "text-[#ccff00]" },
                                        { text: " SCENTS", color: "text-[#ccff00]" },
                                        { text: " THAT DEFY CONVENTION.", color: "text-white" }
                                    ];
                                    const totalChars = parts.reduce((acc, part) => acc + part.text.length, 0);
                                    const centerIndex = Math.floor(totalChars / 2);
                                    let globalIdx = 0;
                                    return parts.map((part, pIdx) => (
                                        <span key={pIdx}>
                                            {part.text.split("").map((char) => {
                                                const currentIdx = globalIdx++;
                                                return (
                                                    <CharacterV1
                                                        key={currentIdx}
                                                        char={char}
                                                        index={currentIdx}
                                                        centerIndex={centerIndex}
                                                        scrollYProgress={section2Scroll}
                                                        className={part.color}
                                                    />
                                                );
                                            })}
                                        </span>
                                    ));
                                })()}
                            </motion.h2>
                        </div>
                    </div>
                </section>

                {/* ── SECTION 3: THREE PILLARS & FOUNDED TEXT ── */}
                <section className="relative w-full bg-white text-black py-20 z-30">
                    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">
                        {/* Three Pillars */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-black">
                            {[
                                { title: 'CRAFT', img: '/assets/hawas-no-bg.png', icon: '✕' },
                                { title: 'CREATE', img: '/assets/bottle red crustal no bg.png', icon: '▲' },
                                { title: 'CONNECT', img: '/assets/green bottle.png', icon: '🔗' }
                            ].map((item, i) => (
                                <div key={item.title} className={`relative py-12 md:py-24 px-6 md:px-12 flex flex-col justify-between h-[450px] overflow-hidden border-black ${i < 2 ? 'md:border-r border-b md:border-b-0' : ''}`}>
                                    <div className="flex justify-between items-start relative z-10">
                                        <h3 className={`${HF} text-4xl md:text-5xl ${i === 1 ? 'text-[#ccff00]' : 'text-black'}`}>{item.title}</h3>
                                        <span className="text-xl font-light">{item.icon}</span>
                                    </div>

                                    {/* Product Image */}
                                    <div className="absolute inset-0 flex items-center justify-center p-4 py-20 pointer-events-none z-20">
                                        <div className="relative w-full h-full transition-opacity duration-500">
                                            <Image
                                                src={item.img}
                                                alt={item.title}
                                                fill
                                                className="object-contain contrast-110 brightness-110 transition-all duration-700"
                                            />
                                        </div>
                                    </div>

                                    <p className="font-mono text-xs uppercase text-black/60 pt-8 mt-auto relative z-10">
                                        {i === 0 ? 'Rigorous maceration standards applied to all extraits.' : i === 1 ? 'Zero alcohol formulation delivering absolute density.' : 'Bridging global influence with native roots.'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-3 pb-20">
                                <h3 className={`${HF} text-[6vw] leading-[0.85] mb-8`}>
                                    FOUNDED UPON <span className="text-[#ccff00]">TRADITION,</span> <br />
                                    RAHMANI FUSES HERITAGE <br />
                                    WITH <span className="text-[#ccff00]">MODERN INNOVATION</span> TO <br />
                                    REDEFINE <span className="text-[#ccff00]">ATTAR DESIGN.</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs uppercase text-black/70 mt-16 max-w-2xl">
                                    <p>We source meticulously from heritage farms. The oils speak for themselves.</p>
                                    <p>No synthetics. No dilutions. Just pure projection.</p>
                                </div>
                            </div>
                            <div className="col-span-1 h-[400px] md:h-full relative overflow-hidden">
                                <Image src="/assets/category_dakhoon.png" alt="Raw Ingredients" fill className="object-cover contrast-110" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECTION 3: CURSIVE TEXT BLOCK AND MARQUEE ── */}
                <section className="relative w-full bg-white overflow-hidden pb-40">
                    <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-black mt-20">
                        <h2 className={`${greatVibes.className} text-[#ccff00] text-center`} style={{ fontSize: 'clamp(5rem, 12vw, 15rem)', transform: 'rotate(-4deg)', letterSpacing: '0.05em' }}>
                            Strongest Projection
                        </h2>
                    </div>

                    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 mt-20">
                        <div className="border-y border-black overflow-hidden flex whitespace-nowrap py-4 my-10 bg-[#ccff00]">
                            <motion.h2
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                className={`${HF} text-8xl md:text-[12vw] leading-none text-black tracking-tighter`}
                            >
                                SCENT FORM • UNBOUNDED • SCENT FORM • UNBOUNDED • SCENT FORM • UNBOUNDED •&nbsp;
                            </motion.h2>
                        </div>
                    </div>
                </section>

                {/* ── SECTION 4: FOOTER (Hatton Labs exact layout) ──
                    4-col × 2-row grid:
                    Row 1: [CTA]        [—]         [—]           [IN PATNA]
                    Row 2: [RAHMANI…]   [NAV]       [IMAGE]       [NEWSLETTER]
                    +  Full-width 3D perspective text below
                */}
                <section className="relative w-full bg-black text-white overflow-hidden">

                    {/* Vertical dividers */}
                    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none flex">
                        <div className="flex-1 border-r border-white/10 h-full" />
                        <div className="flex-1 border-r border-white/10 h-full" />
                        <div className="flex-1 border-r border-white/10 h-full" />
                        <div className="flex-1 h-full" />
                    </div>

                    {/* 4-col grid */}
                    <div
                        className="relative z-10"
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
                    >
                        {/* ROW 1 COL 1 — CTA */}
                        <div className="px-8 pt-10 pb-4 flex flex-col gap-4">
                            <p style={{ fontSize: 11, maxWidth: 160, lineHeight: 1.5, color: "rgba(255,255,255,0.8)" }}>
                                Ready to Discover Your Next Statement Piece?
                            </p>
                            <button
                                className="inline-flex items-center gap-2 bg-[#ccff00] text-black font-bold uppercase rounded-full hover:brightness-90 transition-all"
                                style={{ fontSize: 10, letterSpacing: "0.15em", padding: "9px 14px", width: "fit-content" }}
                            >
                                DISCOVER OUR COLLECTION
                                <span
                                    className="rounded-full border border-black flex items-center justify-center flex-shrink-0"
                                    style={{ width: 20, height: 20, fontSize: 11 }}
                                >↗</span>
                            </button>
                        </div>

                        {/* ROW 1 COL 2 — empty */}
                        <div />

                        {/* ROW 1 COL 3 — empty */}
                        <div />

                        {/* ROW 1 COL 4 — IN PATNA */}
                        <div className="px-8 pt-10 pb-4 flex justify-end">
                            <h2
                                className={HF}
                                style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)", color: "#2a3020", lineHeight: 1, textAlign: "right" }}
                            >
                                IN PATNA
                            </h2>
                        </div>

                        {/* ROW 2 COL 1 — RAHMANI PERFUMERY label */}
                        <div className="px-8 pt-6 pb-10 flex items-center">
                            <h4 className={HF} style={{ fontSize: "clamp(1rem, 1.8vw, 1.5rem)", color: "white" }}>
                                RAHMANI PERFUMERY
                            </h4>
                        </div>

                        {/* ROW 2 COL 2 — Nav */}
                        <div className="px-8 py-10 flex items-center">
                            <nav className="flex flex-col gap-3 w-full">
                                {["HOME", "ABOUT", "PRODUCTS", "AFFILIATE", "CONTACT"].map((item, i) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="uppercase hover:text-white transition-colors flex items-center"
                                        style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)" }}
                                    >
                                        {i === 0 && <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 6 }}>|</span>}
                                        <span style={{ paddingLeft: i === 0 ? 0 : 10 }}>{item}</span>
                                        {i === 0 && <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>|</span>}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* ROW 2 COL 3 — IMAGE spans both rows (absolute from section top) */}
                        <div className="relative" style={{ minHeight: "50vh" }}>
                            <div
                                className="absolute pointer-events-none"
                                style={{
                                    bottom: 0,
                                    left: "-25%",
                                    width: "150%",
                                    height: "180%",
                                    zIndex: 20,
                                }}
                            >
                                <Image
                                    src="/assets/hand holding bottle.png"
                                    alt="Rahmani Perfume"
                                    fill
                                    className="object-contain object-bottom contrast-110"
                                />
                            </div>
                        </div>

                        {/* ROW 2 COL 4 — Newsletter */}
                        <div className="px-8 py-10 flex flex-col justify-center">
                            <h4
                                className={HF}
                                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.3rem)", color: "white", marginBottom: 14 }}
                            >
                                SIGN UP TO OUR NEWSLETTER
                            </h4>
                            <div
                                className="flex items-center bg-white rounded-full overflow-hidden"
                                style={{ padding: "4px 4px 4px 16px" }}
                            >
                                <input
                                    type="email"
                                    placeholder="YOUR EMAIL"
                                    className="flex-1 bg-transparent outline-none min-w-0"
                                    style={{ fontSize: 11, color: "black" }}
                                />
                                <button
                                    className="flex items-center justify-center bg-[#ccff00] text-black rounded-full hover:bg-black hover:text-[#ccff00] transition-colors flex-shrink-0"
                                    style={{ width: 32, height: 32, fontSize: 14 }}
                                >
                                    ↗
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FULL-WIDTH 3D PERSPECTIVE TEXT */}
                    <div
                        className="relative w-full overflow-hidden z-10"
                        style={{
                            perspective: "280px",
                            perspectiveOrigin: "50% 100%",
                            height: "clamp(130px, 20vw, 260px)",
                        }}
                    >
                        <h1
                            className={`${HF} text-white text-center whitespace-nowrap select-none`}
                            style={{
                                fontSize: "clamp(65px, 15.5vw, 210px)",
                                lineHeight: 1,
                                transform: "rotateX(26deg) scaleX(1.06) translateY(44%)",
                                transformOrigin: "bottom center",
                                letterSpacing: "-0.01em",
                                willChange: "transform",
                            }}
                        >
                            RAHMANI PERFUMERY
                        </h1>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
