'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';

const banners = [
  {
    id: 4,
    image: '/assets/HAWAS SPECIAL.png',
    title: '',
    subtitle: '',
    link: '/product/hawas-special-O64Q6fI',
    hasOwnText: true,
  },
  {
    id: 1,
    image: '/assets/red sea banner.png',
    title: '',
    subtitle: '',
    link: '/product/red-sea-HT0gv7H',
    hasOwnText: true,
  },
  {
    id: 5,
    image: '/assets/atlantis banner.png',
    title: '',
    subtitle: '',
    link: '/product/atlantis-aV6ian8',
    hasOwnText: true,
  },
  {
    id: 2,
    image: '/assets/red sea banner.png',
    title: 'PURE OUD EXTRACT',
    subtitle: 'Aged to perfection for true connoisseurs',
    link: '#collections',
    hasOwnText: false,
  },
  {
    id: 3,
    image: '/assets/il.png',
    title: '',
    subtitle: '',
    link: '/perfumes',
    hasOwnText: true,
  }
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, []);

  // Start/restart auto-slide
  const startAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    startAutoSlide();
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, [startAutoSlide]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) {
        nextSlide(); // swipe left → next
      } else {
        prevSlide(); // swipe right → prev
      }
      // Restart auto-slide after manual swipe
      startAutoSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="banner-slider-section">
      <div
        className="banner-slider-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        
        {/* Slides */}
        <div 
          className="banner-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div className={`banner-slide ${banner.hasOwnText ? 'banner-slide-has-text' : ''}`} key={banner.id}>
              <Image
                src={banner.image}
                alt={banner.title || 'Banner'}
                fill
                priority={index === 0}
                className="banner-img"
              />
              {!banner.hasOwnText && <div className="banner-overlay"></div>}
              {!banner.hasOwnText && (
                <div className="banner-content">
                  <span className="banner-subtitle">{banner.subtitle}</span>
                  <h2 className="banner-title">{banner.title}</h2>
                  <a href={banner.link} className="btn-primary banner-btn">Shop Now</a>
                </div>
              )}
              {banner.hasOwnText && (
                <a href={banner.link} className="banner-full-link" aria-label={`Shop ${banner.title || 'now'}`}></a>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="banner-arrow banner-prev" onClick={() => { prevSlide(); startAutoSlide(); }} aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="banner-arrow banner-next" onClick={() => { nextSlide(); startAutoSlide(); }} aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Dots Indicators */}
        <div className="banner-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`banner-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => { setCurrentSlide(index); startAutoSlide(); }}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
        
      </div>
    </section>
  );
}

