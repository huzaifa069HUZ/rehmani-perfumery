'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function BentoCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bento-section">
      <div className="section-container">
        {/* Animated Title */}
        <div className={`bento-header ${isVisible ? 'animate' : ''}`} ref={titleRef}>
          <h2 className="bento-title">CATEGORIES</h2>
          <div className="bento-line"></div>
        </div>

        {/* Bento Grid */}
        <div className="bento-container">
          {/* Left Column */}
          <div className="bento-col">
            {/* Perfume - Tall */}
            <div className="bento-item bento-tall">
              <Image 
                src="/assets/category_perfume.png" 
                alt="Perfume Category" 
                fill 
                className="bento-img" 
              />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3 className="bento-item-title">Perfume</h3>
                <p className="bento-item-desc">Connoisseurs of perfumery —<br/>heritage, held in a bottle.</p>
              </div>
            </div>

            {/* Gift Set - Short */}
            <div className="bento-item bento-short">
              <Image 
                src="/assets/category_giftset.png" 
                alt="Gift Set Category" 
                fill 
                className="bento-img" 
              />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3 className="bento-item-title">Gift set</h3>
                <p className="bento-item-desc">Thoughtfully wrapped —<br/>the fragrance of memories.</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bento-col">
             {/* Attar - Short */}
             <div className="bento-item bento-short">
              <Image 
                src="/assets/category_attar.png" 
                alt="Attar Category" 
                fill 
                className="bento-img" 
              />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3 className="bento-item-title">Attar</h3>
                <p className="bento-item-desc">Rich fragrant oils —<br/>a timeless touch of tradition.</p>
              </div>
            </div>

            {/* Dakhoon - Tall */}
            <div className="bento-item bento-tall">
              <Image 
                src="/assets/category_dakhoon.png" 
                alt="Dakhoon Category" 
                fill 
                className="bento-img" 
              />
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <h3 className="bento-item-title">Dakhoon</h3>
                <p className="bento-item-desc">Aromas of royalty —<br/>incense that calms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
