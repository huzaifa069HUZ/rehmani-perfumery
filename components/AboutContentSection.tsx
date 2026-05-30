'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { Environment, useGLTF, Center, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

gsap.registerPlugin(ScrollTrigger);

function CountUpNumber({ end, duration = 2000 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentVal = Math.floor(easeOut * end);
      setCount(currentVal);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(end); // ensure exact finish
      }
    };
    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return <span ref={nodeRef} style={{ display: 'inline-block' }}>{count}</span>;
}

function InteractiveBottle() {
  const { scene } = useGLTF('/assets/3dbottle.glb');
  return (
    <Center>
      <primitive object={scene} scale={[1.6, 1.6, 1.6]} />
    </Center>
  );
}
useGLTF.preload('/assets/3dbottle.glb');

gsap.registerPlugin(ScrollTrigger);

/* ── Design tokens ── */
const GOLD = '#c9a55a';
const HF = "font-['Tajam',sans-serif]";

export default function AboutContentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Auto-changing images for Card 2
  const [attarSlideIndex, setAttarSlideIndex] = useState(0);
  const attarImages = [
    '/assets/category_attar.png',
    '/assets/luxury_attar_bottle_1_1773444423078.png',
    '/assets/luxury_attar_bottle_2_1773444458042.png',
    '/assets/luxury_attar_bottle_3_1773444475959.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAttarSlideIndex((prev) => (prev + 1) % attarImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. Headline letter-by-letter reveal ── */
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        gsap.fromTo(words,
          { y: 100, opacity: 0, rotateX: -40 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 2. Grid cards stagger ── */
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.grid-card');
        gsap.fromTo(cards,
          { y: 80, opacity: 0, scale: 0.92 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 3. Stats counter ── */
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(statItems,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 4. Tagline reveal ── */
      if (taglineRef.current) {
        gsap.fromTo(taglineRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: taglineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── 5. CTA slide up ── */
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#fff',
        borderRadius: '28px 28px 0 0',
        marginTop: -28,
        overflow: 'hidden',
      }}
    >

      {/* ── BLOCK 1: Hero Headline ── */}
      <section style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: GOLD,
          marginBottom: 20,
        }}>
          RAHMANI PERFUMERY
        </p>

        <h2
          ref={headlineRef}
          className={HF}
          style={{
            fontSize: 'clamp(2.2rem, 10vw, 4rem)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            perspective: '600px',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em' }}>BEYOND</span>
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em', color: GOLD }}>ORDINARY</span>
          <br />
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em' }}>FRAGRANCE.</span>
          <br />
          <span className="word" style={{ display: 'inline-block', marginRight: '0.2em', color: GOLD }}>ALWAYS.</span>
        </h2>

        <p style={{
          fontSize: 13,
          lineHeight: 1.8,
          color: '#888',
          maxWidth: 380,
          margin: '28px auto 0',
        }}>
          Rethinking Arabian formulation techniques to forge uncompromised, hyper-durable profiles. Bottled strictly without alcohol.
        </p>
      </section>

      {/* ── BLOCK 2: Animated Product Grid ── */}
      <section style={{ padding: '20px 16px 40px' }}>
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {/* Card 1 — Large, spans full width */}
          <div
            className="grid-card"
            style={{
              gridColumn: '1 / -1',
              background: '#f5f3ef',
              borderRadius: 20,
              padding: '32px 24px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            {/* Background image / 3D bottle */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', zIndex: 0,
            }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.6} />
                <spotLight position={[5, 10, 5]} intensity={5} color="#ffdcb4" />
                <Environment preset="studio" />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
                <Suspense fallback={null}>
                  <InteractiveBottle />
                </Suspense>
              </Canvas>
            </div>
            <p style={{
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: GOLD,
              marginBottom: 8,
              position: 'relative', zIndex: 1,
            }}>ALCOHOL-FREE ATTARS</p>
            <h3 className={HF} style={{
              fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
              lineHeight: 1,
              color: '#0a0a0a',
              textTransform: 'uppercase',
              position: 'relative', zIndex: 1,
            }}>
              PURE.<br /><span style={{ color: GOLD }}>POTENT.</span><br />TIMELESS.
            </h3>
          </div>

          {/* Card 2 */}
          <Link
            href="/perfumes"
            className="grid-card"
            style={{
              background: '#0a0a0a',
              borderRadius: 20,
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 200,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', bottom: 0, right: 0, width: '55%', height: '100%',
            }}>
              {attarImages.map((src, index) => (
                <div key={src} style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  opacity: attarSlideIndex === index ? 1 : 0,
                  transition: 'opacity 1s ease-in-out'
                }}>
                  <Image src={src} alt="" fill style={{ objectFit: 'cover', borderRadius: '0 16px 16px 0' }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: GOLD, position: 'relative', zIndex: 1 }}>
              IMPORTED PERFUMES
            </p>
            <h3 className={HF} style={{ fontSize: '1.2rem', lineHeight: 1.1, color: '#fff', textTransform: 'uppercase', marginTop: 'auto', position: 'relative', zIndex: 1, left: '-4px' }}>
              LONG LASTING<br /><span style={{ color: GOLD }}>PROJECTION</span>
            </h3>
          </Link>

          {/* Card 3 */}
          <Link
            href="/bakhoor"
            className="grid-card"
            style={{
              background: `linear-gradient(135deg, #f9f6f0, #efe9dd)`,
              borderRadius: 20,
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 200,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', bottom: 0, right: 0, width: '50%', height: '100%',
            }}>
              <Image src="/assets/minimal-oud.png" alt="" fill style={{ objectFit: 'cover', borderRadius: '0 16px 16px 0' }} />
            </div>
            <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: GOLD, position: 'relative', zIndex: 1 }}>
              BAKHOOR <span style={{ color: '#0a0a0a' }}>&</span> <span style={{ color: '#fff' }}>OUD</span>
            </p>
            <h3 className={HF} style={{ fontSize: '1.2rem', lineHeight: 1.1, color: '#0a0a0a', textTransform: 'uppercase', marginTop: 'auto', position: 'relative', zIndex: 1, left: '-4px' }}>
              HOME<br /><span style={{ color: GOLD }}>FRAG</span><span style={{ color: '#0a0a0a' }}>RANCE</span>
            </h3>
          </Link>

          {/* Card 4 — Full width gift pack */}
          <Link
            href="/category/gifting"
            className="grid-card"
            style={{
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg, #1a1510, #2c2620)',
              borderRadius: 20,
              padding: '28px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              minHeight: 120,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', right: 0, top: 0, width: '40%', height: '100%',
            }}>
              <Image src="/assets/giftbox.png" alt="" fill style={{ objectFit: 'cover', borderRadius: '0 16px 16px 0' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: GOLD, marginBottom: 6 }}>
                EXCLUSIVE
              </p>
              <h3 className={HF} style={{ fontSize: '1.3rem', lineHeight: 1.1, color: '#fff', textTransform: 'uppercase' }}>
                RAMADAN & EID<br /><span style={{ color: GOLD }}>GIFT PACKS</span>
              </h3>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', border: `1.5px solid ${GOLD}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              position: 'relative', zIndex: 1,
            }}>
              <span style={{ color: GOLD, fontSize: 20 }}>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── BLOCK 3 & 4 COMBINED: Tagline, Video, and Stats Cards ── */}
      <section
        ref={taglineRef}
        style={{
          padding: '60px 24px',
          background: '#faf9f7',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 22, color: GOLD, marginBottom: 16 }}>✨</p>
          <h2
            className={HF}
            style={{
              fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
              fontWeight: 500,
              lineHeight: 1.35,
              color: '#1a1a1a',
              maxWidth: 400,
              margin: '0 auto',
            }}
          >
            Wear confidence.<br />
            Wear identity.<br />
            <span style={{ color: GOLD }}>Wear memories.</span>
          </h2>
        </div>

        {/* Container for Video and Cards */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8 max-w-[1400px] mx-auto mt-12 px-4">

          {/* Video (Takes up 55% of the space on PC) */}
          <div className="w-full lg:w-[55%] flex" style={{ borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
            <video
              src="/assets/kamrah-vid-about.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', display: 'block', objectFit: 'cover', minHeight: '100%' }}
            />
          </div>

          {/* 3 Data Cards (Stacked vertically on the right for PC) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:gap-8 justify-between" ref={statsRef}>

            {/* Card 1: White -> Black on hover */}
            <div className="stat-item group flex-1 flex flex-col justify-center items-center text-center bg-white rounded-[2.5rem] p-6 lg:py-10 transition-all duration-500 hover:bg-[#0a0a0a] hover:-translate-y-2 cursor-default border border-gray-100/50" style={{ boxShadow: '0 15px 40px -10px rgba(0,0,0,0.05)' }}>
              <h3 className={`${HF} text-4xl lg:text-[2.8rem] text-[#1a1a1a] group-hover:text-white transition-colors duration-500 mb-1 leading-none`}>
                <CountUpNumber end={3} duration={2000} />+
              </h3>
              <p className="text-[9px] lg:text-[10px] font-bold tracking-[0.2em] text-[#888] group-hover:text-[#c9a55a] transition-colors duration-500 uppercase mt-1">
                Years of Experience
              </p>
            </div>

            {/* Card 2: White -> Black on hover */}
            <div className="stat-item group flex-1 flex flex-col justify-center items-center text-center bg-white rounded-[2.5rem] p-6 lg:py-10 transition-all duration-500 hover:bg-[#0a0a0a] hover:-translate-y-2 cursor-default border border-gray-100/50" style={{ boxShadow: '0 15px 40px -10px rgba(0,0,0,0.05)' }}>
              <h3 className={`${HF} text-4xl lg:text-[2.8rem] text-[#1a1a1a] group-hover:text-white transition-colors duration-500 mb-1 leading-none`}>
                <CountUpNumber end={1000} duration={2000} />+
              </h3>
              <p className="text-[9px] lg:text-[10px] font-bold tracking-[0.2em] text-[#888] group-hover:text-[#c9a55a] transition-colors duration-500 uppercase mt-1">
                Happy Customers
              </p>
            </div>

            {/* Card 3: White -> Black on hover */}
            <div className="stat-item group flex-1 flex flex-col justify-center items-center text-center bg-white rounded-[2.5rem] p-6 lg:py-10 transition-all duration-500 hover:bg-[#0a0a0a] hover:-translate-y-2 cursor-default border border-gray-100/50" style={{ boxShadow: '0 15px 40px -10px rgba(0,0,0,0.05)' }}>
              <h3 className={`${HF} text-4xl lg:text-[2.8rem] text-[#1a1a1a] group-hover:text-white transition-colors duration-500 mb-1 leading-none`}>
                <CountUpNumber end={100} duration={2000} />+
              </h3>
              <p className="text-[9px] lg:text-[10px] font-bold tracking-[0.2em] text-[#888] group-hover:text-[#c9a55a] transition-colors duration-500 uppercase mt-1">
                Premium Products
              </p>
            </div>

          </div>

        </div>

        <p style={{
          fontSize: 12,
          lineHeight: 1.8,
          color: '#999',
          maxWidth: 340,
          margin: '32px auto 0',
          textAlign: 'center'
        }}>
          Premium Alcohol-Free Attars • Long-Lasting Perfumes • Oud • Bakhoor • Eid Gift Packs
        </p>
      </section>

      {/* ── BLOCK 3.5: Brand Details — Cards Left + Video Right ── */}
      <section style={{ padding: '60px 24px', background: '#f5f3ef' }}>
        <div className="flex flex-col-reverse lg:flex-row items-stretch justify-center gap-6 lg:gap-8 max-w-[1400px] mx-auto px-4">

          {/* Left: Brand Info Cards */}
          <div className="w-full lg:w-[45%] flex flex-col gap-5 lg:gap-6">

            {/* Info Card 1 */}
            <div className="group flex-1 flex flex-col justify-center items-center text-center bg-white rounded-[2rem] p-8 lg:py-10 transition-all duration-500 hover:bg-[#0a0a0a] hover:-translate-y-1 cursor-default border border-gray-100/50" style={{ boxShadow: '0 12px 30px -8px rgba(0,0,0,0.04)' }}>
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#c9a55a] uppercase mb-3">Our Heritage</p>
              <h3 className={`${HF} text-xl lg:text-2xl text-[#1a1a1a] group-hover:text-white transition-colors duration-500 leading-tight`}>
                Rooted in Tradition
              </h3>
            </div>

            {/* Info Card 2 */}
            <div className="group flex-1 flex flex-col justify-center items-center text-center bg-white rounded-[2rem] p-8 lg:py-10 transition-all duration-500 hover:bg-[#0a0a0a] hover:-translate-y-1 cursor-default border border-gray-100/50" style={{ boxShadow: '0 12px 30px -8px rgba(0,0,0,0.04)' }}>
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#c9a55a] uppercase mb-3">100% Alcohol Free</p>
              <h3 className={`${HF} text-xl lg:text-2xl text-[#1a1a1a] group-hover:text-white transition-colors duration-500 leading-tight`}>
                Pure & Premium Oils
              </h3>
            </div>

            {/* Info Card 3 */}
            <div className="group flex-1 flex flex-col justify-center items-center text-center bg-white rounded-[2rem] p-8 lg:py-10 transition-all duration-500 hover:bg-[#0a0a0a] hover:-translate-y-1 cursor-default border border-gray-100/50" style={{ boxShadow: '0 12px 30px -8px rgba(0,0,0,0.04)' }}>
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#c9a55a] uppercase mb-3">Expertly Blended</p>
              <h3 className={`${HF} text-xl lg:text-2xl text-[#1a1a1a] group-hover:text-white transition-colors duration-500 leading-tight`}>
                Made with Love
              </h3>
            </div>

          </div>

          {/* Right: Video */}
          <div className="w-full lg:w-[50%] flex" style={{ borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
            <video
              src="/assets/bro_this_is_the_logo.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', display: 'block', objectFit: 'cover', minHeight: '100%' }}
            />
          </div>

        </div>
      </section>

      {/* ── BLOCK 5: Why Customers Love Us (Apple Glassmorphism Style) ── */}
      <section className="relative overflow-hidden" style={{ padding: '100px 24px', background: '#fcfcfc' }}>
        {/* Soft abstract background blobs to create the frosted glass effect */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: '30vw', height: '30vw', minWidth: 300, minHeight: 300,
          background: 'radial-gradient(circle, rgba(201,165,90,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%',
          width: '30vw', height: '30vw', minWidth: 300, minHeight: 300,
          background: 'radial-gradient(circle, rgba(220,210,200,0.6) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
          {/* Section Header */}
          <div className="w-full flex flex-col items-center justify-center text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>💎 WHY CUSTOMERS LOVE US</p>
            <h2 className={`${HF} text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] leading-tight text-center`}>
              The <span style={{ color: GOLD }}>Rahmani</span> Difference
            </h2>
          </div>

          {/* Feature Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: '🌿', number: '0%', label: 'Alcohol', desc: 'Pure premium oils' },
              { icon: '⏳', number: '12h+', label: 'Lasting', desc: 'All day projection' },
              { icon: '🎁', number: '50+', label: 'Gift Sets', desc: 'Perfect for occasions' },
              { icon: '⭐', number: '5000+', label: 'Reviews', desc: 'Happy customers' },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden text-center cursor-default flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
                  borderRadius: '2rem',
                  padding: '48px 24px',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.65)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.05)';
                }}
              >
                <span className="text-4xl mb-5 block">{item.icon}</span>
                <h3 className={`${HF} text-4xl lg:text-5xl text-[#1a1a1a] mb-2 leading-none`}>{item.number}</h3>
                <p className="text-[12px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>{item.label}</p>
                <p className="text-[13px] text-[#777]">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Trust Strip */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mt-20 pt-10 w-full" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            {[
              'Premium Ingredients',
              'Blended with Care',
              'Free Shipping Available',
              'Easy Returns',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ color: GOLD, fontSize: 14 }}>✦</span>
                <p className="text-[11px] font-semibold tracking-[0.15em] text-[#666] uppercase">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOCK 5.5: CURSIVE TEXT BLOCK AND MARQUEE ── */}
      <section className="relative w-full bg-white overflow-hidden pb-10">
        <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-[#000] mt-20">
          <h2 className={`${greatVibes.className} text-[#c9a55a] text-center`} style={{ fontSize: 'clamp(5rem, 12vw, 15rem)', transform: 'rotate(-4deg)', letterSpacing: '0.05em' }}>
            Strongest Projection
          </h2>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 mt-20">
          <div className="border-y border-black overflow-hidden flex whitespace-nowrap py-4 my-10 bg-[#c9a55a]">
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

      {/* ── BLOCK 6: WhatsApp CTA ── */}
      <section style={{ padding: '8px 16px 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1a0f 0%, #0a120a 100%)',
          borderRadius: 22,
          padding: '24px 20px',
          border: '1px solid rgba(37,211,102,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Green glow */}
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(37,211,102,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#25D366', fontWeight: 700, marginBottom: 2 }}>
                📞 CALL / WHATSAPP NOW
              </p>
              <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>Limited Ramadan Stock Available</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
            <a href="https://wa.me/919234576090" target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: '#fff', borderRadius: 14, padding: '14px 12px',
                fontSize: 12, fontWeight: 700, textDecoration: 'none',
              }}>+91 92345 76090</a>
            <a href="https://wa.me/918540047972" target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(37,211,102,0.12)', color: '#25D366',
                borderRadius: 14, padding: '14px 12px',
                fontSize: 12, fontWeight: 700, border: '1px solid rgba(37,211,102,0.25)',
                textDecoration: 'none',
              }}>+91 85400 47972</a>
          </div>
        </div>
      </section>

      {/* ── BLOCK 7: CTA ── */}
      <section ref={ctaRef} style={{ padding: '16px 16px 48px', textAlign: 'center' }}>
        <Link href="/attars" style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: '#0a0a0a',
              color: '#fff',
              borderRadius: 60,
              padding: '16px 28px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1,
            }}>
              Explore Our Collection
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </section>
    </div>
  );
}
