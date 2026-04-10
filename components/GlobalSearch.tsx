'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from '@/data/products';
import { buildProductSlug } from '@/lib/utils';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch products when opened for the first time
  useEffect(() => {
    if (isOpen && !hasFetched) {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const snapshot = await getDocs(collection(db, 'products'));
          const liveProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as unknown as Product[];
          setProducts(liveProducts);
          setHasFetched(true);
        } catch (error) {
          console.error('Search: Error fetching products:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen, hasFetched]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = '';
      setQuery(''); // Reset query on close
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products locally based on query
  const filteredProducts = query.trim() === '' ? [] : products.filter(p => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.notes || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.type || '').toLowerCase().includes(q)
    );
  }).slice(0, 10); // Limit results to 10 for performance in dropdown

  const handleProductClick = (product: Product) => {
    router.push(`/product/${buildProductSlug(product.name, String(product.id))}`);
    onClose();
  };

  const navigateToSearchPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // You can implement a full search page later or navigate to perfumes page with query param
      router.push(`/perfumes?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`global-search-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="global-search-container" onClick={e => e.stopPropagation()}>
        {/* Search Header */}
        <div className="global-search-header">
          <form onSubmit={navigateToSearchPage} className="global-search-form">
            <div className="search-input-wrapper">
              <svg className="global-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for perfumes, attars..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="global-search-input"
              />
              {query && (
                <button type="button" className="global-search-clear" onClick={() => setQuery('')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <button type="button" className="global-search-close-btn" onClick={onClose}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
               </svg>
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="global-search-scroll-area scrollbar-hide">
          {isLoading && query.trim() !== '' && (
            <div className="global-search-loading">
              <div className="modern-spinner"></div>
              <span>Curating the perfect selection...</span>
            </div>
          )}

          {!isLoading && query.trim() !== '' && filteredProducts.length === 0 && (
            <div className="global-search-empty">
              <div className="empty-state-illust">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
              <p>No results for &ldquo;{query}&rdquo;</p>
              <span>Try exploring our popular categories below</span>
            </div>
          )}

          {!isLoading && filteredProducts.length > 0 && (
            <div className="global-search-content">
              <div className="search-section-label">
                <span>Products Found</span>
                <span className="results-count">{filteredProducts.length} Results</span>
              </div>
              <div className="global-search-grid-modern">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="search-result-card" onClick={() => handleProductClick(product)}>
                    <div className="search-result-img">
                      {product.images && product.images.length > 0 ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="no-img-placeholder">✦</div>
                      )}
                    </div>
                    <div className="search-result-details">
                      <div className="search-result-meta">
                        <span className="result-category">{product.category || 'Collection'}</span>
                        {product.type && <span className="result-type">{product.type}</span>}
                      </div>
                      <h4 className="search-result-title">{product.name}</h4>
                      <p className="search-result-notes">{product.notes}</p>
                      <div className="search-result-footer">
                        <span className="result-price">₹{product.price}</span>
                        <span className="view-link">View Details →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggestions - always show if not searching or no results */}
          {(!isLoading && (query.trim() === '' || filteredProducts.length === 0)) && (
            <div className="global-search-suggestions-modern">
              <div className="search-section-label">Trending Searches</div>
              <div className="search-tag-cloud">
                {['Royal Oud', 'White Musk', 'Luxury Rose', 'Nishat Blend', 'Premium Attars', 'Fresh Citrus'].map((tag) => (
                  <button key={tag} className="modern-search-tag" onClick={() => setQuery(tag)}>
                    {tag}
                  </button>
                ))}
              </div>

              <div className="search-section-label" style={{marginTop: '2.5rem'}}>Quick Links</div>
              <div className="search-quick-links">
                <button className="quick-link-item" onClick={() => { router.push('/attars'); onClose(); }}>
                  <span className="ql-icon">🪔</span>
                  <div className="ql-text">
                    <span className="ql-title">Pure Attars</span>
                    <span className="ql-sub">Traditional concentrated oils</span>
                  </div>
                </button>
                <button className="quick-link-item" onClick={() => { router.push('/perfumes'); onClose(); }}>
                  <span className="ql-icon">✨</span>
                  <div className="ql-text">
                    <span className="ql-title">Fine Perfumes</span>
                    <span className="ql-sub">Luxury spray fragrances</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
