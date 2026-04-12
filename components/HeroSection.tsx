'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ── Mobile slides ──────────────────────────────────────────────────────── */
const MOBILE_SLIDES: { type: 'image' | 'video'; src: string; alt?: string }[] = [
  { type: 'video', src: '/assets/Video-16.mp4', alt: 'Rehmani Perfumery Hero' },
  { type: 'image', src: '/assets/SMELL THAT DEFINES YOU (4).png', alt: 'Smell That Defines You' },
  { type: 'video', src: '/assets/hero mobile bg 2.mp4', alt: 'Hero Mobile Background 2' },
  { type: 'video', src: '/assets/herosection bg vid mobile.mp4' },
  { type: 'image', src: '/assets/FRAGRANCE THAT YOU SOUL DESIRES (1).png', alt: 'Fragrance That Your Soul Desires' },
];

const SLIDE_DURATION = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const total = MOBILE_SLIDES.length;

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((idx + total) % total);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, total]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, SLIDE_DURATION);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, resetTimer]);

  useEffect(() => {
    if (MOBILE_SLIDES[current].type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
      resetTimer();
    }
  };

  return (
    <section className="hero-section" id="hero">
      {/* ── DESKTOP background ── */}
      <Image
        src="/herobg2.png"
        alt="Hero Background"
        fill
        priority
        quality={95}
        className="hero-desktop-bg"
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 1 }}
      />

      {/* ── MOBILE swiper ── */}
      <div
        className="hero-mobile-swiper"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {MOBILE_SLIDES.map((slide, i) => (
          <div key={i} className={`hero-mobile-slide ${i === current ? 'active' : ''}`}>
            {slide.type === 'image' ? (
              <Image
                src={slide.src}
                alt={slide.alt || ''}
                fill
                priority={i === 0}
                quality={95}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <video
                ref={i === current ? videoRef : undefined}
                src={slide.src}
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            )}
          </div>
        ))}

        {/* CTA buttons — mobile only */}
        <div className="mobile-hero-cta">
          <a href="#collections" className="mobile-btn-primary">
            DISCOVER COLLECTION
          </a>
          <a href="#story" className="mobile-btn-ghost">
            OUR STORY
          </a>
        </div>

        {/* Dot indicators */}
        <div className="swiper-dots">
          {MOBILE_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`swiper-dot ${i === current ? 'active' : ''}`}
              onClick={() => { goTo(i); resetTimer(); }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop overlay */}
      <div className="hero-overlay" />

      {/* ── DESKTOP content only ── */}
      <div className="hero-content hero-desktop-content">
        <div className="hero-right-block">
          <div className="hero-title-block fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="hero-badge-text">PREMIUM ARABIAN ATTARS</span>
            <h1 className="hero-title-main">RAHMANI<br />PERFUMERY</h1>
          </div>

          <div className="hero-arabic fade-in" style={{ animationDelay: '0.5s' }} dir="rtl">
            عطر رحماني
          </div>

          <p className="hero-tagline fade-in" style={{ animationDelay: '0.7s' }}>
            Pure Attar. Pure Identity.<br />
            Crafted with passion since 2015.
          </p>

          <div className="hero-actions fade-in" style={{ animationDelay: '0.9s' }}>
            <a href="#collections" className="btn-primary">DISCOVER COLLECTION →</a>
            <a href="#story" className="btn-ghost">OUR STORY</a>
          </div>

          <div className="hero-stats fade-in" style={{ animationDelay: '1.1s' }}>
            <div className="hero-stat">
              <span className="stat-value">25+</span>
              <span className="stat-label">SIGNATURE ATTARS</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">PURE OILS</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">SINCE 2015</span>
              <span className="stat-label">TRUSTED HERITAGE</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Mobile swiper ── */
        .hero-mobile-swiper {
          display: none;
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          touch-action: pan-y;
        }

        @media (max-width: 768px) {
          .hero-mobile-swiper {
            display: block;
          }
          .hero-desktop-bg {
            display: none !important;
          }
          /* Hide overlay on mobile — let images shine bright */
          .hero-overlay {
            display: none !important;
          }
          /* Hide entire desktop text content on mobile */
          .hero-desktop-content {
            display: none !important;
          }
        }

        /* ── Slides ── */
        .hero-mobile-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .hero-mobile-slide.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── CTA buttons inside swiper ── */
        .mobile-hero-cta {
          position: absolute;
          bottom: 64px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: row;
          gap: 10px;
          z-index: 10;
          width: max-content;
        }

        .mobile-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 22px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #1a1a1a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          border-radius: 100px;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          transition: all 0.25s ease;
        }

        .mobile-btn-primary:active {
          transform: scale(0.96);
          background: #fff;
        }

        .mobile-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 22px;
          background: rgba(0,0,0,0.28);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          border-radius: 100px;
          text-decoration: none;
          white-space: nowrap;
          border: 1.5px solid rgba(255,255,255,0.5);
          transition: all 0.25s ease;
        }

        .mobile-btn-ghost:active {
          transform: scale(0.96);
          background: rgba(255,255,255,0.15);
        }

        /* ── Dot indicators ── */
        .swiper-dots {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .swiper-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 0;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .swiper-dot.active {
          background: #fff;
          width: 22px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </section>
  );
}
