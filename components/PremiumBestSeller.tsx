'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const STATIC_PRODUCTS = [
  {
    id: 'hawas-1',
    category: 'AQUATIC, FRESH SPICY',
    title: 'Hawas for Him Perfume 100 ML',
    price: 3800,
    originalPrice: 4500,
    discount: '15% Off',
    image: '/assets/hawas-no-bg.png',
  },
  {
    id: 'oud-nadira-1',
    category: 'WOODY, ORIENTAL',
    title: 'Oud Nadira Perfume 50 ML',
    price: 4800,
    originalPrice: 6000,
    discount: '20% Off',
    image: '/assets/oud-nadira-no-bg.png',
  },
  {
    id: 'hawas-2',
    category: 'AQUATIC, FRESH SPICY',
    title: 'Hawas for Him Perfume 100 ML',
    price: 3800,
    originalPrice: 4500,
    discount: '15% Off',
    image: '/assets/hawas-no-bg.png',
  },
  {
    id: 'oud-nadira-2',
    category: 'WOODY, ORIENTAL',
    title: 'Oud Nadira Perfume 50 ML',
    price: 4800,
    originalPrice: 6000,
    discount: '20% Off',
    image: '/assets/oud-nadira-no-bg.png',
  },
];

export default function PremiumBestSeller() {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (p: typeof STATIC_PRODUCTS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.title,
      size: 100,
      price: p.price,
      image: p.image,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="pbs-section">
      <style>{`
        .pbs-section {
          padding: 60px 0;
          background: #ffffff;
          max-width: 1300px;
          margin: 0 auto;
        }

        .pbs-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 clamp(16px, 5vw, 40px);
          margin-bottom: 30px;
        }

        .pbs-title-container {
          position: relative;
          display: inline-block;
        }

        .pbs-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 3.5vw, 2.2rem);
          font-weight: 400;
          color: #000;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @keyframes expandUnderline {
          from { width: 0; opacity: 0; }
          to { width: 80%; opacity: 1; }
        }

        @keyframes shimmerGold {
          0% { left: -100%; }
          50% { left: 200%; }
          100% { left: 200%; }
        }

        .pbs-title-underline {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 3px;
          background: #d3a958; /* Goldish line */
          border-radius: 2px;
          overflow: hidden;
          animation: expandUnderline 1s ease-out forwards;
        }
        
        /* Shimmer effect over the golden line */
        .pbs-title-underline::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
          animation: shimmerGold 3s infinite;
          animation-delay: 1s;
          z-index: 2;
        }

        /* Using a subtle curve simulation via border-radius for the wavy line effect */
        .pbs-title-underline::after {
          content: '';
          position: absolute;
          top: 0; left: -10%; width: 120%; height: 100%;
          border-top: 1px solid #d3a958;
          border-radius: 50% 50% 0 0;
          transform: translateY(-2px);
          opacity: 0.6;
        }

        .pbs-view-more {
          border: 1px solid #000;
          background: transparent;
          color: #000;
          padding: 8px 24px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .pbs-view-more:hover {
          background: #000;
          color: #fff;
        }

        .pbs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 0 clamp(16px, 5vw, 40px);
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        
        .pbs-grid::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 1024px) {
          .pbs-grid {
            grid-template-columns: repeat(4, 300px);
          }
        }
        @media (max-width: 600px) {
          .pbs-grid {
            grid-template-columns: repeat(4, 260px);
          }
        }

        .pbs-card {
          border: 1px solid #eaeaea;
          background: #fff;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: box-shadow 0.2s;
        }

        .pbs-card:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .pbs-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #d3a958;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 8px;
          z-index: 2;
          letter-spacing: 0.05em;
        }

        .pbs-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: radial-gradient(circle at center, #ffffff 0%, #f9f9f9 70%, #f4f4f4 100%);
        }

        .pbs-info-container {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .pbs-category {
          font-size: 0.65rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .pbs-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #222;
          line-height: 1.3;
          margin-bottom: 12px;
          height: 2.6em; /* lock to 2 lines approx */
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .pbs-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .pbs-current-price {
          font-size: 1.05rem;
          font-weight: 700;
          color: #000;
        }

        .pbs-original-price {
          font-size: 0.85rem;
          color: #999;
          text-decoration: line-through;
        }

        .pbs-discount {
          font-size: 0.75rem;
          color: #2e7d32; /* Greenish */
          font-weight: 600;
          margin-bottom: 16px;
        }

        .pbs-add-to-cart {
          margin-top: auto;
          width: 100%;
          background: #000;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 14px 0;
          border: none;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: background 0.2s;
        }

        .pbs-add-to-cart:hover {
          background: #333;
        }

        .pbs-add-to-cart.added {
          background: #2e7d32;
        }
      `}</style>

      <div className="pbs-header-row">
        <div className="pbs-title-container">
          <h2 className="pbs-title">SIGNATURE COLLECTION</h2>
          <div className="pbs-title-underline"></div>
        </div>
        <Link href="/perfumes" className="pbs-view-more">
          View More
        </Link>
      </div>

      <div className="pbs-grid">
        {STATIC_PRODUCTS.map((p, i) => (
          <div className="pbs-card" key={i}>
            <div className="pbs-badge">NEW</div>
            <div className="pbs-img-wrapper">
              <Image
                src={p.image}
                alt={p.title}
                fill
                style={{ objectFit: 'contain', padding: '20px' }}
                sizes="(max-width: 600px) 260px, 300px"
              />
            </div>
            <div className="pbs-info-container">
              <div className="pbs-category">{p.category}</div>
              <div className="pbs-card-title">{p.title}</div>
              <div className="pbs-price-row">
                <span className="pbs-current-price">₹{p.price.toLocaleString('en-IN')}</span>
                <span className="pbs-original-price">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                <span className="pbs-discount">{p.discount}</span>
              </div>
              
              <button 
                className={`pbs-add-to-cart ${addedId === p.id ? 'added' : ''}`}
                onClick={(e) => handleAddToCart(p, e)}
              >
                {addedId === p.id ? 'ADDED!' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
