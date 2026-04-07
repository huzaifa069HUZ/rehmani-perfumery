'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const bottles = [
  { id: 1, name: 'Royal Oud',       notes: 'Oud · Amber · Musk',                price: '₹899',  desc: 'A bold, resinous oud wrapped in warm amber and skin-hugging white musk.', image: '/assets/attar1 remove bg.png', accent: '#C8963E', tag: 'Best Seller' },
  { id: 2, name: 'Midnight Musk',   notes: 'White Musk · Vanilla · Sandalwood', price: '₹649',  desc: 'A sensuous night-time fragrance designed to linger till sunrise.', image: '/assets/attar2removedbg.png', accent: '#A88EC0', tag: 'New Arrival' },
  { id: 3, name: 'Sicilian Citrus', notes: 'Bergamot · Lemon · Vetiver',        price: '₹549',  desc: 'A refreshing citrus burst from the sun-soaked groves of Sicily.', image: '/assets/attar1 remove bg.png', accent: '#7BAE7F', tag: 'Fresh Pick' },
  { id: 4, name: 'Velvet Rose',     notes: 'Damask Rose · Patchouli · Jasmine', price: '₹799',  desc: 'Pure Damask rose petals aged in precious patchouli—timeless femininity.', image: '/assets/attar2removedbg.png', accent: '#C0687A', tag: 'Limited' },
  { id: 5, name: 'Amiri Blend',     notes: 'Aged Oud · Saffron · Leather',      price: '₹1299', desc: 'A royal tribute crafted from sixty-year aged oud and precious saffron.', image: '/assets/attar1 remove bg.png', accent: '#D4AF37', tag: 'Premium' },
];

function mod(n: number, m: number) { return ((n % m) + m) % m; }

