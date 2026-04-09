'use client';
import './view-all-button.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import ProductCard from './ProductCard';

const FILTERS = ['all', 'oud', 'musk', 'fresh', 'floral', 'gourmand', 'leather', 'spicy', 'citrus', 'fruity'];

export default function ProductGrid() {
  const [filter, setFilter] = useState('all');
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

  const filteredProducts = filter === 'all' 
    ? dbProducts 
    : dbProducts.filter(p => p.category === filter);

  return (
    <section id="collections" className="collections-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Shop Our Collection</h2>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
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
