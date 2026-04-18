'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, getDocs, addDoc, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import ProductCard from '@/components/ProductCard';
import { buildProductSlug } from '@/lib/utils';

interface ProductData {
  id: string;
  name: string;
  slug?: string;
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

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  photos: string[];
  createdAt: string;
}

// Firestore product for recommendations
interface FirestoreProduct {
  id: number | string;
  name: string;
  category: string;
  notes: string;
  price: number;
  originalPrice: number;
  sizes: number[];
  pricing?: Record<string, { price: number; originalPrice: number }>;
  images: string[];
  isNew: boolean;
  occasions: string[];
  type?: 'attar' | 'perfume';
}

/* ── Accordion data ── */
const ACCORDION_DATA = [
  {
    title: 'Benefits',
    content: `• Highly concentrated — a single drop lasts 8–12 hours\n• Alcohol-free formulation, gentle on skin\n• Deepens and evolves throughout the day\n• Natural projection without being overpowering\n• Long-lasting sillage trail that leaves an impression`,
  },
  {
    title: 'Clean Ingredients',
    content: `• 100% pure essential oils & natural extracts\n• No synthetic fillers or artificial stabilizers\n• Cruelty-free — never tested on animals\n• Free from parabens, phthalates & sulfates\n• Ethically sourced from trusted Arabian suppliers`,
  },
  {
    title: 'How to Use',
    content: `• Apply to pulse points — wrists, neck, behind ears\n• Dab gently, do not rub (rubbing breaks down fragrance molecules)\n• For prolonged wear, apply on moisturised skin\n• Store in a cool, dark place away from sunlight\n• A little goes a long way — start with one drop`,
  },
];

