'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ── Mobile slides ──────────────────────────────────────────────────────── */
// Slide types: 'image' or 'video'
const MOBILE_SLIDES: { type: 'image' | 'video'; src: string; alt?: string }[] = [
  { type: 'image', src: '/assets/mobile hero vid.png', alt: 'Rahmani Perfumery' },
  { type: 'image', src: '/assets/SMELL THAT DEFINES YOU.png', alt: 'Smell That Defines You' },
  { type: 'image', src: '/assets/SMELL THAT DEFINES YOU (1).png', alt: 'Smell That Defines You' },
  { type: 'video', src: '/assets/herosection bg vid mobile.mp4' },
];

const SLIDE_DURATION = 5000; // ms between auto-advance

export default function HeroSection() {
  /* ── Swiper state ── */
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* touch tracking */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const total = MOBILE_SLIDES.length;

  /* ── Navigate ── */
  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((idx + total) % total);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, total]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  /* ── Auto-advance timer ── */
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, SLIDE_DURATION);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, resetTimer]);

  /* ── Play video when it becomes active ── */
  useEffect(() => {
    if (MOBILE_SLIDES[current].type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current]);

  /* ── Touch handlers ── */
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
      if (dx < 0) next();
      else prev();
      resetTimer();
    }
  };

  return (
    <section className="hero-section" id="hero">
      {/* ── DESKTOP background (unchanged) ── */}
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
          <div
            key={i}
            className={`hero-mobile-slide ${i === current ? 'active' : ''}`}
          >
            {slide.type === 'image' ? (
              <Image
                src={slide.src}
                alt={slide.alt || ''}
                fill
                priority={i === 0}
                quality={90}
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

      {/* Gradient overlay */}
      <div className="hero-overlay" />

      <div className="hero-content">
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
            <a href="#collections" className="btn-primary">
              DISCOVER COLLECTION →
            </a>
            <a href="#story" className="btn-ghost">
              OUR STORY
            </a>
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
        /* ── Mobile swiper container ── */
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
        }

        /* ── Each slide ── */
        .hero-mobile-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .hero-mobile-slide.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── Dot indicators ── */
        .swiper-dots {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .swiper-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          padding: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .swiper-dot.active {
          background: #fff;
          width: 22px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }
      `}</style>
    </section>
  );
}
