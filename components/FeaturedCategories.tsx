'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const SWIPER_IMAGES = [
  '/banner_collection.png',
  '/banner_combo_deal.png',
];

export default function FeaturedCategories() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SWIPER_IMAGES.length);
    }, 4000); // 4 seconds
    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      img: '/assets/giftbox.png',
      desktopImg: '/assets/giftbox square.png',
      label: 'Perfect Present',
      title: 'Gifts',
      desc: 'Exquisite fragrances wrapped in luxury — the gift they\'ll never forget',
      size: 'large',
      href: '/attars',
    },
    {
      img: '/assets/for him1.png',
      label: '',
      title: 'For Him',
      desc: '',
      size: 'small',
      href: '/?filter=for-him#collections',
    },
    {
      img: '/assets/FOR HER IMG.png',
      label: '',
      title: 'For Her',
      desc: '',
      size: 'small',
      href: '/?filter=for-her#collections',
    },
  ];

  return (
    <section className="categories-section">
      <div className="section-container">
        <div className="categories-grid">
          {/* Main 3 static categories */}
          {categories.map((cat, i) => (
            <div key={i} className={`category-card${cat.size === 'large' ? ' category-large' : ''}`}>
              <div className="category-img-wrap">
                {cat.desktopImg ? (
                  <>
                    <Image
                      src={cat.desktopImg}
                      alt={cat.title}
                      fill
                      sizes={cat.size === 'large' ? '50vw' : '25vw'}
                      className="category-img hidden md:block"
                    />
                    <Image
                      src={cat.img}
                      alt={cat.title}
                      fill
                      sizes={cat.size === 'large' ? '50vw' : '25vw'}
                      className="category-img block md:hidden"
                    />
                  </>
                ) : (
                  <Image
                    src={cat.img}
                    alt={cat.title}
                    fill
                    sizes={cat.size === 'large' ? '50vw' : '25vw'}
                    className="category-img"
                  />
                )}
              </div>
              <div className="category-overlay" />
              <div className="category-content">
                {cat.label && <span className="category-label">{cat.label}</span>}
                <h3 className={`category-title ${!cat.label ? 'luxury-text' : ''}`}>{cat.title}</h3>
                {cat.desc && <p className="category-desc">{cat.desc}</p>}
                <a href={cat.href} className="category-btn">Explore Now</a>
              </div>
            </div>
          ))}

          {/* Auto Image Swiper for the free space under Him & Her */}
          <div className="category-swiper-cell">
            {SWIPER_IMAGES.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Feature Banner ${i + 1}`}
                fill
                className={`swiper-img ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                style={{ transition: 'opacity 0.8s ease-in-out', objectFit: 'cover' }}
              />
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide((prev) => (prev - 1 + SWIPER_IMAGES.length) % SWIPER_IMAGES.length);
              }}
              className="swiper-arrow swiper-prev"
              aria-label="Previous Slide"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % SWIPER_IMAGES.length);
              }}
              className="swiper-arrow swiper-next"
              aria-label="Next Slide"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .category-swiper-cell {
          position: relative;
          grid-column: span 2;
          border-radius: 3px;
          overflow: hidden;
          background: #0a0804;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .swiper-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.4);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }

        .swiper-arrow:hover {
          background: rgba(212, 175, 55, 0.85);
          border-color: rgba(212, 175, 55, 1);
          transform: translateY(-50%) scale(1.05);
          color: #000;
        }

        .swiper-prev { left: 24px; }
        .swiper-next { right: 24px; }

        /* Scale down the swiper arrows on mobile so they don't block content */
        @media (max-width: 900px) {
          .swiper-arrow {
            width: 28px;
            height: 28px;
            background: rgba(0, 0, 0, 0.6);
          }
          .swiper-arrow svg {
            width: 14px;
            height: 14px;
          }
          .swiper-prev { left: 8px; }
          .swiper-next { right: 8px; }
        }

        .luxury-text {
          font-family: var(--font-cormorant), var(--font-serif), serif !important;
          font-size: 2.6rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.05em !important;
          text-shadow: 0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(212,175,55,0.3) !important;
          color: #ffffff !important;
          margin-bottom: 20px !important;
        }

        @media (max-width: 900px) {
          .luxury-text {
            font-size: 2.4rem !important;
          }
        }
      `}</style>
    </section>
  );
}
