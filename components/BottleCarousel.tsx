'use client';
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselBackground } from '@/components/ui/background-paths';

const bottles = [
  { id: 1, name: 'Royal Oud',       notes: 'Oud · Amber · Musk',                price: '₹899',  image: '/assets/attar1 remove bg.png', accent: '#C8963E' },
  { id: 2, name: 'Midnight Musk',   notes: 'White Musk · Vanilla · Sandalwood', price: '₹649',  image: '/assets/attar2removedbg.png', accent: '#A88EC0' },
  { id: 3, name: 'Sicilian Citrus', notes: 'Bergamot · Lemon · Vetiver',        price: '₹549',  image: '/assets/attar1 remove bg.png', accent: '#7BAE7F' },
  { id: 4, name: 'Velvet Rose',     notes: 'Damask Rose · Patchouli · Jasmine', price: '₹799',  image: '/assets/attar2removedbg.png', accent: '#C0687A' },
  { id: 5, name: 'Amiri Blend',     notes: 'Aged Oud · Saffron · Leather',      price: '₹1299', image: '/assets/attar1 remove bg.png', accent: '#D4AF37' },
];

function mod(n: number, m: number) { return ((n % m) + m) % m; }

export default function BottleCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0); // +1 = next, -1 = prev
  const [animating, setAnimating] = useState(false);

  const go = useCallback((dir: 1 | -1) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setActive(prev => mod(prev + dir, bottles.length));
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const goTo = useCallback((i: number) => {
    if (animating || i === active) return;
    setDirection(i > active ? 1 : -1);
    setAnimating(true);
    setActive(i);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, active]);

  const current = bottles[active];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function getRelativeIndex(index: number, activeIndex: number, length: number) {
    let diff = index - activeIndex;
    const half = Math.floor(length / 2);
    if (diff > half) diff -= length;
    if (diff < -half) diff += length;
    return diff;
  }

  function getSlotProps(diff: number) {
    if (diff === 0) {
      return { x: 0, z: 0, ry: 0, s: 1, o: 1, bl: 0, w: isMobile ? 180 : 220, ih: isMobile ? 260 : 320, zIndex: 10 };
    } else if (diff === 1) {
      return { x: isMobile ? 120 : 260, z: isMobile ? -100 : -150, ry: isMobile ? -30 : -26, s: 0.68, o: 0.6, bl: 0.5, w: isMobile ? 120 : 170, ih: isMobile ? 180 : 250, zIndex: 5 };
    } else if (diff === -1) {
      return { x: isMobile ? -120 : -260, z: isMobile ? -100 : -150, ry: isMobile ? 30 : 26, s: 0.68, o: 0.6, bl: 0.5, w: isMobile ? 120 : 170, ih: isMobile ? 180 : 250, zIndex: 5 };
    } else if (diff === 2) {
      return { x: isMobile ? 160 : 520, z: isMobile ? -200 : -300, ry: isMobile ? -45 : -38, s: 0.42, o: isMobile ? 0 : 0.15, bl: 3, w: isMobile ? 80 : 100, ih: isMobile ? 100 : 140, zIndex: 1 };
    } else if (diff === -2) {
      return { x: isMobile ? -160 : -520, z: isMobile ? -200 : -300, ry: isMobile ? 45 : 38, s: 0.42, o: isMobile ? 0 : 0.15, bl: 3, w: isMobile ? 80 : 100, ih: isMobile ? 100 : 140, zIndex: 1 };
    }
    return { x: 0, z: -500, ry: 0, s: 0, o: 0, bl: 10, w: 0, ih: 0, zIndex: 0 };
  }

  return (
    <section
      id="signature-collection"
      style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #050402 0%, #0f0b04 35%, #13100a 65%, #050402 100%)',
        padding: '30px 0 30px',
        overflow: 'hidden',
      }}
    >
      {/* Animated BackgroundPaths overlay */}
      <CarouselBackground />

      {/* Ambient glow that changes with active bottle */}
      <motion.div
        animate={{ opacity: 1 }}
        key={active}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: `radial-gradient(ellipse 65% 50% at 50% 68%, ${current.accent}22 0%, transparent 70%)`,
        }}
      />

      {/* Section header */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', marginBottom: 20 }}>
        <span style={{
          display: 'inline-block', fontSize: '0.65rem', fontWeight: 700,
          letterSpacing: '0.35em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 14,
        }}>
          Signature Collection
        </span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.9rem, 4vw, 3rem)',
          fontWeight: 700, color: '#F5EDD8', margin: '0 0 10px', lineHeight: 1.15,
        }}>
          Our Finest Attars
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.42)', maxWidth: 380, margin: '0 auto' }}>
          Handcrafted from the rarest ingredients, each attar tells a story.
        </p>
      </div>

      {/* 3D Stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          height: 480,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          perspective: '1000px',
          perspectiveOrigin: '50% 100%',
        }}
      >
        {bottles.map((bottle, i) => {
          const diff = getRelativeIndex(i, active, bottles.length);
          const props = getSlotProps(diff);
          const isCenter = diff === 0;
          const isFar = Math.abs(diff) > 1;

          return (
            <motion.div
              key={bottle.id}
              onClick={() => !isCenter && go(diff > 0 ? 1 : -1)}
              initial={false}
              animate={{
                x: props.x,
                z: props.z,
                rotateY: props.ry,
                scale: props.s,
                opacity: props.o,
                filter: props.bl > 0 ? `blur(${props.bl}px) brightness(0.65)` : 'blur(0px) brightness(1)',
                width: props.w,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 25,
                mass: 1.2,
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transformStyle: 'preserve-3d',
                cursor: isCenter ? 'default' : 'pointer',
                userSelect: 'none',
                zIndex: props.zIndex,
              }}
            >
              {/* Image wrapper — must be position:relative with explicit height */}
              <motion.div 
                initial={false}
                animate={{ height: props.ih }} 
                transition={{ type: 'spring', stiffness: 260, damping: 25, mass: 1.2 }}
                style={{ position: 'relative', width: '100%', flexShrink: 0 }}
              >
                {isCenter && (
                  <div style={{
                    position: 'absolute', bottom: -8, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%', height: 30,
                    background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)',
                    filter: 'blur(12px)',
                  }} />
                )}
                <Image
                  src={bottle.image}
                  alt={bottle.name}
                  fill
                  sizes={`${props.w}px`}
                  priority={isCenter}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'bottom',
                    filter: isCenter
                      ? 'drop-shadow(0 24px 48px rgba(0,0,0,0.7)) drop-shadow(0 0 24px rgba(212,175,55,0.15))'
                      : 'none',
                  }}
                />
              </motion.div>

              {/* Side bottle name label */}
              {!isFar && !isCenter && (
                <p style={{
                  marginTop: 10, fontSize: '0.68rem', fontWeight: 600,
                  letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap',
                }}>
                  {bottle.name}
                </p>
              )}

              {/* Center info panel */}
              {isCenter && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ marginTop: 22, textAlign: 'center', width: '100%' }}
                  >
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.5rem', fontWeight: 700,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      color: current.accent, margin: '0 0 6px',
                    }}>
                      {bottle.name}
                    </h3>
                    <p style={{
                      fontSize: '0.76rem', color: 'rgba(255,255,255,0.46)',
                      letterSpacing: '0.1em', margin: '0 0 16px',
                    }}>
                      {bottle.notes}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#D4AF37' }}>
                        {bottle.price}
                      </span>
                      <a
                        href="#collections"
                        style={{
                          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em',
                          textTransform: 'uppercase', color: '#fff',
                          borderBottom: '1px solid rgba(255,255,255,0.3)',
                          paddingBottom: 2, textDecoration: 'none',
                        }}
                      >
                        Shop Now →
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation row */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 28, marginTop: 24,
      }}>
        {/* Prev */}
        <button
          onClick={() => go(-1)}
          disabled={animating}
          aria-label="Previous perfume"
          style={{
            width: 50, height: 50, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: animating ? 'default' : 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.25s',
            opacity: animating ? 0.4 : 1,
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {bottles.map((b, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${b.name}`}
              animate={{
                width: i === active ? 22 : 7,
                background: i === active ? current.accent : 'transparent',
                borderColor: i === active ? current.accent : 'rgba(255,255,255,0.3)',
              }}
              transition={{ duration: 0.3 }}
              style={{
                height: 7,
                borderRadius: 4,
                border: `1px solid`,
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => go(1)}
          disabled={animating}
          aria-label="Next perfume"
          style={{
            width: 50, height: 50, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: animating ? 'default' : 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.25s',
            opacity: animating ? 0.4 : 1,
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
