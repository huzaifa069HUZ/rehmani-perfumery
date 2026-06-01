'use client';

import './gifting.css';
import '../attars/attars.css';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import QuickViewModal from '@/components/QuickViewModal';
import { buildProductSlug } from '@/lib/utils';

/* ── Types ──────────────────────────────────────────── */
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-az' | 'discount';

const GIFT_CATEGORIES = [
  { id: 'all',          label: 'All Gifts' },
  { id: 'corporate',    label: 'Corporate' },
  { id: 'wedding',      label: 'Wedding' },
  { id: 'celebrations', label: 'Celebrations' },
  { id: 'partner',      label: 'For Partners' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-az',    label: 'Name: A–Z' },
  { value: 'discount',   label: 'Best Discount' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹1000', min: 0, max: 1000 },
  { label: '₹1000 – ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 – ₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: Infinity },
];

/* ── Category Showcase Data ── */
const CATEGORY_SHOWCASE = [
  {
    id: 'corporate',
    title: 'Corporate Gifting',
    desc: 'Premium attar gift sets for your valued partners, clients & employees.',
    image: '/assets/corporate%20gifting.png',
    link: '#products',
  },
  {
    id: 'wedding',
    title: 'Wedding Favours',
    desc: 'Elegant fragrance gifts for weddings, receptions & engagements.',
    image: '/assets/wedding%20gift.png',
    link: '#products',
  },
  {
    id: 'celebrations',
    title: 'Celebrations',
    desc: 'Handpicked gift sets for Eid, birthdays & special occasions.',
    image: '/assets/gift-poster-2.png',
    link: '#products',
  },
  {
    id: 'partner',
    title: 'Gifts For Partners',
    desc: 'Express love with handcrafted fragrance gifts from the heart.',
    image: '/assets/love%20gift.png',
    link: '#products',
  },
];

/* ── Helper ─────────────────────────────────────────── */
function discountPct(p: Product) {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

/* ── Product Card (inline) ─────────────────────────── */
function GiftProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const router = useRouter();
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && imgIdx === 0 && (product.images?.length || 0) > 1) {
      setImgIdx(1);
    } else if (isRightSwipe && imgIdx === 1) {
      setImgIdx(0);
    }
  };

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id: product.id, name: product.name, size: product.sizes?.[0] || 6, price: product.price, image: product.images?.[0] || '' });
  }, [product, addToCart]);

  const handleCardClick = useCallback(() => {
    router.push(`/product/${buildProductSlug(product.name, String(product.id))}`);
  }, [product, router]);

  return (
    <div
      className="al-card"
      onMouseEnter={() => { setHovered(true); if (product.images?.length > 1) setImgIdx(1); }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="al-card-img-wrap"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {product.isNew && <span className="al-badge al-badge-new">New</span>}
        {discountPct(product) > 0 && <span className="al-badge al-badge-discount">-{discountPct(product)}%</span>}
        
        {product.images && product.images.length > 0 ? (
          <div className="al-img-slider">
            {product.images.slice(0, 2).map((img, i) => (
              <div
                key={i}
                className="al-img-slide"
                style={{ transform: `translateX(${(i - imgIdx) * 100}%)` }}
              >
                <Image src={img} alt={product.name} fill sizes="(max-width:600px) 50vw, 25vw" className="al-img" />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
        )}

        {/* Swipe dots */}
        {product.images && product.images.length > 1 && (
          <div className="al-img-dots">
            {product.images.slice(0, 2).map((_, i) => (
              <span key={i} className={`al-img-dot ${imgIdx === i ? 'active' : ''}`} />
            ))}
          </div>
        )}

        <button
          className={`al-quick-add${hovered ? ' visible' : ''}`}
          onClick={(e) => { e.stopPropagation(); onOpen(product); }}
        >QUICK VIEW</button>
      </div>
      <div className="al-card-body">
        <div style={{ flex: 1 }}>
          <h3 className="al-card-name">{product.name}</h3>
          <p className="al-card-notes truncate">{product.notes}</p>
          <div className="al-card-sizes">
            {product.type === 'giftset' ? (
              <span className="al-size-chip">1 Box</span>
            ) : (
              (product.sizes || [6, 12]).map(s => <span key={s} className="al-size-chip">{s}ml</span>)
            )}
          </div>
        </div>
        <div className="al-card-footer">
          <div className="al-card-price">
            <span className="al-price-now">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="al-price-was">₹{product.originalPrice}</span>
            )}
          </div>
          <button className="al-add-cart-btn" onClick={handleAdd} aria-label="Add to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function GiftingPage() {
  const router = useRouter();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort]         = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [newOnly, setNewOnly]   = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen,   setSortOpen]   = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const liveProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Product[];
        setDbProducts(liveProducts);
      } catch (error) {
        console.error('Firestore fetch error:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const validCategories = ['corporate', 'wedding', 'celebrations', 'partner'];
      if (validCategories.includes(hash)) {
        setCategory(hash);
        setTimeout(() => {
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, []);

  const range = PRICE_RANGES[priceRange];

  const filtered = useMemo(() => {
    // Only show explicit giftset products
    let list = dbProducts.filter(p => p.type === 'giftset');

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.notes || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }

    // category filter
    if (category !== 'all') {
      list = list.filter(p => {
        const cat = (p.category || '').toLowerCase().trim();
        return cat.includes(category.toLowerCase());
      });
    }

    // price
    list = list.filter(p => p.price >= range.min && p.price < range.max);

    // new only
    if (newOnly) list = list.filter(p => p.isNew);

    // sort
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-az':    list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'discount':   list.sort((a, b) => discountPct(b) - discountPct(a)); break;
    }

    return list;
  }, [dbProducts, search, category, sort, priceRange, newOnly, range.min, range.max]);

  const activeFiltersCount = (category !== 'all' ? 1 : 0) + (priceRange !== 0 ? 1 : 0) + (newOnly ? 1 : 0);

  const resetFilters = () => { setCategory('all'); setPriceRange(0); setNewOnly(false); };

  const handleCategoryClick = (catId: string) => {
    setCategory(catId);
    const el = document.getElementById('products');
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  return (
    <div className="gf-root">

      {/* ── Back bar ── */}
      <div className="gf-topbar">
        <button className="gf-back-btn" onClick={() => router.back()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 5 5 12 12 19"/>
          </svg>
          Back
        </button>
        <span className="gf-topbar-brand">REHMANI PERFUMERY</span>
        <span />
      </div>

      {/* ── Ultra-wide Hero Banner (21:9) ── */}
      <div className="gf-hero">
        <Image
          src="/assets/gifting hero.png"
          alt="Premium Gifting — Rahmani Perfumery"
          fill
          priority
          className="gf-hero-img desktop"
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <Image
          src="/assets/gifting hero mobile.png"
          alt="Premium Gifting — Rahmani Perfumery"
          fill
          priority
          className="gf-hero-img mobile"
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="gf-hero-overlay" />
        <div className="gf-hero-scroll-hint">
          <span className="gf-scroll-dot" />
        </div>
      </div>

      {/* ── Gift Categories Showcase ── */}
      <section className="gf-categories">
        <div className="gf-section-header">
          <p className="gf-section-tag">CURATED COLLECTIONS</p>
          <h2 className="gf-section-title">Choose Your Occasion</h2>
          <p className="gf-section-sub">
            Every occasion deserves a gift as unique as the moment. Explore our curated gifting categories, 
            each designed to make a lasting impression.
          </p>
        </div>
        <div className="gf-cat-grid">
          {CATEGORY_SHOWCASE.map(cat => (
            <div
              key={cat.id}
              className="gf-cat-card"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="gf-cat-card-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.title} className="gf-cat-card-img" loading="lazy" />
              </div>
              <div className="gf-cat-card-overlay" />
              <div className="gf-cat-card-content">
                <h3 className="gf-cat-card-title">{cat.title}</h3>
                <p className="gf-cat-card-desc">{cat.desc}</p>
                <span className="gf-cat-card-cta">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="gf-features">
        <div className="gf-features-inner">
          <div className="gf-feature-item">
            <div className="gf-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M12 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="12" y1="8" x2="12" y2="22"/>
              </svg>
            </div>
            <span className="gf-feature-title">Premium Packaging</span>
            <span className="gf-feature-desc">Luxury gift boxes with gold foil</span>
          </div>
          <div className="gf-feature-item">
            <div className="gf-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="gf-feature-title">Luxury Fragrances</span>
            <span className="gf-feature-desc">Handcrafted Arabian attars</span>
          </div>
          <div className="gf-feature-item">
            <div className="gf-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="12" cy="8" r="1"/>
              </svg>
            </div>
            <span className="gf-feature-title">Curated Combos</span>
            <span className="gf-feature-desc">Expertly matched fragrance sets</span>
          </div>
          <div className="gf-feature-item">
            <div className="gf-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <span className="gf-feature-title">Perfect for Every Occasion</span>
            <span className="gf-feature-desc">Weddings, Eid, birthdays & more</span>
          </div>
          <div className="gf-feature-item">
            <div className="gf-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <span className="gf-feature-title">Pan India Delivery</span>
            <span className="gf-feature-desc">Timely delivery, every time</span>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="gf-how-section">
        <div className="gf-section-header">
          <p className="gf-section-tag">SIMPLE PROCESS</p>
          <h2 className="gf-section-title">How It Works</h2>
          <p className="gf-section-sub">
            Ordering your perfect gift is easy. Follow these four simple steps.
          </p>
        </div>
        <div className="gf-how-grid">
          <div className="gf-how-step">
            <div className="gf-how-num">01</div>
            <h3 className="gf-how-title">Choose Category</h3>
            <p className="gf-how-desc">Select from corporate, wedding, celebrations, or personal gifting.</p>
          </div>
          <div className="gf-how-step">
            <div className="gf-how-num">02</div>
            <h3 className="gf-how-title">Pick Fragrances</h3>
            <p className="gf-how-desc">Browse our curated collection and select your favourite attars.</p>
          </div>
          <div className="gf-how-step">
            <div className="gf-how-num">03</div>
            <h3 className="gf-how-title">Choose Combo</h3>
            <p className="gf-how-desc">Select from our expertly curated gift set combos and luxury packaging.</p>
          </div>
          <div className="gf-how-step">
            <div className="gf-how-num">04</div>
            <h3 className="gf-how-title">We Deliver</h3>
            <p className="gf-how-desc">Premium packaging delivered pan-India with care and on time.</p>
          </div>
        </div>
      </section>

      {/* ── Product Grid Section ── */}
      <div id="products">
        {/* ── Search + Controls ── */}
        <div className="gf-controls-bar al-controls-bar">
          <div className="al-controls-inner gf-controls-inner">
            {/* Search */}
            <div className="al-search-wrap">
              <svg className="al-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="al-search-input"
                type="text"
                placeholder="Search gift sets, fragrances…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search gifts"
              />
              {search && (
                <button className="al-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Sort button */}
            <div className="al-sort-wrap">
              <button
                className="al-action-btn"
                onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}
                aria-label="Sort products"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>
                </svg>
                <span>Sort By</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {sortOpen && (
                <div className="al-dropdown">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      className={`al-dropdown-item${sort === opt.value ? ' active' : ''}`}
                      onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    >
                      {sort === opt.value && <span className="al-check">✓</span>}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter button */}
            <button
              className={`al-action-btn${activeFiltersCount > 0 ? ' al-action-btn-active' : ''}`}
              onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}
              aria-label="Filter products"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              <span>Filter</span>
              {activeFiltersCount > 0 && <span className="al-filter-count">{activeFiltersCount}</span>}
            </button>
          </div>
        </div>

        {/* ── Filter Drawer ── */}
        {filterOpen && (
          <div className="al-filter-drawer">
            <div className="al-filter-header">
              <h3 className="al-filter-title">Filter Gift Sets</h3>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {activeFiltersCount > 0 && (
                  <button className="al-filter-reset" onClick={resetFilters}>Reset All</button>
                )}
                <button className="al-filter-close" onClick={() => setFilterOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="al-filter-body">
              {/* Price range */}
              <div className="al-filter-group">
                <p className="al-filter-group-title">Price Range</p>
                <div className="al-filter-chips">
                  {PRICE_RANGES.map((r, i) => (
                    <button
                      key={i}
                      className={`al-filter-chip${priceRange === i ? ' active' : ''}`}
                      onClick={() => setPriceRange(i)}
                    >{r.label}</button>
                  ))}
                </div>
              </div>

              {/* New arrivals */}
              <div className="al-filter-group">
                <p className="al-filter-group-title">Availability</p>
                <label className="al-toggle-label">
                  <div className={`al-toggle${newOnly ? ' active' : ''}`} onClick={() => setNewOnly(v => !v)}>
                    <span className="al-toggle-thumb" />
                  </div>
                  <span>New Arrivals Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="gf-main">

          {/* ── Category sidebar tabs ── */}
          <aside className="gf-sidebar">
            <p className="gf-sidebar-title">Gift Categories</p>
            {GIFT_CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`gf-cat-btn${category === c.id ? ' active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                <span className="gf-cat-label">{c.label}</span>
                {category === c.id && <span className="gf-cat-active-dot" />}
              </button>
            ))}
          </aside>

          {/* ── Category mobile strip ── */}
          <div className="gf-cat-strip">
            {GIFT_CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`gf-cat-strip-btn${category === c.id ? ' active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* ── Product grid ── */}
          <div className="gf-content">
            {/* Results info */}
            <div className="gf-results-bar">
              <p className="gf-results-count">
                {filtered.length === 0 ? 'No gift sets found' : `${filtered.length} Gift Set${filtered.length !== 1 ? 's' : ''}`}
                {search && <span className="gf-results-query"> for &ldquo;{search}&rdquo;</span>}
              </p>
              {activeFiltersCount > 0 && (
                <button className="gf-results-reset" onClick={resetFilters}>
                  Clear filters
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="gf-empty">
                <div className="gf-empty-icon">✦</div>
                <h3 className="gf-empty-title">No gift sets found</h3>
                <p className="gf-empty-sub">Try adjusting your search or filter criteria</p>
                <button className="gf-empty-reset" onClick={() => { setSearch(''); resetFilters(); }}>
                  Browse All Gifts
                </button>
              </div>
            ) : (
              <div className={`al-grid ${mounted ? 'gf-grid-mounted' : ''}`}>
                {filtered.map(product => (
                  <GiftProductCard
                    key={product.id}
                    product={product}
                    onOpen={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── WhatsApp CTA Banner ── */}
      <section className="gf-cta-banner" style={{ margin: '0 2.5rem 5rem' }}>
        <div className="gf-cta-inner">
          <div className="gf-cta-text">
            <p className="gf-cta-tag">BULK ORDERS & CURATED GIFTS</p>
            <h2 className="gf-cta-title">Need a Special Gift Solution?</h2>
            <p className="gf-cta-desc">
              For bulk corporate orders, exquisite wedding favours, or premium gift sets — 
              reach out to our gifting experts on WhatsApp for instant assistance and exclusive pricing.
            </p>
          </div>
          <Link
            href="https://wa.me/918340783679?text=Hi%2C%20I%27m%20interested%20in%20your%20premium%20gifting%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="gf-cta-btn"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </Link>
        </div>
      </section>

      {/* ── Bottom Bar (mobile) ── */}
      <div className="gf-bottom-bar">
        <button
          className={`gf-bottom-btn${filterOpen ? ' active' : ''}`}
          onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
        </button>
        <div className="gf-bottom-divider" />
        <div className="al-sort-wrap" style={{ flex: 1 }}>
          <button
            className={`gf-bottom-btn${sortOpen ? ' active' : ''}`}
            style={{ width: '100%' }}
            onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>
            </svg>
            Sort By
          </button>
          {sortOpen && (
            <div className="al-dropdown al-dropdown-up">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`al-dropdown-item${sort === opt.value ? ' active' : ''}`}
                  onClick={() => { setSort(opt.value); setSortOpen(false); }}
                >
                  {sort === opt.value && <span className="al-check">✓</span>}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick View Modal ── */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
