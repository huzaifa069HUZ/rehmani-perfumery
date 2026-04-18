'use client';
import './view-all-button.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import ProductCard from './ProductCard';

type FilterType = 'default' | 'price-high' | 'price-low' | 'new' | 'for-him' | 'for-her';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'for-him', label: 'For Him' },
  { value: 'for-her', label: 'For Her' },
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      let q = query(collection(db, 'products'), limit(8));
      if (isLoadMore && lastDoc) {
        q = query(collection(db, 'products'), startAfter(lastDoc), limit(8));
      }

      const snapshot = await getDocs(q);
      const newProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as Product[];
      
      if (isLoadMore) {
        setDbProducts(prev => [...prev, ...newProducts]);
      } else {
        setDbProducts(newProducts);
      }

      if (snapshot.docs.length < 8) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('ProductGrid fetch error:', error);
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Check if there is a filter query param for handling FeaturedCategories click
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      if (filter === 'for-him' || filter === 'for-her') {
        setActiveFilter(filter);
        setTimeout(() => {
          document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
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
      case 'for-him':
        result = result.filter(p => ['REEH AL KAABAH', 'OUD NADIRA', 'KAMRAH', 'KHAMRAH', 'HAWAS SPECIAL'].includes((p.name || '').toUpperCase()));
        break;
      case 'for-her':
        result = result.filter(p => ['BLUSH AURA', 'PROFFESOR', 'PROFESSOR', 'EHSAS UL ABEER', 'MYSTERY'].includes((p.name || '').toUpperCase()));
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

        {/* Load More Button */}
        {hasMore && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
            <button
              onClick={() => fetchProducts(true)}
              disabled={loadingMore}
              style={{
                padding: '10px 24px',
                border: '1px solid #d3a958',
                background: 'transparent',
                color: '#2b1f13',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                opacity: loadingMore ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loadingMore) {
                  e.currentTarget.style.background = '#d3a958';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingMore) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#2b1f13';
                }
              }}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* View All Attars CTA */}
        <div className="view-all-cta" style={{ marginTop: hasMore ? '1rem' : '4rem' }}>
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