function getRelativeIndex(index: number, active: number, len: number) {
  let d = index - active;
  const half = Math.floor(len / 2);
  if (d > half) d -= len;
  if (d < -half) d += len;
  return d;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

/** Returns CSS-transform-friendly slot props per relative position */
function slotProps(diff: number, mobile: boolean) {
  if (diff === 0)  return { x: 0,    z: 0,    ry: 0,   s: 1,    o: 1,    blur: 0,  iw: mobile ? 160 : 240, ih: mobile ? 230 : 340, zi: 10 };
  if (diff === 1)  return { x: mobile ? 100 : 270, z: mobile ? -80 : -160,  ry: mobile ? -18 : -22, s: 0.70, o: 0.65, blur: 1,  iw: mobile ? 110 : 170, ih: mobile ? 160 : 260, zi: 6 };
  if (diff === -1) return { x: mobile ? -100 : -270, z: mobile ? -80 : -160, ry: mobile ? 18 : 22,  s: 0.70, o: 0.65, blur: 1,  iw: mobile ? 110 : 170, ih: mobile ? 160 : 260, zi: 6 };
  if (diff === 2)  return { x: mobile ? 160 : 510, z: -320,  ry: -38,  s: 0.40, o: mobile ? 0 : 0.18, blur: 3, iw: 100, ih: 140, zi: 2 };
  if (diff === -2) return { x: mobile ? -160 : -510, z: -320, ry: 38,   s: 0.40, o: mobile ? 0 : 0.18, blur: 3, iw: 100, ih: 140, zi: 2 };
  return { x: 0, z: -600, ry: 0, s: 0, o: 0, blur: 10, iw: 0, ih: 0, zi: 0 };
}

// Reduced-motion spring — lighter spring = GPU-friendlier
const SPRING = { type: 'spring' as const, stiffness: 220, damping: 28, mass: 1 };

export default function BottleCarousel() {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const mobile = useIsMobile();
  // Touch swipe
  const touchX = useRef<number | null>(null);

  const go = useCallback((dir: 1 | -1) => {
    if (busy) return;
    setBusy(true);
    setActive(prev => mod(prev + dir, bottles.length));
    setTimeout(() => setBusy(false), 420);
  }, [busy]);

  const goTo = useCallback((i: number) => {
    if (busy || i === active) return;
    setBusy(true);
    setActive(i);
    setTimeout(() => setBusy(false), 420);
  }, [busy, active]);

  // Auto-advance every 4s
  useEffect(() => {
    const id = setInterval(() => { if (!busy) go(1); }, 4000);
    return () => clearInterval(id);
  }, [go, busy]);

  const cur = bottles[active];

  return (
    <section
      id="signature-collection"
      style={{
        position: 'relative',
        background: 'linear-gradient(165deg, #050402 0%, #100c05 40%, #130f08 70%, #050402 100%)',
        padding: '48px 0 40px',
        overflow: 'hidden',
        // GPU layer hint
        willChange: 'transform',
      }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Ambient glow */}
      <motion.div
        key={active}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: `radial-gradient(ellipse 60% 55% at 50% 70%, ${cur.accent}26 0%, transparent 70%)`,
        }}
      />

      {/* Decorative fine-line grid (purely CSS, no JS weight) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.035,
        backgroundImage: 'linear-gradient(rgba(212,175,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.6) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Section title */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', marginBottom: 24, padding: '0 24px' }}>
        <span style={{
          display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.35em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 12,
        }}>Signature Collection</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
          fontWeight: 700, color: '#F5EDD8',
          margin: '0 0 10px', lineHeight: 1.15,
        }}>Our Finest Attars</h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
          Handcrafted from the rarest ingredients, each attar tells a story.
        </p>
      </div>

      {/* 3D Stage */}
      <div
        style={{
          position: 'relative', zIndex: 5,
          height: mobile ? 300 : 440,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          perspective: mobile ? 800 : 1200,
          perspectiveOrigin: '50% 100%',
        }}
      >
        {bottles.map((bottle, i) => {
          const diff = getRelativeIndex(i, active, bottles.length);
          const sp = slotProps(diff, mobile);
          const isCenter = diff === 0;
          const isSide = Math.abs(diff) === 1;

          return (
            <motion.div
              key={bottle.id}
              onClick={() => !isCenter && go(diff > 0 ? 1 : -1)}
              initial={false}
              animate={{
                x: sp.x,
                z: sp.z,
                rotateY: sp.ry,
                scale: sp.s,
                opacity: sp.o,
              }}
              transition={SPRING}
              style={{
                position: 'absolute',
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: sp.iw,
                transformStyle: 'preserve-3d',
                // GPU compositing — critical for 60fps
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                cursor: isCenter ? 'default' : 'pointer',
                userSelect: 'none',
                zIndex: sp.zi,
                // Blur via CSS filter instead of Framer animate → avoids reflow
                filter: sp.blur > 0 ? `blur(${sp.blur}px) brightness(0.6)` : undefined,
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', height: sp.ih, flexShrink: 0 }}>
                {isCenter && (
                  <div style={{
                    position: 'absolute', bottom: -8, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '55%', height: 28,
                    background: 'radial-gradient(ellipse, rgba(0,0,0,0.75) 0%, transparent 72%)',
                    filter: 'blur(10px)',
                  }} />
                )}
                <Image
                  src={bottle.image}
                  alt={bottle.name}
                  fill
                  sizes={`${sp.iw}px`}
                  priority={isCenter || isSide}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'bottom',
                    filter: isCenter
                      ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.65)) drop-shadow(0 0 20px rgba(212,175,55,0.18))'
                      : undefined,
                  }}
                />
              </div>

              {/* Side label */}
              {isSide && (
                <p style={{
                  marginTop: 10, fontSize: '0.64rem', fontWeight: 600,
                  letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {bottle.name}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info Card — premium redesign */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'relative', zIndex: 5,
            maxWidth: 420, margin: mobile ? '22px 20px 0' : '28px auto 0',
            background: 'rgba(255,255,255,0.035)',
            border: `1px solid ${cur.accent}33`,
            borderRadius: 16,
            padding: mobile ? '20px 22px' : '26px 32px',
            backdropFilter: 'blur(12px)',
            // Subtle top glow line
            boxShadow: `0 -1px 0 0 ${cur.accent}40 inset, 0 20px 60px rgba(0,0,0,0.3)`,
          }}
        >
          {/* Tag badge */}
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.18em',
              color: cur.accent, textTransform: 'uppercase',
              background: `${cur.accent}18`,
              border: `1px solid ${cur.accent}33`,
              padding: '3px 10px', borderRadius: 20,
            }}>
              {cur.tag}
            </span>
            <span style={{
              fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {active + 1} / {bottles.length}
            </span>
          </div>

          {/* Name */}
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? '1.4rem' : '1.7rem',
            fontWeight: 700, color: '#F5EDD8',
            margin: '0 0 6px', lineHeight: 1.2,
            letterSpacing: '0.01em',
          }}>
            {cur.name}
          </h3>

          {/* Notes pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {cur.notes.split(' · ').map(note => (
              <span key={note} style={{
                fontSize: '0.65rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '3px 10px', borderRadius: 20,
                letterSpacing: '0.05em',
              }}>
                {note}
              </span>
            ))}
          </div>

          {/* Description */}
          <p style={{
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.65, margin: '0 0 20px',
          }}>
            {cur.desc}
          </p>

          {/* Price + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontSize: mobile ? '1.5rem' : '1.7rem',
              fontWeight: 800, color: '#D4AF37',
              letterSpacing: '-0.01em',
            }}>
              {cur.price}
            </span>
            <a
              href="/attars"
              style={{
                flex: 1, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${cur.accent} 0%, ${cur.accent}bb 100%)`,
                color: '#000',
                fontWeight: 800, fontSize: '0.78rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Shop Now →
            </a>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation row */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, marginTop: 24, padding: '0 20px',
      }}>
        {/* Prev */}
        <button
          onClick={() => go(-1)}
          disabled={busy}
          aria-label="Previous"
          style={{
            width: 46, height: 46, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: busy ? 'default' : 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s',
            opacity: busy ? 0.35 : 1,
            flexShrink: 0,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {bottles.map((b, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${b.name}`}
              style={{
                height: 7,
                width: i === active ? 24 : 7,
                borderRadius: 4,
                border: `1px solid ${i === active ? cur.accent : 'rgba(255,255,255,0.25)'}`,
                background: i === active ? cur.accent : 'transparent',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => go(1)}
          disabled={busy}
          aria-label="Next"
          style={{
            width: 46, height: 46, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: busy ? 'default' : 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s',
            opacity: busy ? 0.35 : 1,
            flexShrink: 0,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Bottom spacing */}
      <div style={{ height: 8 }} />
    </section>
  );
}
