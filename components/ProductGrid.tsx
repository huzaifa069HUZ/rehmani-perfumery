'use client';
import { useState } from 'react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

const FILTERS = ['all', 'oud', 'musk', 'floral', 'citrus'];

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  return (
    <section id="collections" className="collections-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Shop Our Collection</h2>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