export default function ProductDetailClient({ product }: { product: ProductData }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  const [currentImg, setCurrentImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(
    product.sizes && product.sizes.length > 0
      ? [...product.sizes].sort((a, b) => a - b)[0]
      : null
  );
  const [adding, setAdding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState(false);

  /* Accordion */
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  /* Reviews */
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  /* Recommended products */
  const [recommended, setRecommended] = useState<FirestoreProduct[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ---------- Computed ---------- */
  const activePriceData =
    selectedSize && product.pricing ? product.pricing[selectedSize.toString()] : null;
  const displayPrice = activePriceData ? activePriceData.price : product.price;
  const displayOriginal = activePriceData ? activePriceData.originalPrice : product.originalPrice;
  const discountPct =
    displayOriginal && displayOriginal > displayPrice
      ? Math.round(((displayOriginal - displayPrice) / displayOriginal) * 100)
      : 0;

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let recommendedCount = 0;
  const allPhotos: string[] = [];

  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating as keyof typeof ratingCounts]++;
    if (r.rating >= 4) recommendedCount++;
    if (r.photos) {
      r.photos.forEach(p => allPhotos.push(p));
    }
  });

  const recommendedPct = reviews.length > 0 ? Math.round((recommendedCount / reviews.length) * 100) : 0;
  const reviewCarouselRef = useRef<HTMLDivElement>(null);

  const scrollReviewCarousel = (dir: 'left' | 'right') => {
    if (!reviewCarouselRef.current) return;
    const w = reviewCarouselRef.current.offsetWidth;
    reviewCarouselRef.current.scrollBy({ left: dir === 'left' ? -w * 0.7 : w * 0.7, behavior: 'smooth' });
  };

  /* ---------- Fetch reviews (real-time) ---------- */
  useEffect(() => {
    const reviewsRef = collection(db, 'products', product.id, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Review[];
      setReviews(data);
    }, (err) => console.warn('Reviews listener error:', err));
    return () => unsub();
  }, [product.id]);

  /* ---------- Fetch ALL products for recommendations ---------- */
  useEffect(() => {
    const fetchRec = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const prods = snap.docs
          .map(d => ({ id: d.id, ...(d.data() as Omit<FirestoreProduct, 'id'>) }))
          .filter(p => String(p.id) !== String(product.id));
        setRecommended(prods);
      } catch {
        console.warn('Could not load recommendations');
      }
    };
    fetchRec();
  }, [product.id]);

  /* ---------- Handlers ---------- */
  const handleAdd = () => {
    setAdding(true);
    addToCart({
      id: product.id,
      name: product.name,
      size: selectedSize || 6,
      price: displayPrice,
      image: product.images?.[0] || '',
    });
    setTimeout(() => setAdding(false), 400);
  };

  const prevImage = () => {
    if (!product.images) return;
    setCurrentImg((p) => (p === 0 ? product.images.length - 1 : p - 1));
  };

  const nextImage = () => {
    if (!product.images) return;
    setCurrentImg((p) => (p === product.images.length - 1 ? 0 : p + 1));
  };

  const handleShare = async () => {
    const url = `https://rahmaniperfumery.com/product/${buildProductSlug(product.name, product.id)}`;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: `Check out ${product.name} on Rahmani Perfumery!`, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg(true);
      setTimeout(() => setShareMsg(false), 2000);
    }
  };

  const handleWishlist = () => {
    const images = product.images || [];
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: images[0] || '',
    });
  };

  /* ── Review photo upload (Cloudinary) ── */
  const handlePhotoUpload = useCallback(async (file: File) => {
    setUploadingPhoto(true);
    try {
      const sigRes = await fetch('/api/upload-signature', { cache: 'no-store' });
      if (!sigRes.ok) throw new Error('Failed to get upload token');
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('api_key', apiKey);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST', body: formData,
      });
      const result = await res.json();
      const raw: string = result.secure_url;
      const idx = raw.indexOf('/upload/') + 8;
      const optimized = raw.slice(0, idx) + 'q_auto,f_auto,w_800/' + raw.slice(idx);
      setNewPhotos(prev => [...prev, optimized]);
    } catch (e) {
      console.error('Review photo upload failed:', e);
    } finally {
      setUploadingPhoto(false);
    }
  }, []);

  /* ── Submit Review ── */
  const handleSubmitReview = async () => {
    if (!user) { router.push('/auth'); return; }
    if (!newText.trim()) return;
    setSubmittingReview(true);
    try {
      const reviewsRef = collection(db, 'products', product.id, 'reviews');
      await addDoc(reviewsRef, {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Fragrance Lover',
        rating: newRating,
        text: newText.trim(),
        photos: newPhotos,
        createdAt: new Date().toISOString(),
      });
      setNewText('');
      setNewRating(5);
      setNewPhotos([]);
      setReviewFormOpen(false);
    } catch (e) {
      console.error('Failed to submit review:', e);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  /* ── Delete own review ── */
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteDoc(doc(db, 'products', product.id, 'reviews', reviewId));
    } catch (e) {
      console.error('Failed to delete review:', e);
    }
  };

  /* ── Carousel scroll ── */
  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const w = carouselRef.current.offsetWidth;
    carouselRef.current.scrollBy({ left: dir === 'left' ? -w * 0.7 : w * 0.7, behavior: 'smooth' });
  };

  /* ── Star renderer ── */
  const renderStars = (rating: number, size = 16, interactive = false) => (
    <div className="pp-stars" style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= (interactive ? (hoverRating || newRating) : Math.round(rating)) ? '#d4af5f' : 'none'}
          stroke="#d4af5f"
          strokeWidth="1.5"
          style={{ cursor: interactive ? 'pointer' : 'default', transition: 'fill 0.2s, transform 0.15s', transform: interactive && hoverRating === i ? 'scale(1.2)' : 'scale(1)' }}
          onClick={interactive ? () => setNewRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );

  return (
    <>
      <div className="top-bar-overlay" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
        <AnnouncementBar />
        <Header
          onMenuOpen={() => setMobileMenuOpen(true)}
          onSearchOpen={() => setIsSearchOpen(true)}
        />
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="pp-page">
        <div className="pp-breadcrumb">
          <span onClick={() => router.push('/')}>Home</span>
          <span>›</span>
          <span onClick={() => router.push(`/${product.type === 'perfume' ? 'perfumes' : 'attars'}`)}>
            {product.type === 'perfume' ? 'Perfumes' : 'Attars'}
          </span>
          <span>›</span>
          <span className="active">{product.name}</span>
        </div>

        {/* ─── TOP SECTION: Gallery + Info ─── */}
        <div className="pp-layout">
          {/* ── Gallery ── */}
          <div className="pp-gallery">
            <div className="pp-main-img">
              {product.images && product.images.length > 1 && (
                <button className="pp-arrow pp-arrow-left" onClick={prevImage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
              )}

              {product.images?.[currentImg] && (
                <Image
                  src={product.images[currentImg]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              )}

              {product.images && product.images.length > 1 && (
                <button className="pp-arrow pp-arrow-right" onClick={nextImage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              )}

              <div className="pp-img-actions">
                <button className="pp-img-action-btn" aria-label="Share" onClick={handleShare}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  {shareMsg && (
                    <div style={{ position: 'absolute', right: '50px', background: '#000', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                      Link Copied!
                    </div>
                  )}
                </button>
                <button className={`pp-img-action-btn${liked ? ' wishlisted' : ''}`} aria-label="Wishlist" onClick={handleWishlist}>
                  <svg width="18" height="18" viewBox="0 0 24 24"
                    fill={liked ? '#e74c6f' : 'none'}
                    stroke={liked ? '#e74c6f' : 'currentColor'}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              {/* Long Lasting Badge */}
              <div className="pp-longlasting-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Long Lasting
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="pp-thumbs">
                {product.images.map((img, idx) => (
                  <div key={idx} className={`pp-thumb ${currentImg === idx ? 'active' : ''}`} onClick={() => setCurrentImg(idx)}>
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="pp-info">
            <div className="pp-subtitle">{product.category} · {product.type === 'perfume' ? 'Perfume' : 'Attar'}</div>
            <h1 className="pp-maintitle">{product.name}</h1>

            {/* Rating summary */}
            {reviews.length > 0 && (
              <div className="pp-rating-summary">
                {renderStars(avgRating, 16)}
                <span className="pp-rating-num">{avgRating.toFixed(1)}</span>
                <span className="pp-rating-count">({reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'})</span>
              </div>
            )}

            {product.notes && <p className="pp-notes">{product.notes}</p>}

            <div className="pp-price-row">
              {displayOriginal && displayOriginal > displayPrice && (
                <span className="pp-price-old">₹{displayOriginal.toLocaleString()}</span>
              )}
              <span className="pp-price-current">₹{displayPrice?.toLocaleString()}</span>
              {discountPct > 0 && (
                <span className="pp-discount-badge">{discountPct}% OFF</span>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <>
                <div className="pp-selection-label">
                  Size: <strong>{selectedSize} ML</strong>
                </div>
                <div className="pp-sizes-grid">
                  {product.sizes.map((s) => (
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
              <button className={`pp-btn-cart ${adding ? 'adding' : ''}`} onClick={handleAdd}>
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="pp-btn-buy" onClick={handleAdd}>
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="pp-trust-row">
              <div className="pp-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Long Lasting 8-12 Hrs
              </div>
              <div className="pp-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                100% Pure Oils
              </div>
              <div className="pp-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Free Shipping ₹999+
              </div>
              <div className="pp-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Easy Returns
              </div>
            </div>

            <div className="pp-desc-title">Description</div>
            <p className="pp-desc-text">
              {product.description ||
                'Effortlessly luxurious and highly concentrated, this fragrance is perfect for daily wear or grand occasions. Crafted using centuries-old Arabic extraction techniques for maximum projection and an unforgettable sillage.'}
            </p>

            {/* ─── Accordion ─── */}
            <div className="pp-accordion">
              {ACCORDION_DATA.map((item, idx) => (
                <div key={idx} className={`pp-accordion-item ${openAccordion === idx ? 'open' : ''}`}>
                  <button
                    className="pp-accordion-header"
                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                  >
                    <span>{item.title}</span>
                    <span className="pp-accordion-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="16" className="pp-accordion-vline" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div className="pp-accordion-body">
                    <div className="pp-accordion-content">
                      {item.content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── REVIEWS SECTION ─── */}
        <section className="pp-reviews-section">
          <div className="pp-reviews-container">
            <div className="pp-reviews-top-row">
              {/* Review Summary */}
              <div className="pp-reviews-summary-col">
                <div className="pp-rc-flex-header">
                  <h2 className="pp-rc-title">Review Summary</h2>
                  <button
                    className="pp-rc-write-btn"
                    onClick={() => {
                      if (!user) { router.push('/auth'); return; }
                      setReviewFormOpen(true);
                    }}
                  >
                    Write a review
                  </button>
                </div>
                
                <div className="pp-rc-overview">
                  <span className="pp-rc-pct">{recommendedPct}% <span className="pp-rc-small-txt">Recommended</span></span>
                  <span className="pp-rc-avg">{avgRating.toFixed(1)} {renderStars(Math.round(avgRating), 16)} <span className="pp-rc-small-txt">out of {reviews.length} reviews</span></span>
                </div>

                <div className="pp-rc-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="pp-rc-bar-row">
                      <span className="pp-rc-bar-label">{star}</span>
                      <div className="pp-rc-bar-track">
                        <div className="pp-rc-bar-fill" style={{ width: reviews.length > 0 ? `${(ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100}%` : '0%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos Grid */}
              <div className="pp-reviews-photos-col">
                <h3 className="pp-rc-title" style={{ marginBottom: '14px' }}>Pictures by customers</h3>
                {allPhotos.length === 0 ? (
                  <p className="pp-rc-empty-txt">No customer photos yet.</p>
                ) : (
                  <div className="pp-rc-photos-grid">
                    {allPhotos.slice(0, 10).map((photo, i) => {
                      const isLast = i === 9;
                      const remainder = allPhotos.length - 10;
                      return (
                        <div key={i} className="pp-rc-photo-tile" onClick={() => setLightboxImg(photo)}>
                          <Image src={photo} alt="Customer upload" fill style={{ objectFit: 'cover' }} sizes="120px" />
                          {isLast && remainder > 0 && (
                            <div className="pp-rc-photo-overlay">+{remainder}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Comments by customers */}
            <div className="pp-reviews-bottom-row">
              <div className="pp-rc-comments-header">
                <h2 className="pp-rc-title">Comments by customers</h2>
                {reviews.length > 0 && (
                  <div className="pp-rc-nav">
                    <span className="pp-rc-view-all">View all</span>
                    <div className="pp-rc-nav-circles">
                      <button onClick={() => scrollReviewCarousel('left')} aria-label="Previous">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button onClick={() => scrollReviewCarousel('right')} aria-label="Next">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="pp-rc-empty-txt">Be the first to share your experience!</p>
              ) : (
                <div className="pp-rc-cards-track" ref={reviewCarouselRef}>
                  {reviews.map((review) => (
                    <div key={review.id} className="pp-rc-card">
                      <div className="pp-rc-card-top">
                        <div className="pp-rc-avatar">
                          {review.photos && review.photos.length > 0 ? (
                            <Image src={review.photos[0]} alt="" fill style={{ objectFit: 'cover' }} sizes="40px" />
                          ) : (
                            review.userName?.charAt(0)?.toUpperCase() || 'U'
                          )}
                        </div>
                        <span className="pp-rc-name">{review.userName}</span>
                        {user && user.uid === review.userId && (
                          <button className="pp-rc-delete" onClick={() => handleDeleteReview(review.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        )}
                      </div>
                      <div className="pp-rc-stars">
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{review.rating}/5</span>
                        <div style={{ marginLeft: 4 }}>{renderStars(review.rating, 14)}</div>
                      </div>
                      <p className="pp-rc-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── REVIEW FORM MODAL ─── */}
        {reviewFormOpen && (
          <div className="pp-review-modal-backdrop" onClick={() => setReviewFormOpen(false)}>
            <div className="pp-review-modal" onClick={(e) => e.stopPropagation()}>
              <button className="pp-review-modal-close" onClick={() => setReviewFormOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <h3 className="pp-review-modal-title">Share Your Experience</h3>
              <p className="pp-review-modal-subtitle">Let others know what you think of {product.name}</p>

              <div className="pp-review-form-group">
                <label>Your Rating</label>
                <div style={{ padding: '8px 0' }}>
                  {renderStars(newRating, 28, true)}
                </div>
              </div>

              <div className="pp-review-form-group">
                <label>Your Review</label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Tell us about the fragrance, projection, longevity..."
                  rows={4}
                />
              </div>

              <div className="pp-review-form-group">
                <label>Add Photos (Optional)</label>
                <div className="pp-review-photo-upload">
                  {newPhotos.map((p, i) => (
                    <div key={i} className="pp-review-photo-thumb">
                      <Image src={p} alt={`Upload ${i+1}`} fill style={{ objectFit: 'cover' }} sizes="60px" />
                      <button onClick={() => setNewPhotos(prev => prev.filter((_, j) => j !== i))} className="pp-review-photo-remove">×</button>
                    </div>
                  ))}
                  {newPhotos.length < 3 && (
                    <button
                      type="button"
                      className="pp-review-photo-add"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? (
                        <div style={{ width: '18px', height: '18px', border: '2px solid #e2e8f0', borderTopColor: '#d4af5f', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                        </svg>
                      )}
                    </button>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePhotoUpload(f);
                      e.target.value = '';
                    }}
                  />
                </div>
              </div>

              <button
                className="pp-review-submit-btn"
                onClick={handleSubmitReview}
                disabled={submittingReview || !newText.trim()}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}

        {/* ─── LIGHTBOX ─── */}
        {lightboxImg && (
          <div className="pp-lightbox" onClick={() => setLightboxImg(null)}>
            <Image src={lightboxImg} alt="Review photo" fill style={{ objectFit: 'contain', padding: '5%' }} sizes="100vw" />
            <button className="pp-lightbox-close" onClick={() => setLightboxImg(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}

        {/* ─── RECOMMENDED PRODUCTS ─── */}
        {recommended.length > 0 && (
          <section className="pp-recommend-section">
            <div className="pp-section-container">
              <div className="pp-recommend-header">
                <h2 className="pp-section-title">Recommended For You</h2>
                <div className="pp-recommend-arrows">
                  <button onClick={() => scrollCarousel('left')} className="pp-rec-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button onClick={() => scrollCarousel('right')} className="pp-rec-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
              <div className="pp-recommend-carousel" ref={carouselRef}>
                {recommended.map((p) => (
                  <div key={p.id} className="pp-recommend-card">
                    <ProductCard product={{
                      id: p.id as any,
                      name: p.name,
                      category: p.category,
                      notes: p.notes || '',
                      price: p.price,
                      originalPrice: p.originalPrice,
                      sizes: p.sizes || [6, 12],
                      images: p.images || [],
                      isNew: p.isNew || false,
                      occasions: p.occasions || [],
                      type: p.type,
                    } as any} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
