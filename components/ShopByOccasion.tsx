'use client';
import { useState, useRef, useEffect } from 'react';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const FILTERS = ['beast mode', 'everyday', 'party wear', 'date'];

export default function ShopByOccasion() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRect, setActiveRect] = useState({ left: 0, width: 0 });
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live products
  useEffect(() => {
    const fetchOccasionProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const liveProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Product[];
        setDbProducts(liveProducts);
      } catch (error) {
        console.error('Failed to fetch occasion products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasionProducts();
  }, []);

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

  const getFilteredProducts = () => {
    return dbProducts.filter((p) => {
      // 1. If backend has assigned occasion tags, use them:
      if (p.occasions && Array.isArray(p.occasions)) {
        if (p.occasions.map(o => o.toLowerCase()).includes(activeFilter)) {
          return true;
        }
      }

      // 2. Hard fallback specifically requested for BEAST MODE products
      if (activeFilter === 'beast mode') {
        const targetIds = ['XNzj20q', 'DEI2FRm', 'WgWGvlC', 'jAQ4G57'];
        if (targetIds.includes(String(p.id))) {
          return true;
        }
      }
      
      // Fallback for other categories if no tags exist
      if (activeFilter === 'everyday') {
        const everydayIds = ['YTkL7PZ', 'A1b2C3d']; // Examples
        if (everydayIds.includes(String(p.id))) return true;
      }
      
      return false;
    });
  };

  const filtered = getFilteredProducts();

  return (
    <section className="occasions-section relative z-[10000] bg-[var(--bg)]" style={{ background: 'var(--bg)' }}>
      <div className="section-container">
        
        <div className={`occasions-header ${isVisible ? 'animate' : ''}`} ref={titleRef}>
          <h2 className="occasions-title">SHOP BY OCCASIONS</h2>
          <div className="occasions-line"></div>
        </div>

        {activeFilter === 'beast mode' && (
          <p style={{
            textAlign: 'center',
            marginTop: '18px',
            marginBottom: '0',
            fontSize: '0.75rem',
            color: '#b8860b',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: '600',
            fontFamily: 'inherit',
          }}>
            PROJECTION BEYOND YOUR IMAGINATION
          </p>
        )}

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
          {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: '#d3a958' }}>
               Loading premium selections...
             </div>
          ) : filtered.length > 0 ? (
            filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
             <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>
               No collection available for this occasion yet.
             </div>
          )}
        </div>

      </div>
    </section>
  );
}
