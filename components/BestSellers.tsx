'use client';

import { useEffect, useRef, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FBProduct {
  id: string;
  name: string;
  category: string;
  notes?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  sizes?: number[];
}

function discountPct(p: number, op?: number) {
  if (!op || op <= p) return 0;
  return Math.round(((op - p) / op) * 100);
}

export default function BestSellers() {
  const [products, setProducts] = useState<FBProduct[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  // Touch swipe state
  const touchStartX = useRef<number>(0);
  const touchScrollLeft = useRef<number>(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Only fetch products the admin has toggled as Best Seller
        const snap = await getDocs(
          query(collection(db, 'products'), where('isBestSeller', '==', true), limit(10))
        );
        const list: FBProduct[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FBProduct, 'id'>) }));
        setProducts(list);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  const handleAddToCart = (p: FBProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: Number(p.id) || Math.random(),
      name: p.name,
      size: p.sizes?.[0] ?? 6,
      price: p.price,
      image: p.images?.[0] ?? '',
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  // Mouse drag scroll
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseLeave = () => { isDragging.current = false; if (scrollRef.current) scrollRef.current.style.cursor = 'grab'; };
  const onMouseUp = () => { isDragging.current = false; if (scrollRef.current) scrollRef.current.style.cursor = 'grab'; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  return (
    <>
      <style>{`
        .bs-section {
          background: linear-gradient(160deg, #fff5f7 0%, #fff9fb 30%, #fffcfd 60%, #faf8ff 100%);
          padding: 64px 0 60px;
          overflow: hidden;
          position: relative;
        }
        .bs-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #D4AF37 30%, #e8c070 60%, transparent);
          opacity: 0.45;
        }

        .bs-header {
          padding: 0 clamp(16px, 5vw, 72px);
          margin-bottom: 36px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .bs-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #C0687A;
          margin-bottom: 10px;
        }
        .bs-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 700;
          color: #1a0f0f;
          line-height: 1.15;
          margin: 0;
        }
        .bs-subtitle {
          font-size: 0.88rem;
          color: #9b7c82;
          margin: 8px 0 0;
          font-weight: 400;
        }
        .bs-view-all {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #1a0f0f;
          text-decoration: none;
          border-bottom: 1.5px solid #1a0f0f;
          padding-bottom: 2px;
          white-space: nowrap;
          transition: color 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .bs-view-all:hover { color: #C0687A; border-color: #C0687A; }

        /* Carousel Wrapper with Red Pattern */
        .bs-carousel-wrapper {
          position: relative;
          padding: 48px 0;
          margin-top: 10px;
        }
        .bs-backdrop {
          position: absolute;
          inset: 0;
          background-color: #381518; /* Dark maroon fallback */
          background-image: url('/assets/bestseller_bg.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          border-top: 1px solid rgba(212,175,55,0.4);
          border-bottom: 1px solid rgba(212,175,55,0.4);
          box-shadow: inset 0 20px 50px rgba(0,0,0,0.5), inset 0 -20px 50px rgba(0,0,0,0.5);
          z-index: 0;
        }
        .bs-backdrop::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(40, 10, 15, 0.55); /* Tinted dark overlay for text/card contrast */
          z-index: 0;
        }

        /* Scroll track */
        .bs-scroll-track {
          position: relative;
          z-index: 1;
          padding: 0 clamp(16px, 5vw, 72px) 0; /* Removed bottom padding as we now have wrapper padding */
          overflow-x: auto;
          overflow-y: visible;
          display: flex;
          gap: 18px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          cursor: grab;
          /* Fade edges */
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 4%, #000 96%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, #000 4%, #000 96%, transparent 100%);
        }
        .bs-scroll-track::-webkit-scrollbar { display: none; }
        .bs-scroll-track:active { cursor: grabbing; }

        /* Card */
        .bs-card {
          flex: 0 0 clamp(240px, 40vw, 300px);
          scroll-snap-align: start;
          border-radius: 12px;
          background: #fff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.25s;
          position: relative;
        }
        .bs-card:hover {
          transform: translateY(-4px);
        }

        /* Badge */
        .bs-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 0.6rem;
          font-weight: 600;
          color: #fff;
          background: rgba(30, 30, 30, 0.7);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 4px 10px;
          border-radius: 20px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Image box */
        .bs-img-box {
          position: relative;
          aspect-ratio: 1.05 / 1;
          background: #f8f8f8;
          flex-shrink: 0;
          overflow: hidden;
        }
        .bs-img-box img { 
          object-fit: cover !important; 
          padding: 0 !important; 
          transition: transform 0.45s ease !important; 
        }
        .bs-card:hover .bs-img-box img { transform: scale(1.05) !important; }

        /* Rating */
        .bs-rating-wrapper {
          display: flex;
          justify-content: flex-end;
          padding: 12px 16px 0;
        }
        .bs-rating {
          font-size: 0.75rem;
          color: #888;
          background: #f8f9fa;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        .bs-rating span { color: #d4af37; font-size: 0.9rem; }

        /* Info */
        .bs-info {
          padding: 0 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0;
        }
        .bs-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000;
          line-height: 1.35;
          margin-top: 8px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .bs-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .bs-price {
          font-size: 1.5rem;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 1;
        }
        .bs-orig {
          font-size: 0.95rem;
          color: #777;
          text-decoration: line-through;
        }
        .bs-disc {
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
          background: #399d65;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .bs-emi {
          font-size: 0.75rem;
          color: #000;
          font-weight: 500;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .bs-emi-btn {
          font-size: 0.55rem;
          border: 1px solid #000;
          padding: 2px 5px;
          border-radius: 3px;
        }
        .bs-atc {
          margin-top: auto;
          width: 100%;
          padding: 13px;
          background: linear-gradient(to right, #cf9d56, #eac580, #dbab63);
          color: #000;
          font-size: 0.9rem;
          font-weight: 700;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: filter 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bs-atc:hover { filter: brightness(1.05); }
        .bs-atc.added { background: #399d65; color: #fff; }
        .bs-emi {
          font-size: 0.62rem;
          color: #9b7c82;
          margin-bottom: 12px;
        }
        .bs-atc {
          margin-top: auto;
          width: 100%;
          padding: 13px;
          background: #1a0f0f;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bs-atc:hover { background: #C0687A; }
        .bs-atc.added { background: #16a34a; }

        /* Nav arrows (desktop) */
        .bs-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
        }
        .bs-arr {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.12);
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          color: #1a0f0f;
        }
        .bs-arr:hover { background: #1a0f0f; color: #fff; border-color: #1a0f0f; }

        @media (max-width: 500px) {
          .bs-card { flex-basis: clamp(190px, 72vw, 230px); }
        }
      `}</style>

      <section className="bs-section">
        {/* Header */}
        <div className="bs-header">
          <div>
            <div className="bs-eyebrow">★ Customer Favourites</div>
            <h2 className="bs-title">Our Best Sellers</h2>
            <p className="bs-subtitle">The fragrances our customers can&apos;t stop buying.</p>
          </div>
          <a href="/attars" className="bs-view-all">View All →</a>
        </div>

        {/* Horizontal scroll wrapper with reddish background pattern */}
        <div className="bs-carousel-wrapper">
          <div className="bs-backdrop" />

          <div
            className="bs-scroll-track"
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={e => {
              touchStartX.current = e.touches[0].clientX;
              touchScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
            }}
          >
            {products.length === 0
              // Skeleton placeholders while loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bs-card" style={{ pointerEvents: 'none' }}>
                  <div className="bs-img-box" style={{ background: 'linear-gradient(135deg, #f5e8e8, #efe8f5)' }} />
                  <div className="bs-info">
                    <div style={{ height: 10, width: '40%', background: '#f1e8ea', borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ height: 16, width: '85%', background: '#f1e8ea', borderRadius: 6, marginBottom: 6 }} />
                    <div style={{ height: 10, width: '60%', background: '#f1e8ea', borderRadius: 6, marginBottom: 14 }} />
                    <div style={{ height: 40, background: '#f1e8ea', borderRadius: 8 }} />
                  </div>
                </div>
              ))
              : products.map(p => {
                const disc = discountPct(p.price, p.originalPrice);
                const isAdded = addedId === p.id;
                return (
                  <div
                    className="bs-card"
                    key={p.id}
                    onClick={() => router.push(`/product/${p.id}`)}
                    draggable={false}
                  >
                    {/* Top-left Badge */}
                    <div className="bs-badge">⚡ Trending</div>

                    {/* Image - now edge-to-edge */}
                    <div className="bs-img-box">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="300px"
                          draggable={false}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: '#f8f8f8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '2rem', opacity: 0.5,
                        }}>
                          🧴
                        </div>
                      )}
                    </div>

                    {/* Rating (Randomized for demo, replace with real data if available) */}
                    <div className="bs-rating-wrapper">
                      <div className="bs-rating">
                        <span>★</span> {(4.5 + Math.random() * 0.4).toFixed(1)} | {Math.floor(80 + Math.random() * 200)}
                      </div>
                    </div>

                    {/* Info block */}
                    <div className="bs-info">
                      <div className="bs-name">{p.name}</div>

                      <div className="bs-price-row">
                        <span className="bs-price">₹{p.price.toLocaleString('en-IN')}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="bs-orig">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                        {disc > 0 && <span className="bs-disc">{disc}% off</span>}
                      </div>

                      <button
                        className={`bs-atc${isAdded ? ' added' : ''}`}
                        onClick={e => handleAddToCart(p, e)}
                      >
                        {isAdded ? (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            ADDED!
                          </>
                        ) : (
                          <>
                            ADD TO CART
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

        {/* Desktop nav arrows */}
        <div className="bs-nav">
          <button
            className="bs-arr"
            aria-label="Scroll left"
            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            className="bs-arr"
            aria-label="Scroll right"
            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </section>
    </>
  );
}
