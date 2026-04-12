'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

const BANNERS = [
  {
    src: '/banner_collection.png',
    alt: 'Rahmani Perfumery — Wide Collection',
    cta: { label: 'Shop Collection', href: '/attars' },
  },
  {
    src: '/banner_combo_deal.png',
    alt: 'Rahmani Perfumery — Exclusive Combo Deal',
    cta: { label: 'View Combo Offers', href: '/attars' },
  },
];

const AUTO_INTERVAL = 4000;

export default function PromoBannerStrip() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = BANNERS.length;

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((idx + total) % total);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, total]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, AUTO_INTERVAL);
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  return (
    <section className="pbs-root">
      <div className="pbs-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {BANNERS.map((banner, i) => (
          <div key={i} className="pbs-slide">
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className="pbs-img"
            />
            {/* Subtle overlay for text contrast */}
            <div className="pbs-overlay" />
            <div className="pbs-cta-wrap">
              <Link href={banner.cta.href} className="pbs-cta">
                {banner.cta.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="pbs-dots">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`pbs-dot${i === current ? ' active' : ''}`}
            onClick={() => { goTo(i); startTimer(); }}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button className="pbs-arrow pbs-prev" onClick={() => { goTo(current - 1); startTimer(); }} aria-label="Previous banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button className="pbs-arrow pbs-next" onClick={() => { goTo(current + 1); startTimer(); }} aria-label="Next banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <style>{`
        .pbs-root {
          position: relative;
          width: 100%;
          overflow: hidden;
          aspect-ratio: 16 / 5;
          background: #000;
          user-select: none;
        }

        @media (max-width: 768px) {
          .pbs-root {
            aspect-ratio: 16 / 7;
          }
        }

        .pbs-track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.65s cubic-bezier(0.77, 0, 0.18, 1);
        }

        .pbs-slide {
          position: relative;
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
        }

        .pbs-img {
          object-fit: cover;
          object-position: center;
        }

        .pbs-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.15) 0%,
            transparent 40%,
            transparent 60%,
            rgba(0,0,0,0.15) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        .pbs-cta-wrap {
          position: absolute;
          bottom: 28px;
          right: 40px;
          z-index: 3;
        }

        .pbs-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: rgba(212,175,55,0.15);
          border: 1.5px solid #D4AF37;
          color: #F0D060;
          font-family: var(--font-montserrat), 'Montserrat', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 2px;
          transition: all 0.3s;
        }

        .pbs-cta:hover {
          background: #D4AF37;
          color: #0A0804;
        }

        @media (max-width: 768px) {
          .pbs-cta-wrap {
            bottom: 18px;
            right: 50%;
            transform: translateX(50%);
          }
          .pbs-cta {
            font-size: 0.72rem;
            padding: 10px 20px;
          }
        }

        /* Dots */
        .pbs-dots {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .pbs-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.35);
          cursor: pointer;
          padding: 0;
          transition: all 0.35s;
        }

        .pbs-dot.active {
          background: #D4AF37;
          width: 26px;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(212,175,55,0.5);
        }

        /* Arrows */
        .pbs-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(212,175,55,0.25);
          color: rgba(255,255,255,0.85);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: all 0.25s;
          padding: 0;
        }

        .pbs-arrow:hover {
          background: rgba(212,175,55,0.2);
          border-color: #D4AF37;
          color: #D4AF37;
        }

        .pbs-prev { left: 16px; }
        .pbs-next { right: 16px; }

        @media (max-width: 480px) {
          .pbs-arrow { display: none; }
        }
      `}</style>
    </section>
  );
}
