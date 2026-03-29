'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2400&auto=format&fit=crop',
    title: 'THE ROYAL MUSK',
    subtitle: 'Discover our signature collection',
    link: '#collections'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1615486171430-b3e1f0ec8cc4?q=80&w=2400&auto=format&fit=crop',
    title: 'PURE OUD EXTRACT',
    subtitle: 'Aged to perfection for true connoisseurs',
    link: '#collections'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1585888126131-15feae4ad606?q=80&w=2400&auto=format&fit=crop',
    title: 'LUXURY GIFT SETS',
    subtitle: 'The perfect gift for your loved ones',
    link: '#collections'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1592842400244-6a8492020272?q=80&w=2400&auto=format&fit=crop',
    title: 'SUMMER BREEZE',
    subtitle: 'Fresh floral attars for the season',
    link: '#collections'
  }
];

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="banner-slider-section">
      <div className="banner-slider-container">
        
        {/* Slides */}
        <div 
          className="banner-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div className="banner-slide" key={banner.id}>
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                className="banner-img"
              />
              <div className="banner-overlay"></div>
              <div className="banner-content">
                <span className="banner-subtitle">{banner.subtitle}</span>
                <h2 className="banner-title">{banner.title}</h2>
                <a href={banner.link} className="btn-primary banner-btn">Shop Now</a>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="banner-arrow banner-prev" onClick={prevSlide} aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="banner-arrow banner-next" onClick={nextSlide} aria-label="Next slide">
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
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
        
      </div>
    </section>
  );
}
