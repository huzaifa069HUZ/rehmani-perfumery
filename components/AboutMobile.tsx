'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

/* ── Staggered children container ── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-30px' },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function AboutMobile() {
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['-5%', '10%']);

  return (
    <div style={{ background: '#f7f4ef', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════
          SECTION 1: HERO — Two Column Layout
      ══════════════════════════════════════════════ */}
      <section ref={parallaxRef} style={{ padding: '28px 20px 0' }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Label */}
          <motion.p variants={staggerItem} style={{
            fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
            fontWeight: 700, color: '#b8955a', marginBottom: 14,
          }}>ABOUT US</motion.p>

          {/* Two-column: text left, image right */}
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Left Column - Text */}
            <div style={{ flex: '1 1 48%', paddingTop: 4 }}>
              <motion.h1 variants={staggerItem} style={{
                fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
                fontSize: '1.65rem', fontWeight: 500, lineHeight: 1.18,
                color: '#1a1a1a', marginBottom: 16,
              }}>
                Rooted in Tradition.<br />Crafted for You.
              </motion.h1>

              {/* Gold divider */}
              <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                  style={{ height: 1.5, background: '#c4a46c' }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 12 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
                  style={{ height: 1.5, background: '#c4a46c', opacity: 0.4 }}
                />
              </motion.div>

              <motion.p variants={staggerItem} style={{
                fontSize: 12, lineHeight: 1.85, color: '#6b6b6b', maxWidth: 200,
              }}>
                Rahmani Perfumery is a celebration of heritage, craftsmanship and purity. For generations, we have been curating the finest attars to create timeless fragrances that resonate with your soul.
              </motion.p>
            </div>

            {/* Right Column - Hero Image with parallax */}
            <motion.div
              variants={staggerItem}
              style={{ flex: '1 1 52%', position: 'relative' }}
            >
              <div style={{
                width: '100%', height: 300, position: 'relative',
                borderRadius: '12px 12px 16px 16px', overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2: FEATURES STRIP — 4 Columns
      ══════════════════════════════════════════════ */}
      <motion.section {...scaleIn(0.05)} style={{ padding: '24px 12px' }}>
        <div style={{
          display: 'flex', background: '#fff', borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          border: '1px solid rgba(200,185,160,0.25)',
          overflow: 'hidden',
        }}>
          {[
            { title: 'PURE & NATURAL', desc: 'Ingredients sourced with care',
              path: 'M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z M9 16c1.5 1.5 4.5 1.5 6 0' },
            { title: 'ALCOHOL FREE', desc: '100% alcohol free attar',
              path: 'M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z M8 14h8 M12 10v8' },
            { title: 'HERITAGE CRAFTED', desc: 'Traditional distillation methods',
              path: 'M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7 M12 3l8 9H4l8-9z M9 16h6' },
            { title: 'TRUSTED QUALITY', desc: 'Uncompromising standards',
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
                borderRight: i < 3 ? '1px solid rgba(200,185,160,0.2)' : 'none',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8955a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d={f.path} />
              </svg>
              <p style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: '0.08em', color: '#2a2a2a', lineHeight: 1.3, textTransform: 'uppercase' }}>
                {f.title}
              </p>
              <p style={{ fontSize: 8, color: '#999', lineHeight: 1.4 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SECTION 3: THE ART OF PERFUMERY
      ══════════════════════════════════════════════ */}
      <section style={{ padding: '12px 0 24px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Left: Image with reveal animation */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: '42%', flexShrink: 0, position: 'relative', minHeight: 260,
              borderRadius: '0 14px 14px 0', overflow: 'hidden',
            }}
          >
            <Image src="/assets/category_attar.png" alt="Art of Perfumery" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.15) 100%)' }} />
          </motion.div>

          {/* Right: Content with stagger */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            style={{ flex: 1, padding: '16px 20px 16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <motion.p variants={staggerItem} style={{
              fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
              fontWeight: 700, color: '#b8955a', marginBottom: 8,
            }}>THE ART OF PERFUMERY</motion.p>

            <motion.h2 variants={staggerItem} style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.15rem', fontWeight: 500, lineHeight: 1.3,
              color: '#1a1a1a', marginBottom: 6,
            }}>
              Crafted with Time.<br />Perfected by Passion.
            </motion.h2>

            <motion.span variants={staggerItem} style={{ color: '#c4a46c', fontSize: 10, marginBottom: 10, display: 'block' }}>✦</motion.span>

            <motion.p variants={staggerItem} style={{ fontSize: 10.5, lineHeight: 1.8, color: '#777' }}>
              From selecting the finest raw materials to our meticulous distillation process, every step is guided by expertise and devotion. The result is a fragrance that speaks of elegance, luxury and lasting memories.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4: BUILT WITH LOVE — Full-width quote
      ══════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.8 }}
        style={{
          padding: '32px 20px',
          background: 'linear-gradient(180deg, #eee8dc 0%, #f2ece2 100%)',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.12 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: -20 }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#c4a46c" stroke="none" style={{ margin: '0 auto' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        <motion.p
          {...fadeUp(0.1)}
          style={{
            fontSize: 8.5, letterSpacing: '0.3em', textTransform: 'uppercase',
            fontWeight: 700, color: '#b8955a', marginBottom: 12,
          }}
        >MADE WITH LOVE</motion.p>

        <motion.h2
          {...fadeUp(0.2)}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.35,
            color: '#1a1a1a', marginBottom: 14, maxWidth: 300, margin: '0 auto 14px',
          }}
        >
          Every Drop Tells a Story of Passion & Devotion
        </motion.h2>

        <motion.p
          {...fadeUp(0.3)}
          style={{ fontSize: 11, lineHeight: 1.85, color: '#777', maxWidth: 320, margin: '0 auto 20px' }}
        >
          We don&apos;t just bottle fragrances — we capture emotions. Each attar is handcrafted with centuries-old techniques, infused with love, and designed to become a part of your most cherished moments.
        </motion.p>

        {/* Three value points */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
        >
          {[
            { emoji: '🌹', label: 'Hand-Picked\nIngredients' },
            { emoji: '💧', label: 'Zero Alcohol\nFormulation' },
            { emoji: '✨', label: 'Long Lasting\nProjection' },
          ].map((v, i) => (
            <motion.div key={i} variants={staggerItem} style={{
              flex: 1, maxWidth: 100, padding: '12px 8px',
              background: 'rgba(255,255,255,0.6)', borderRadius: 12,
              border: '1px solid rgba(200,185,160,0.2)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 18, marginBottom: 6 }}>{v.emoji}</p>
              <p style={{ fontSize: 8.5, fontWeight: 700, color: '#2a2a2a', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{v.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SECTION 5: OUR HERITAGE TIMELINE
      ══════════════════════════════════════════════ */}
      <motion.section {...fadeUp()} style={{ padding: '28px 16px 28px' }}>
        <p style={{
          fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
          fontWeight: 700, color: '#1a1a1a', marginBottom: 16,
        }}>OUR HERITAGE</p>

        <div style={{ width: '100%', height: 1, background: '#e2dbd0', marginBottom: 20 }} />

        {/* Timeline */}
        <div style={{ display: 'flex', position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', top: 17, left: '12.5%', right: '12.5%', height: 1,
            background: '#d4c5a9', zIndex: 0,
          }} />
          {[1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', top: 14, zIndex: 1,
              left: `${25 * i + 12.5}%`, transform: 'translateX(-50%)',
              width: 7, height: 7, borderRadius: '50%', background: '#c4a46c',
            }} />
          ))}

          {[
            { year: '1970s', desc: 'A humble beginning with a passion for natural fragrances.',
              iconPath: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M16 10a4 4 0 01-8 0' },
            { year: '1980s', desc: 'Growing trust and love from our valued customers.',
              iconPath: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
            { year: '2000s', desc: 'Expanding our collections while preserving purity.',
              iconPath: 'M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z' },
            { year: 'Today', desc: 'A legacy of excellence that continues to inspire generations.',
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8955a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.iconPath} />
                </svg>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{item.year}</p>
              <p style={{ fontSize: 8.5, lineHeight: 1.55, color: '#999', padding: '0 4px' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SECTION 6: BOTTOM QUOTE BANNER
      ══════════════════════════════════════════════ */}
      <motion.section {...scaleIn(0.05)} style={{ padding: '0 12px 8px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2c2620 0%, #1a1510 100%)',
          borderRadius: 16, padding: '20px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4a46c" strokeWidth="0.8" style={{ flexShrink: 0, marginTop: 2 }}>
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3" />
              <path d="M6.3 6.3l2.1 2.1 M15.6 15.6l2.1 2.1 M6.3 17.7l2.1-2.1 M15.6 8.4l2.1-2.1" />
            </svg>
            <div>
              <p style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c4a46c', fontWeight: 700, lineHeight: 1.7 }}>
                WE DON&apos;T JUST MAKE PERFUMES,
              </p>
              <p style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c4a46c', fontWeight: 700, lineHeight: 1.7 }}>
                WE CREATE MEMORIES THAT LAST FOREVER.
              </p>
            </div>
          </div>
          <p style={{
            fontFamily: '"Great Vibes", "Dancing Script", cursive',
            fontSize: 18, color: 'rgba(196,164,108,0.5)', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            Rahmani Perfumery
          </p>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SECTION 7: CTA — Explore Our Collection
      ══════════════════════════════════════════════ */}
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
            {/* Shimmer effect */}
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
            }}>
              Explore Our Collection
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4a46c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </Link>
      </motion.section>
    </div>
  );
}
