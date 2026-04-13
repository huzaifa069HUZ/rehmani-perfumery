'use client';
import { useState, useRef, useEffect } from 'react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

const FILTERS = ['daily wear', 'long lasting', 'festival', 'party', 'seductive'];

export default function ShopByOccasion() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRect, setActiveRect] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Small timeout to ensure fonts and layout are rendered
    setTimeout(() => {
      if (containerRef.current) {
        const activeTab = containerRef.current.querySelector('.occasion-tab.active') as HTMLElement;
        if (activeTab) {
          setActiveRect({
            left: activeTab.offsetLeft,
            width: activeTab.offsetWidth
          });
        }
      }
    }, 50);
  }, [activeFilter]);

  const filtered = products.filter(p => p.occasions && p.occasions.includes(activeFilter));

  return (
    <section className="occasions-section relative z-[10000] bg-[var(--bg)]" style={{ background: 'var(--bg)' }}>
      <div className="section-container">
        
        <div className={`occasions-header ${isVisible ? 'animate' : ''}`} ref={titleRef}>
          <h2 className="occasions-title">SHOP BY OCCASIONS</h2>
          <div className="occasions-line"></div>
        </div>

        <div className="occasions-filters-container">
          <div className="occasions-filters-wrapper" ref={containerRef}>
            <div 
              className="occasions-filter-slider" 
              style={{ left: activeRect.left, width: activeRect.width }}
            />
            {FILTERS.map(f => (
              <button
                key={f}
                className={`occasion-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filtered.length > 0 ? (
            filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
             <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>
               No products found for this occasion.
             </div>
          )}
        </div>

      </div>
    </section>
  );
}
