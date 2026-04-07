'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';

interface ProductData {
  id: string;
  name: string;
  category: string;
  gender?: string;
  description?: string;
  notes?: string;
  price: number;
  originalPrice: number;
  images: string[];
  type?: 'attar' | 'perfume';
  sizes?: number[];
  pricing?: Record<string, { price: number; originalPrice: number }>;
  occasions?: string[];
  isNew?: boolean;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareMsg, setShareMsg] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ProductData;
          data.id = docSnap.id;
          setProduct(data);
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize([...data.sizes].sort((a,b) => a - b)[0]);
          }
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, router]);

  useEffect(() => {
    if (user && productId) {
      const checkWishlist = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.wishlist && data.wishlist.includes(productId)) {
            setIsWishlisted(true);
          }
        }
      };
      checkWishlist();
    }
  }, [user, productId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) return null;

  const activePriceData = selectedSize && product.pricing ? product.pricing[selectedSize.toString()] : null;
  const displayPrice = activePriceData ? activePriceData.price : product.price;
  const displayOriginal = activePriceData ? activePriceData.originalPrice : product.originalPrice;

  const handleAdd = () => {
    setAdding(true);
    addToCart({
      id: product.id,
      name: product.name,
      size: selectedSize || 6,
      price: displayPrice,
      image: product.images?.[0] || '',
    });
    setTimeout(() => {
      setAdding(false);
    }, 400);
  };

  const handleBuyNow = () => {
    handleAdd();
  };

  const prevImage = () => {
    if(!product.images) return;
    setCurrentImg((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    if(!product.images) return;
    setCurrentImg((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Rehmani Perfumery!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareMsg(true);
      setTimeout(() => setShareMsg(false), 2000);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isWishlisted) {
        setIsWishlisted(false);
        await setDoc(userRef, { wishlist: arrayRemove(productId) }, { merge: true });
      } else {
        setIsWishlisted(true);
        await setDoc(userRef, { wishlist: arrayUnion(productId) }, { merge: true });
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
      setIsWishlisted(!isWishlisted); // Revert on failure
    }
  };

  return (
    <>
      <style>{`
        .product-content-wrapper {
          background: #fbfbf9; /* Super soft premium off-white matching var(--bg-light) vibe */
          color: var(--text);
          min-height: 100vh;
          padding-top: 130px;
          padding-bottom: 80px;
          font-family: var(--font-sans);
        }

        .breadcrumb {
          max-width: 1300px;
          margin: 0 auto 20px auto;
          padding: 0 30px;
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .breadcrumb span { cursor: pointer; transition: color 0.2s; }
        .breadcrumb span:hover { color: var(--gold); }
        .breadcrumb .active { color: var(--text); font-weight: 500; cursor: default; }
        
        .pp-layout {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          padding: 0 30px;
        }
        @media (max-width: 900px) {
          .pp-layout {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 0 20px;
          }
          .product-content-wrapper { padding-top: 100px; }
        }

        /* --- LEFT SIDE: GALLERY --- */
        .gallery-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .main-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1; /* Maintained explicitly square matching request */
          background: #f1f1eb; /* Soft neutral box */
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.04);
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0,0,0,0.05);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .gallery-arrow:hover { background: #fff; color: var(--gold); transform: translateY(-50%) scale(1.05); }
        .arrow-left { left: 16px; }
        .arrow-right { right: 16px; }

        .image-actions {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 10;
        }
        .img-action-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.05);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          transition: all 0.3s;
        }
        .img-action-btn:hover { color: var(--gold); transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0,0,0,0.1); }

        .horizontal-thumbs {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .horizontal-thumbs::-webkit-scrollbar { display: none; }
        .thumb-box {
          width: 80px;
          height: 80px;
          aspect-ratio: 1/1; /* Square thumbnails too */
          position: relative;
          background: #f1f1eb;
          border: 1px solid rgba(0,0,0,0.08); /* More visible border for light theme */
          border-radius: 4px;
          cursor: pointer;
          overflow: hidden;
          transition: border 0.3s;
          flex-shrink: 0;
        }
        .thumb-box.active { border-color: var(--text); border-width: 2px; }

        /* --- RIGHT SIDE: INFO --- */
        .info-wrap {
          padding-top: 10px;
        }

        .pp-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .pp-maintitle {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 16px;
          color: var(--text);
        }

        .pp-price-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .pp-price-current {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
        }
        .pp-price-old {
          font-size: 1.2rem;
          text-decoration: line-through;
          color: #999;
          font-weight: 500;
        }

        .pp-desc-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }
        .pp-desc-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 30px;
        }

        .pp-selection-row {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }

        .pp-sizes-grid {
          display: flex;
          gap: 10px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .pp-size-pill {
          min-width: 60px;
          padding: 10px 18px;
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
          background: #fff;
        }
        .pp-size-pill:hover { border-color: #aaa; }
        .pp-size-pill.active {
          border-color: var(--text);
          background: var(--text);
          color: #fff;
        }

        .pp-cta-row {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .btn-cart {
          flex: 1;
          height: 52px;
          background: var(--gold);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
          letter-spacing: 0.5px;
        }
        .btn-cart:hover { background: var(--charcoal); }
        .btn-cart.adding { background: var(--charcoal); transform: scale(0.98); }

        .btn-buy {
          flex: 1;
          height: 52px;
          background: transparent;
          color: var(--text);
          font-weight: 700;
          font-size: 0.95rem;
          border: 2px solid var(--border);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.5px;
        }
        .btn-buy:hover { border-color: var(--text); }

        .pp-links {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-decoration: underline;
          cursor: pointer;
          margin-bottom: 24px;
          display: inline-block;
        }
        .pp-links:hover { color: var(--text); }
      `}</style>

      {/* Global Header & Nav */}
      <div className="top-bar-overlay" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
        <AnnouncementBar />
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
      </div>

      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="product-content-wrapper">
        
        <div className="breadcrumb">
          <span onClick={() => router.push('/')}>Home</span> 
          <span>›</span>
          <span onClick={() => router.push(`/${product.type === 'perfume' ? 'perfumes' : 'attars'}`)}>
            {product.type === 'perfume' ? 'Perfumes' : 'Attars'}
          </span>
          <span>›</span>
          <span className="active">{product.name}</span>
        </div>

        <div className="pp-layout">
          
          <div className="gallery-wrap">
            <div className="main-img-box">
              {product.images && product.images.length > 1 && (
                <button className="gallery-arrow arrow-left" onClick={prevImage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
              )}
              
              {product.images?.[currentImg] && (
                <Image 
                  src={product.images[currentImg]} 
                  alt={product.name} 
                  fill 
                  style={{ objectFit: 'contain', padding: '8%' }}
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              )}

              {product.images && product.images.length > 1 && (
                <button className="gallery-arrow arrow-right" onClick={nextImage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              )}

              <div className="image-actions">
                <button className="img-action-btn" aria-label="Share" onClick={handleShare} style={{ position: 'relative' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  {shareMsg && (
                    <div style={{ position: 'absolute', right: '50px', background: '#000', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>Link Copied!</div>
                  )}
                </button>
                <button className="img-action-btn" aria-label="Wishlist" onClick={handleWishlist}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "var(--gold)" : "none"} stroke={isWishlisted ? "var(--gold)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="horizontal-thumbs">
                {product.images.map((img, idx) => (
                  <div key={idx} className={`thumb-box ${currentImg === idx ? 'active' : ''}`} onClick={() => setCurrentImg(idx)}>
                    <Image src={img} alt={`Thumb ${idx+1}`} fill style={{ objectFit: 'cover' }} sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-wrap">
            <div className="pp-subtitle">{product.category} Formulation</div>
            <h1 className="pp-maintitle">{product.name}</h1>

            <div className="pp-price-row">
              {displayOriginal && displayOriginal > displayPrice && (
                <span className="pp-price-old">₹{displayOriginal.toLocaleString()}</span>
              )}
              <span className="pp-price-current">₹{displayPrice?.toLocaleString()}</span>
            </div>

            <div className="pp-desc-title">Description:</div>
            <p className="pp-desc-text">
              {product.description || "Effortlessly luxurious and highly concentrated, this fragrance is perfect for daily wear or grand occasions. Crafted using centuries-old Arabic extraction techniques to assure maximum projection and an unforgettable sillage."}
            </p>

            {product.sizes && product.sizes.length > 0 && (
              <>
                <div className="pp-selection-row">
                  <div className="pp-desc-title" style={{ margin: 0, fontWeight: 500 }}>Size: <span style={{ fontWeight: 700 }}>{selectedSize} ML</span></div>
                </div>
                <div className="pp-sizes-grid">
                  {product.sizes.map(s => (
                    <button 
                      key={s} 
                      className={`pp-size-pill ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}ML
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="pp-cta-row">
              <button className={`btn-cart ${adding ? 'adding' : ''}`} onClick={handleAdd}>
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn-buy" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
