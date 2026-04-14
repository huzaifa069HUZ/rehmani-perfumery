'use client';
import './view-all-button.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import ProductCard from './ProductCard';

type FilterType = 'default' | 'price-high' | 'price-low' | 'new';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'new', label: 'New' },
];

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('default');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(8));
        const snapshot = await getDocs(q);
        const liveProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Product[];
        setDbProducts(liveProducts);
      } catch (error) {
        console.error('ProductGrid fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const getFilteredProducts = useCallback(() => {
    let result = [...dbProducts];
    switch (activeFilter) {
      case 'price-high':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'new':
        result = result.filter(p => p.isNew);
        break;
      default:
        break;
    }
    return result;
  }, [dbProducts, activeFilter]);

  const filteredProducts = getFilteredProducts();

  const handleFilterSelect = (value: FilterType) => {
    setActiveFilter(prev => prev === value ? 'default' : value);
    setDropdownOpen(false);
  };

  const activeLabel = FILTER_OPTIONS.find(f => f.value === activeFilter)?.label;

  return (
    <section id="collections" className="collections-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Shop Our Collection</h2>
          
          {/* Filter dropdown button — right side */}
          <div className="filter-dropdown-wrap" ref={dropdownRef}>
            <button
              className={`filter-dropdown-btn ${dropdownOpen ? 'open' : ''} ${activeFilter !== 'default' ? 'has-filter' : ''}`}
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              <span>{activeLabel || 'Filter'}</span>
              <svg className="filter-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="filter-dropdown-menu" role="listbox">
                {FILTER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`filter-dropdown-item ${activeFilter === opt.value ? 'active' : ''}`}
                    onClick={() => handleFilterSelect(opt.value)}
                    role="option"
                    aria-selected={activeFilter === opt.value}
                  >
                    {opt.label}
                    {activeFilter === opt.value && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="product-grid">
          {loading ? (
            <div className="text-center py-10 text-gray-500 col-span-full">Loading collections...</div>
          ) : (
            filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product as any}
              />
            ))
          )}
        </div>

        {/* View All Attars CTA */}
        <div className="view-all-cta">
          <div className="view-all-divider">
            <span className="view-all-line" />
            <span className="view-all-diamond">◆</span>
            <span className="view-all-line" />
          </div>
          <button
            className="view-all-attars-btn"
            onClick={() => router.push('/attars')}
            aria-label="View all attars collection"
          >
            <span className="view-all-btn-text">View All Attars</span>
            <span className="view-all-btn-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            <span className="view-all-btn-shimmer" />
          </button>
          <p className="view-all-subtitle">Explore our complete collection of premium Arabian attars</p>
        </div>
      </div>
    </section>
  );
}

