'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [showVideo]);

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

      {/* ── MOBILE: static PNG shown for first 5 s ── */}
      <div
        className="hero-mobile-image"
        style={{ opacity: showVideo ? 0 : 1 }}
      >
        <Image
          src="/assets/mobile hero vid.png"
          alt="Hero Mobile Background"
          fill
          priority
          quality={95}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* ── MOBILE: video shown after 5 s ── */}
      <div
        className="hero-mobile-video"
        style={{ opacity: showVideo ? 1 : 0 }}
      >
        <video
          ref={videoRef}
          src="/assets/herosection bg vid mobile.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Subtle right-side gradient only — keeps left (bottles) fully visible */}
      <div className="hero-overlay" />

      <div className="hero-content">
        {/* Right-aligned content block */}
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
    </section>
  );
}
