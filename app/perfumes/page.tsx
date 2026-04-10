'use client';

import '../attars/attars.css';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/data/products';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import QuickViewModal from '@/components/QuickViewModal';
import { buildProductSlug } from '@/lib/utils';

/* ── Types ──────────────────────────────────────────── */
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-az' | 'discount';

const CATEGORIES = [
  { id: 'all',    label: 'All Perfumes' },
  { id: 'oud',    label: 'Oud' },
  { id: 'musk',   label: 'Musk' },
  { id: 'floral', label: 'Floral' },
  { id: 'citrus', label: 'Citrus' },
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
  { label: 'Under ₹600', min: 0, max: 600 },
  { label: '₹600 – ₹900', min: 600, max: 900 },
  { label: '₹900 – ₹1200', min: 900, max: 1200 },
  { label: 'Above ₹1200', min: 1200, max: Infinity },
];

/* ── Helper ─────────────────────────────────────────── */
function discountPct(p: Product) {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

/* ── Product Card (inline) ─────────────────────────── */
function AttrListCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
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
        <h3 className="al-card-name">{product.name}</h3>
        <p className="al-card-notes truncate">{product.notes}</p>
        <div className="al-card-sizes">
          {(product.sizes || [6, 12]).map(s => <span key={s} className="al-size-chip">{s}ml</span>)}
        </div>
        <div className="al-card-price">
          <span className="al-price-now">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="al-price-was">₹{product.originalPrice}</span>
          )}
          {discountPct(product) > 0 && (
            <span className="al-price-discount">{discountPct(product)}% off</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function PerfumesPage() {
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

  const range = PRICE_RANGES[priceRange];

  const filtered = useMemo(() => {
    let list = dbProducts.filter(p => p.type === 'perfume');

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
    // - 'all' tab → show EVERY product (no filter at all)
    // - specific tab (oud, musk…) → show that category + anything saved as 'all attars'
    if (category !== 'all') {
      list = list.filter(p => {
        const cat = (p.category || '').toLowerCase().trim();
        return cat === category || cat === 'all perfumes' || cat === 'all';
      });
    }
    // When category === 'all': skip the filter entirely — show everything

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

  return (
    <div className="al-root">

      {/* ── Back bar ── */}
      <div className="al-topbar">
        <button className="al-back-btn" onClick={() => router.back()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 5 5 12 12 19"/>
          </svg>
          Back
        </button>
        <span className="al-topbar-brand">REHMANI PERFUMERY</span>
        <span />
      </div>

      {/* ── Hero banner ── */}
      <div className="al-hero">
        <div className="al-hero-overlay" />
        <div className="al-hero-content">
          <p className="al-hero-tag">THE COMPLETE COLLECTION</p>
          <h1 className="al-hero-title">{category === 'all' ? 'All Perfumes' : CATEGORIES.find(c => c.id === category)?.label}</h1>
          <div className="al-hero-divider" />
          <p className="al-hero-sub">Discover our full range of handcrafted Arabian perfumes</p>
        </div>
        <div className="al-hero-scroll-hint">
          <span className="al-scroll-dot" />
        </div>
      </div>

      {/* ── Search + Controls ── */}
      <div className="al-controls-bar">
        <div className="al-controls-inner">

          {/* Search */}
          <div className="al-search-wrap">
            <svg className="al-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="al-search-input"
              type="text"
              placeholder="Search perfumes, notes, categories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search perfumes"
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
            <h3 className="al-filter-title">Filter Products</h3>
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

      <div className="al-main">

        {/* ── Category sidebar tabs ── */}
        <aside className="al-sidebar">
          <p className="al-sidebar-title">Categories</p>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`al-cat-btn${category === c.id ? ' active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              <span className="al-cat-label">{c.label}</span>
              {category === c.id && <span className="al-cat-active-dot" />}
            </button>
          ))}
        </aside>

        {/* ── Category mobile strip ── */}
        <div className="al-cat-strip">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`al-cat-strip-btn${category === c.id ? ' active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* ── Product grid ── */}
        <div className="al-content">
          {/* Results info */}
          <div className="al-results-bar">
            <p className="al-results-count">
              {filtered.length === 0 ? 'No perfumes found' : `${filtered.length} Perfume${filtered.length !== 1 ? 's' : ''}`}
              {search && <span className="al-results-query"> for &ldquo;{search}&rdquo;</span>}
            </p>
            {activeFiltersCount > 0 && (
              <button className="al-results-reset" onClick={resetFilters}>
                Clear filters
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="al-empty">
              <div className="al-empty-icon">✦</div>
              <h3 className="al-empty-title">No perfumes found</h3>
              <p className="al-empty-sub">Try adjusting your search or filter criteria</p>
              <button className="al-empty-reset" onClick={() => { setSearch(''); resetFilters(); }}>
                Browse All Perfumes
              </button>
            </div>
          ) : (
            <div className={`al-grid ${mounted ? 'al-grid-mounted' : ''}`}>
              {filtered.map(product => (
                <AttrListCard
                  key={product.id}
                  product={product}
                  onOpen={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Bar (mobile) ── */}
      <div className="al-bottom-bar">
        <button
          className={`al-bottom-btn${filterOpen ? ' active' : ''}`}
          onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
        </button>
        <div className="al-bottom-divider" />
        <div className="al-sort-wrap" style={{ flex: 1 }}>
          <button
            className={`al-bottom-btn${sortOpen ? ' active' : ''}`}
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
