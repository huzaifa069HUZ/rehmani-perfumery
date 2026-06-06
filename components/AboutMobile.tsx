'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

/* ── Animation presets ── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as any } },
};
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as any },
});
const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.94 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-30px' },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as any },
});

/* ── Clip-path shapes ── */
const CLIP = {
  blob1: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  blob2: 'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  arch: 'ellipse(50% 48% at 50% 52%)',
  leaf: 'polygon(50% 0%, 90% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 10% 20%)',
  petal: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 95%, 50% 100%, 20% 95%, 0% 70%, 0% 35%, 20% 10%)',
  shield: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%)',
};

/* ── Color tokens ── */
const C = {
  cream: '#f7f4ef',
  warmWhite: '#fdf9f3',
  sand: '#eee8dc',
  gold: '#c9a55a',
  goldDark: '#a08030',
  goldLight: '#e8d5a8',
  dark: '#1a1a1a',
  darkSoft: '#2a2520',
  textMuted: '#777',
  textLight: '#999',
  border: 'rgba(200,185,160,0.25)',
};

export default function AboutMobile() {
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['-5%', '10%']);

  return (
    <div style={{ background: C.cream, overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HERO: Tagline + Custom-cut image
      ══════════════════════════════════════════════════════════ */}
      <section ref={parallaxRef} style={{ padding: '28px 20px 0' }}>
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          {/* Label */}
          <motion.p variants={staggerItem} style={{
            fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
            fontWeight: 700, color: C.gold, marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 24, height: 1.5, background: C.gold, display: 'inline-block' }} />
            ABOUT US
          </motion.p>

          {/* Two-column: text left, custom-cut image right */}
          <div style={{ display: 'flex', gap: 14 }}>
            {/* Left - Text */}
            <div style={{ flex: '1 1 48%', paddingTop: 4 }}>
              <motion.h1 variants={staggerItem} style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.6rem', fontWeight: 500, lineHeight: 1.18,
                color: C.dark, marginBottom: 12,
              }}>
                Wear <span style={{ color: C.gold }}>Confidence.</span><br />
                Wear Identity.<br />
                Wear <span style={{ color: C.gold }}>Memories.</span>
              </motion.h1>

              {/* Animated divider with sparkle */}
              <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 44 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                  style={{ height: 1.5, background: `linear-gradient(90deg, ${C.gold}, transparent)` }}
                />
                <span style={{ fontSize: 12, color: C.gold }}>✦</span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 16 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
                  style={{ height: 1.5, background: C.gold, opacity: 0.3 }}
                />
              </motion.div>

              <motion.p variants={staggerItem} style={{
                fontSize: 11, lineHeight: 1.85, color: C.textMuted, maxWidth: 200,
              }}>
                Premium Long-Lasting Attars &bull; Exquisite Perfumes &bull; Oud &bull; Bakhoor &bull; Eid Gift Packs
              </motion.p>
            </div>

            {/* Right - Custom shaped hero image */}
            <motion.div
              variants={staggerItem}
              style={{ flex: '1 1 52%', position: 'relative' }}
            >
              <div style={{
                width: '100%', height: 310, position: 'relative',
                clipPath: CLIP.shield,
                overflow: 'hidden',
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',
              }}>
                <motion.div style={{ y: heroImgY, position: 'absolute', inset: '-10% 0', width: '100%', height: '120%' }}>
                  <Image
                    src="/assets/about-hero-mobile.png"
                    alt="Rahmani Perfumery Products"
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </motion.div>
                {/* Gold border overlay inside clip */}
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '2px solid rgba(201,165,90,0.3)',
                  clipPath: CLIP.shield,
                  pointerEvents: 'none',
                }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — WHAT WE BRING: 4 Product Category Cards
      ══════════════════════════════════════════════════════════ */}
      <motion.section {...fadeUp()} style={{ padding: '30px 16px 16px' }}>
        <motion.p {...fadeUp(0)} style={{
          fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase',
          fontWeight: 700, color: C.gold, marginBottom: 6, textAlign: 'center',
        }}>AT RAHMANI PERFUMERY</motion.p>
        <motion.h2 {...fadeUp(0.05)} style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '1.3rem', fontWeight: 500, lineHeight: 1.3,
          color: C.dark, textAlign: 'center', marginBottom: 18,
        }}>
          We Bring You the <span style={{ color: C.gold }}>Finest</span>
        </motion.h2>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: '-20px' }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
        >
          {[
            { icon: '🌟', title: 'Premium Long-Lasting Attars', desc: 'Pure, potent & crafted with heritage techniques' },
            { icon: '🌟', title: 'Long-Lasting Imported Perfumes', desc: 'International fragrances that project & endure' },
            { icon: '🌟', title: 'Exclusive Ramadan & Eid Gift Packs', desc: 'Curated luxury sets for special occasions' },
            { icon: '🌟', title: 'Bakhoor & Home Fragrance', desc: 'Fill your space with captivating aromas' },
          ].map((item, i) => (
            <motion.div
              key={i} variants={staggerItem}
              style={{
                background: '#fff',
                borderRadius: 18, padding: '18px 14px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', gap: 7,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Warm glow */}
              <div style={{
                position: 'absolute', top: -20, right: -20, width: 70, height: 70,
                background: 'radial-gradient(circle, rgba(201,165,90,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <span style={{ fontSize: 20, position: 'relative', zIndex: 1 }}>{item.icon}</span>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.dark, lineHeight: 1.35, position: 'relative', zIndex: 1 }}>{item.title}</p>
              <p style={{ fontSize: 9.5, color: C.textLight, lineHeight: 1.55, position: 'relative', zIndex: 1 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — ART OF PERFUMERY: Custom diamond-cut image
      ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '16px 0 24px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Left: Diamond-cut image */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: '44%', flexShrink: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: '8px 0 8px 12px',
            }}
          >
            <div style={{
              width: '100%', aspectRatio: '3/4', position: 'relative',
              clipPath: CLIP.petal,
              overflow: 'hidden',
              filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.1))',
            }}>
              <Image src="/assets/category_attar.png" alt="Art of Perfumery" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.12) 100%)' }} />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            style={{ flex: 1, padding: '16px 20px 16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <motion.p variants={staggerItem} style={{
              fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
              fontWeight: 700, color: C.gold, marginBottom: 8,
            }}>THE ART OF PERFUMERY</motion.p>
            <motion.h2 variants={staggerItem} style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.15rem', fontWeight: 500, lineHeight: 1.3,
              color: C.dark, marginBottom: 6,
            }}>
              Crafted with Time.<br />Perfected by <span style={{ color: C.gold }}>Passion.</span>
            </motion.h2>
            <motion.span variants={staggerItem} style={{ color: C.gold, fontSize: 10, marginBottom: 10, display: 'block' }}>✦</motion.span>
            <motion.p variants={staggerItem} style={{ fontSize: 10.5, lineHeight: 1.8, color: C.textMuted }}>
              From selecting the finest raw materials to our meticulous distillation process, every step is guided by expertise and devotion.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — FEATURES STRIP (4-icon bar)
      ══════════════════════════════════════════════════════════ */}
      <motion.section {...scaleIn(0.05)} style={{ padding: '0 12px 20px' }}>
        <div style={{
          display: 'flex', background: '#fff', borderRadius: 18,
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: `1px solid ${C.border}`, overflow: 'hidden',
        }}>
          {[
            { title: 'PURE & NATURAL', desc: 'Sourced with care',
              path: 'M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z M9 16c1.5 1.5 4.5 1.5 6 0' },
            { title: 'LONG LASTING', desc: '100% long-lasting fragrance',
              path: 'M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z M8 14h8 M12 10v8' },
            { title: 'HERITAGE CRAFTED', desc: 'Traditional methods',
              path: 'M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7 M12 3l8 9H4l8-9z M9 16h6' },
            { title: 'TRUSTED QUALITY', desc: 'Uncompromising',
              path: 'M12 2l2.09 6.26L20 9.27l-4.91 3.82L16.18 20 12 16.77 7.82 20l1.09-6.91L4 9.27l5.91-1.01L12 2z' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                flex: 1, padding: '16px 6px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center', gap: 6,
                borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d={f.path} />
              </svg>
              <p style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: '0.08em', color: C.dark, lineHeight: 1.3, textTransform: 'uppercase' }}>
                {f.title}
              </p>
              <p style={{ fontSize: 8, color: C.textLight, lineHeight: 1.4 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — WHY CUSTOMERS LOVE US (Horizontal scroll)
      ══════════════════════════════════════════════════════════ */}
      <motion.section {...fadeUp()} style={{ padding: '12px 0 28px' }}>
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 700, color: C.gold, marginBottom: 6 }}>
            💎 WHY CUSTOMERS LOVE US
          </p>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.3, color: C.dark,
          }}>
            Trusted by <span style={{ color: C.gold }}>Hundreds</span> of Happy Customers
          </h2>
        </div>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          style={{
            display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 8px',
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {[
            { icon: '✔️', title: 'Strong Projection', subtitle: '& Long Lasting', desc: 'Fragrances that stay with you from dawn to dusk', bg: 'linear-gradient(135deg, #fff8ed, #fff3e0)' },
            { icon: '✔️', title: 'Premium Quality', subtitle: 'Affordable Price', desc: 'Luxury fragrances that don\'t break the bank', bg: 'linear-gradient(135deg, #f3f0ff, #ede7f6)' },
            { icon: '✔️', title: 'Perfect for', subtitle: 'Gifting', desc: 'Beautifully packaged for every special occasion', bg: 'linear-gradient(135deg, #f0faf5, #e0f2f1)' },
            { icon: '✔️', title: 'Hundreds of', subtitle: 'Happy Customers', desc: 'Loved and trusted across India', bg: 'linear-gradient(135deg, #fffde7, #fff9c4)' },
          ].map((item, i) => (
            <motion.div
              key={i} variants={staggerItem}
              style={{
                minWidth: 155, maxWidth: 155, scrollSnapAlign: 'start', flexShrink: 0,
                background: item.bg,
                borderRadius: 18, padding: '20px 16px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 12 }}>{item.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, lineHeight: 1.3, marginBottom: 2 }}>{item.title}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.gold, lineHeight: 1.3, marginBottom: 10 }}>{item.subtitle}</p>
              <p style={{ fontSize: 9.5, color: C.textMuted, lineHeight: 1.55 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — EVERY DROP TELLS A STORY (Warm Quote + Blob Image)
      ══════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.8 }}
        style={{
          padding: '32px 20px',
          background: `linear-gradient(180deg, ${C.sand} 0%, #f2ece2 100%)`,
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Blob-shaped decorative image behind text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.08, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 280, height: 280,
            clipPath: CLIP.blob2,
            overflow: 'hidden', pointerEvents: 'none',
          }}
        >
          <Image src="/assets/bakhoor.png" alt="" fill style={{ objectFit: 'cover' }} />
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.12 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: -20, position: 'relative', zIndex: 0 }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill={C.gold} stroke="none" style={{ margin: '0 auto' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        <motion.p {...fadeUp(0.1)} style={{
          fontSize: 8.5, letterSpacing: '0.3em', textTransform: 'uppercase',
          fontWeight: 700, color: C.gold, marginBottom: 12, position: 'relative', zIndex: 1,
        }}>MADE WITH LOVE</motion.p>

        <motion.h2 {...fadeUp(0.2)} style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.35,
          color: C.dark, marginBottom: 14, maxWidth: 300, margin: '0 auto 14px',
          position: 'relative', zIndex: 1,
        }}>
          Every Drop Tells a Story of Passion & Devotion
        </motion.h2>

        <motion.p {...fadeUp(0.3)} style={{
          fontSize: 11, lineHeight: 1.85, color: C.textMuted, maxWidth: 320, margin: '0 auto 20px',
          position: 'relative', zIndex: 1,
        }}>
          We don&apos;t just bottle fragrances — we capture emotions. Each attar is handcrafted with centuries-old techniques, infused with love, and designed to become a part of your most cherished moments.
        </motion.p>

        {/* Three value points */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'flex', gap: 8, justifyContent: 'center', position: 'relative', zIndex: 1 }}
        >
          {[
            { emoji: '🌹', label: 'Hand-Picked\nIngredients' },
            { emoji: '💧', label: 'Long Lasting\nFormulation' },
            { emoji: '✨', label: 'Long Lasting\nProjection' },
          ].map((v, i) => (
            <motion.div key={i} variants={staggerItem} style={{
              flex: 1, maxWidth: 100, padding: '12px 8px',
              background: 'rgba(255,255,255,0.6)', borderRadius: 12,
              border: `1px solid ${C.border}`, textAlign: 'center',
            }}>
              <p style={{ fontSize: 18, marginBottom: 6 }}>{v.emoji}</p>
              <p style={{ fontSize: 8.5, fontWeight: 700, color: C.dark, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{v.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — HERITAGE TIMELINE
      ══════════════════════════════════════════════════════════ */}
      <motion.section {...fadeUp()} style={{ padding: '28px 16px 28px' }}>
        <p style={{
          fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
          fontWeight: 700, color: C.dark, marginBottom: 16,
        }}>OUR HERITAGE</p>

        <div style={{ width: '100%', height: 1, background: '#e2dbd0', marginBottom: 20 }} />

        <div style={{ display: 'flex', position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', top: 17, left: '12.5%', right: '12.5%', height: 1,
            background: `linear-gradient(90deg, transparent, ${C.goldLight}, transparent)`, zIndex: 0,
          }} />
          {[1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              style={{
                position: 'absolute', top: 14, zIndex: 1,
                left: `${25 * i + 12.5}%`, transform: 'translateX(-50%)',
                width: 7, height: 7, borderRadius: '50%', background: C.gold,
              }}
            />
          ))}

          {[
            { year: '1970s', desc: 'A humble beginning with a passion for natural fragrances.',
              iconPath: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M16 10a4 4 0 01-8 0' },
            { year: '1980s', desc: 'Growing trust and love from our valued customers.',
              iconPath: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
            { year: '2000s', desc: 'Expanding our collections while preserving purity.',
              iconPath: 'M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z' },
            { year: 'Today', desc: 'A legacy of excellence that continues to inspire.',
              iconPath: 'M12 2l2.09 6.26L20 9.27l-4.91 3.82L16.18 20 12 16.77 7.82 20l1.09-6.91L4 9.27l5.91-1.01L12 2z' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', position: 'relative', zIndex: 2,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#f9f6f0', border: '1.5px solid #e2dbd0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 8,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.iconPath} />
                </svg>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 4 }}>{item.year}</p>
              <p style={{ fontSize: 8.5, lineHeight: 1.55, color: C.textLight, padding: '0 4px' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 8 — WHATSAPP CTA
      ══════════════════════════════════════════════════════════ */}
      <motion.section {...scaleIn(0.05)} style={{ padding: '0 14px 16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1a0f 0%, #0a120a 100%)',
          borderRadius: 20, padding: '22px 18px',
          border: '1px solid rgba(37,211,102,0.15)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Green glow */}
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(37,211,102,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
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
                color: '#fff', borderRadius: 14, padding: '13px 12px',
                fontSize: 12, fontWeight: 700, textDecoration: 'none',
              }}>+91 92345 76090</a>
            <a href="https://wa.me/918540047972" target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(37,211,102,0.12)', color: '#25D366',
                borderRadius: 14, padding: '13px 12px',
                fontSize: 12, fontWeight: 700, border: '1px solid rgba(37,211,102,0.25)',
                textDecoration: 'none',
              }}>+91 85400 47972</a>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 9 — BOTTOM QUOTE BANNER
      ══════════════════════════════════════════════════════════ */}
      <motion.section {...scaleIn(0.05)} style={{ padding: '0 12px 8px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2c2620 0%, #1a1510 100%)',
          borderRadius: 16, padding: '20px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="0.8" style={{ flexShrink: 0, marginTop: 2 }}>
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3" />
              <path d="M6.3 6.3l2.1 2.1 M15.6 15.6l2.1 2.1 M6.3 17.7l2.1-2.1 M15.6 8.4l2.1-2.1" />
            </svg>
            <div>
              <p style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, fontWeight: 700, lineHeight: 1.7 }}>
                WE DON&apos;T JUST MAKE PERFUMES,
              </p>
              <p style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, fontWeight: 700, lineHeight: 1.7 }}>
                WE CREATE MEMORIES THAT LAST FOREVER.
              </p>
            </div>
          </div>
          <p style={{
            fontFamily: '"Great Vibes", "Dancing Script", cursive',
            fontSize: 18, color: `${C.gold}50`, flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            Rahmani Perfumery
          </p>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 10 — CTA BUTTON
      ══════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{ padding: '16px 16px 32px', textAlign: 'center' }}
      >
        <Link href="/attars" style={{ textDecoration: 'none' }}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2520 100%)',
              color: '#fff', borderRadius: 60, padding: '16px 28px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                pointerEvents: 'none',
              }}
            />
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', position: 'relative', zIndex: 1,
            }}>Explore Our Collection</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </Link>
      </motion.section>
    </div>
  );
}
