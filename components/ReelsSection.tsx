'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

/* ─── Placeholder image reels (3 remaining) ─── */
const IMAGE_REELS = [
  {
    poster: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop',
    likes: '45.2K',
    comments: '892',
  },
  {
    poster: 'https://images.unsplash.com/photo-1616881261314-1fbc8ffc04b5?q=80&w=600&auto=format&fit=crop',
    likes: '38.5K',
    comments: '654',
  },
  {
    poster: 'https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=600&auto=format&fit=crop',
    likes: '52.1K',
    comments: '1.2K',
  },
];

/* ─── Placeholder image reel card ─── */
function ImageReelCard({ reel }: { reel: typeof IMAGE_REELS[0] }) {
  return (
    <div className="reel-card" style={{ cursor: 'default' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reel.poster}
        alt="Instagram reel"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="reel-gradient" />
      <div className="reel-stats">
        <span className="reel-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {reel.likes}
        </span>
        <span className="reel-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {reel.comments}
        </span>
      </div>
    </div>
  );
}

/* ─── Generic Shoppable Video Card ─── */
function ShoppableVideoCard({
  productId,
  href,
  videoSrc,
  fallbackName,
  fallbackPrice,
}: {
  productId: string;
  href: string;
  videoSrc: string;
  fallbackName: string;
  fallbackPrice: number;
}) {
  const { addToCart } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const [muted, setMuted] = useState(true);

  /* Live product data from Firestore */
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    images: string[];
    type?: string;
    inStock?: boolean;
  } | null>(null);

  useEffect(() => {
    getDoc(doc(db, 'products', productId)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProduct({
          name: d.name ?? fallbackName,
          price: d.price ?? fallbackPrice,
          images: d.images ?? [],
          type: d.type ?? 'attar',
          inStock: d.inStock,
        });
      }
    }).catch(() => {/* silent fail, fallback values used */});
  }, [productId, fallbackName, fallbackPrice]);

  /* Autoplay when ≥20% of card is in view, pause when not */
  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  /* Sync muted state to video element */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
        id: productId,
        name: product?.name ?? fallbackName,
        size: 6,
        price: product?.price ?? fallbackPrice,
        image: product?.images?.[0] ?? '',
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    },
    [addToCart, product, productId, fallbackName, fallbackPrice]
  );

  const productName = product?.name ?? fallbackName;
  const productPrice = product?.price ?? fallbackPrice;
  const productImage = product?.images?.[0] ?? '';
  const productType = product?.type ?? 'attar';

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Video card */}
      <div className="reel-card" style={{ aspectRatio: '9/14', cursor: 'default' }}>
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          className="reel-video"
        />

        {/* Instagram badge */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
          borderRadius: '8px', padding: '4px 8px',
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '10px', fontWeight: '700', color: '#fff',
          letterSpacing: '0.03em',
          zIndex: 10,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Trending
        </div>

        {/* Mute / Unmute button */}
        <button
          onClick={() => setMuted(prev => !prev)}
          title={muted ? 'Unmute' : 'Mute'}
          style={{
            position: 'absolute', bottom: '12px', right: '10px',
            zIndex: 10,
            width: '30px', height: '30px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.88)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {muted ? (
            /* Muted icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            /* Unmuted icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          )}
        </button>

        <div className="reel-gradient" />
      </div>

      {/* Product bar below the video */}
      <Link
        href={href}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'white',
          borderRadius: '12px',
          padding: '9px 10px',
          border: '1px solid #f0ece3',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          textDecoration: 'none',
          transition: 'box-shadow 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(212,175,95,0.18)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)')}
      >
        {/* Product thumbnail — real Cloudinary image or fallback */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '8px',
          flexShrink: 0, overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a0a0e 0%, #3d1020 100%)',
          display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
        }}>
          {productImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={productImage}
              alt={productName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z" />
              <rect x="8" y="14" width="8" height="8" rx="2" />
            </svg>
          )}
        </div>

        {/* Name & price */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '12px', fontWeight: '700', color: '#1e293b',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {productName}
            <span style={{ fontWeight: '500', color: '#94a3b8', marginLeft: '4px', fontSize: '11px' }}>
              · {productType === 'perfume' ? 'Perfume' : 'Attar'}
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#d4af5f', marginTop: '1px' }}>
            ₹{productPrice}
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={product?.inStock === false ? (e) => {e.preventDefault(); e.stopPropagation();} : handleAddToCart}
          title={product?.inStock === false ? "Out of stock" : "Add to cart"}
          disabled={product?.inStock === false}
          style={{
            width: product?.inStock === false ? 'auto' : '30px', height: '30px', borderRadius: '8px',
            flexShrink: 0,
            padding: product?.inStock === false ? '0 8px' : '0',
            border: 'none', cursor: product?.inStock === false ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: product?.inStock === false
              ? '#ef4444'
              : added
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #d4af5f, #c9973a)',
            transition: 'background 0.25s, transform 0.15s',
            opacity: product?.inStock === false ? 0.8 : 1,
            color: 'white',
            fontSize: '10px',
            fontWeight: '700'
          }}
          onMouseDown={e => {if(product?.inStock !== false) e.currentTarget.style.transform = 'scale(0.9)'}}
          onMouseUp={e => {if(product?.inStock !== false) e.currentTarget.style.transform = 'scale(1)'}}
        >
          {product?.inStock === false ? (
            "OUT OF STOCK"
          ) : added ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
            </svg>
          )}
        </button>
      </Link>
    </div>
  );
}

