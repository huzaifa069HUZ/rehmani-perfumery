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
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-container" onClick={e => e.stopPropagation()}>
        {/* Search Header */}
        <div className="global-search-header">
          <form onSubmit={navigateToSearchPage} className="global-search-form">
            <svg className="global-search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for perfumes, attars, notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="global-search-input"
            />
            {query && (
              <button type="button" className="global-search-clear" onClick={() => setQuery('')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            <button type="button" className="global-search-close" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>

        {/* Search Results Dashboard */}
        <div className="global-search-results scrollbar-hide">
          {isLoading && query.trim() !== '' && (
            <div className="global-search-loading">
              <div className="spinner"></div>
              <span>Searching our collection...</span>
            </div>
          )}

          {!isLoading && query.trim() !== '' && filteredProducts.length === 0 && (
            <div className="global-search-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No products found for &ldquo;{query}&rdquo;</p>
              <span>Try checking for misspellings or search for a different note.</span>
            </div>
          )}

          {!isLoading && filteredProducts.length > 0 && (
            <div className="global-search-list">
              <h3 className="global-search-subtitle">Products</h3>
              <div className="global-search-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="global-search-item" onClick={() => handleProductClick(product)}>
                    <div className="search-item-img-wrapper">
                      {product.images && product.images.length > 0 ? (
                        <Image src={product.images[0]} alt={product.name} fill className="search-item-img" />
                      ) : (
                        <div className="search-item-no-img">No Img</div>
                      )}
                    </div>
                    <div className="search-item-info">
                      <h4 className="search-item-name">{product.name}</h4>
                      {product.type && <span className="search-item-type">{product.type.toUpperCase()}</span>}
                      <p className="search-item-price">₹{product.price}</p>
                    </div>
                    <div className="search-item-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Default Suggestions (when query is empty) */}
          {!isLoading && query.trim() === '' && (
            <div className="global-search-suggestions">
              <h3 className="global-search-subtitle">Popular Searches</h3>
              <div className="search-tags">
                {['Oud', 'Musk', 'Floral', 'Fresh', 'Premium', 'New Arrivals'].map((tag) => (
                  <button key={tag} className="search-tag" onClick={() => setQuery(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