/* ─── Main section ─── */
export default function ReelsSection() {
  return (
    <section id="reels" className="reels-section">
      <style>{`
        .reels-grid-5 {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          gap: 18px;
          padding-bottom: 24px;
          scrollbar-width: none;
        }
        .reels-grid-5::-webkit-scrollbar {
          display: none;
        }
        .reels-grid-5 > * {
          flex: 0 0 calc((100% - 72px) / 5); /* 5 cards exactly */
          scroll-snap-align: start;
          min-width: 220px; /* safety for ultra-small nested desktops */
        }
        @media (max-width: 900px) {
          .reels-grid-5 > * { flex: 0 0 calc(40vw - 18px); min-width: 0; }
        }
        @media (max-width: 480px) {
          .reels-grid-5 { gap: 12px; }
          /* 1.5 cards visibility creates precise swipe affordance */
          .reels-grid-5 > * { flex: 0 0 calc(65vw - 12px); }
        }
      `}</style>

      <div className="section-container">
        <div className="reels-header">
          <div>
            <span className="section-badge">Social Proof</span>
            <h2 className="section-title">Trending on Instagram</h2>
            <p className="reels-subtitle">See what our community is loving</p>
          </div>
          <a
            href="https://www.instagram.com/rahmaniperfumery/"
            target="_blank"
            rel="noopener noreferrer"
            className="follow-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Follow Us
          </a>
        </div>

        <div className="reels-grid-5">
          {/* Slot 1: Red Sea video */}
          <ShoppableVideoCard
            productId="HT0gv7Hbem44if1vTttq"
            href="/product/HT0gv7Hbem44if1vTttq"
            videoSrc="/videos/red-sea-video.mp4"
            fallbackName="Red Sea"
            fallbackPrice={599}
          />
          
          {/* Slot 2: Al Rajaal video */}
          <ShoppableVideoCard
            productId="jAQ4G57"
            href="/product/ar-rijaal-jAQ4G57"
            videoSrc="/assets/Video-807.mp4"
            fallbackName="Al Rajaal"
            fallbackPrice={499}
          />

          {/* Slots 3–5: image reels */}
          {IMAGE_REELS.map((reel, i) => (
            <ImageReelCard key={i} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
