'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { buildProductSlug } from '@/lib/utils';

interface DBProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  isNew: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  images: string[];
  type?: 'attar' | 'perfume' | 'bakhoor' | 'incense';
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as DBProduct[];
        setProducts(data);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleBestSeller = async (product: DBProduct) => {
    setTogglingId(product.id);
    const newVal = !product.isBestSeller;
    try {
      await updateDoc(doc(db, 'products', product.id), { isBestSeller: newVal });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isBestSeller: newVal } : p));
    } catch {
      alert('Failed to update Best Seller status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleStock = async (product: DBProduct) => {
    setTogglingId(product.id + '-stock');
    const newVal = product.inStock === false ? true : false;
    try {
      await updateDoc(doc(db, 'products', product.id), { inStock: newVal });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newVal } : p));
    } catch {
      alert('Failed to update Stock status.');
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const newCount = products.filter(p => p.isNew).length;
  const catCount = new Set(products.map(p => p.category)).size;
  const bestSellerCount = products.filter(p => p.isBestSeller).length;

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      sub: 'in catalog',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      label: 'New Arrivals',
      value: newCount,
      sub: 'recently added',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
    },
    {
      label: 'Categories',
      value: catCount,
      sub: 'product types',
      gradient: 'linear-gradient(135deg, #d4af5f 0%, #c9973a 100%)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      label: 'Best Sellers',
      value: bestSellerCount,
      sub: 'shown on homepage',
      gradient: 'linear-gradient(135deg, #f472b6 0%, #C0687A 100%)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04);
          border: 1px solid rgba(255,255,255,0.8);
          animation: fadeInUp 0.4s ease both;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .add-product-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          color: #1e293b;
          font-size: 14.5px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.6), inset 0 0 0 1px rgba(212,175,95,0.3);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .add-product-btn:hover {
          transform: translateY(-2px) scale(1.02);
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 40px rgba(212,175,95,0.15), inset 0 0 0 1px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(212,175,95,0.5);
          color: #0f172a;
        }

        .add-product-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .search-input {
          width: 100%;
          height: 42px;
          padding: 0 16px 0 42px;
          font-size: 13.5px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          color: #1e293b;
          font-family: 'Inter', system-ui, sans-serif;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: #d4af5f;
          box-shadow: 0 0 0 3px rgba(212,175,95,0.12);
          background: white;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .product-row {
          display: grid;
          grid-template-columns: 1fr 90px 90px 80px 110px 90px 72px;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }

        .product-row:hover {
          background: #fafbff;
        }

        .product-row:last-child {
          border-bottom: none;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          text-decoration: none;
        }

        .edit-btn {
          background: #f1f5f9;
          color: #475569;
        }

        .edit-btn:hover {
          background: #e0e7ff;
          color: #4f46e5;
        }

        .del-btn {
          background: #f1f5f9;
          color: #94a3b8;
        }

        .del-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .badge-new {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #065f46;
          border: 1px solid rgba(6,95,70,0.1);
          letter-spacing: 0.02em;
        }

        .badge-draft {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .skeleton-line {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }

        .main-card {
          background: white;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04);
          overflow: hidden;
          animation: fadeInUp 0.4s ease 0.15s both;
        }

        .empty-state-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #d4af5f 0%, #c9973a 100%);
          color: #0d0d1f;
          font-size: 14px;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(212,175,95,0.45);
          letter-spacing: -0.01em;
        }

        .empty-state-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 30px rgba(212,175,95,0.55);
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 90px 90px 80px 110px 90px 72px;
          gap: 16px;
          padding: 12px 20px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbff;
        }

        /* Best Seller Toggle */
        .bs-toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .bs-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
        .bs-toggle-track {
          width: 42px; height: 24px;
          border-radius: 999px;
          background: #e2e8f0;
          transition: background 0.2s;
          position: relative;
          flex-shrink: 0;
        }
        .bs-toggle input:checked + .bs-toggle-track { background: #C0687A; }
        .bs-toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .bs-toggle input:checked ~ .bs-toggle-thumb { transform: translateX(18px); }
        .bs-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          transition: color 0.2s;
        }
        .bs-toggle:has(input:checked) .bs-label { color: #C0687A; }

        .th {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .table-wrapper {
          min-width: 650px;
        }

        .prd-meta { display: contents; }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .stats-grid > div:last-child {
            grid-column: 1 / -1;
          }
          .table-header {
            display: none !important;
          }
          .table-wrapper {
            min-width: 100%;
          }
          .table-container {
            padding: 0 16px 16px;
          }
          .product-row {
            display: flex;
            flex-direction: column;
            padding: 18px;
            margin-bottom: 16px;
            border-radius: 16px;
            background: #fff;
            border: 1px solid #e2e8f0 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            align-items: stretch;
          }
          .product-row:last-child {
             margin-bottom: 0;
          }
          .prd-info {
            width: 100%;
            margin-bottom: 16px;
          }
          .prd-meta {
            display: flex !important;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            width: 100%;
            background: #f8fafc;
            padding: 14px;
            border-radius: 12px;
            margin-bottom: 16px;
            border: 1px solid #f1f5f9;
          }
          .prd-type, .prd-status { min-width: 0 !important; }
          .prd-cat { min-width: 0 !important; flex: 1; }
          
          .prd-price {
            text-align: left !important;
            width: 100%;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .prd-price > div { margin: 0 !important; }
          
          .prd-actions {
            width: 100%;
            justify-content: space-between !important;
            padding-top: 14px;
            border-top: 1px dashed #e2e8f0;
          }
          .prd-actions .action-btn {
            flex: 1;
            height: 44px;
            border-radius: 10px;
            max-width: 48%;
          }
          .prd-actions .edit-btn { background: #e0e7ff; color: #4f46e5; }
          .prd-actions .del-btn { background: #fee2e2; color: #ef4444; }

          .page-header-flex {
            flex-direction: column;
            align-items: stretch !important;
          }
          .add-product-btn {
            width: 100%;
            justify-content: center;
            padding: 16px 24px;
            font-size: 16px;
            border-radius: 16px;
          }
        }
      `}</style>

      {/* ─── Page Header ─── */}
      <div className="page-header-flex" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af5f, #c9973a)',
              boxShadow: '0 0 0 3px rgba(212,175,95,0.2)',
            }} />
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
              Products
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, paddingLeft: '18px', fontWeight: '400' }}>
            Manage your inventory and product catalog
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowAddTypeModal(true)} className="add-product-btn" id="add-product-main-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="stat-icon" style={{ background: s.gradient }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', lineHeight: '1' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginTop: '3px' }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main Panel ─── */}
      <div className="main-card">

        {/* Search bar */}
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="search-products"
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          {!loading && (
            <div style={{
              padding: '6px 12px', background: '#f8fafc', borderRadius: '8px',
              border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '600', color: '#64748b'
            }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </div>
          )}
        </div>

        <div style={{ marginTop: '16px' }}>
          {loading ? (
            /* ─── Skeleton Loading ─── */
            <div style={{ padding: '0 20px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div className="skeleton-line" style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-line" style={{ width: '55%', height: '14px', marginBottom: '8px' }} />
                    <div className="skeleton-line" style={{ width: '30%', height: '11px' }} />
                  </div>
                  <div className="skeleton-line" style={{ width: '80px', height: '24px', borderRadius: '20px' }} />
                  <div className="skeleton-line" style={{ width: '70px', height: '18px' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* ─── Empty State ─── */
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '72px 32px', textAlign: 'center',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '24px',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                border: '2px dashed #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px', color: '#cbd5e1',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' }}>
                {search ? 'No results found' : 'Your catalog is empty'}
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '300px', lineHeight: '1.6', margin: '0 0 28px' }}>
                {search
                  ? `No products match "${search}". Try a different term.`
                  : 'Get started by adding your first product to the catalog.'}
              </p>
              {!search && (
                <Link href="/admin/products/add" className="empty-state-btn" id="empty-add-product-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add your first product
                </Link>
              )}
            </div>
          ) : (
            /* ─── Product Table ─── */
            <div className="table-container">
              <div className="table-wrapper">
                {/* Table Header */}
              <div className="table-header" style={{ gridTemplateColumns: '1fr 90px 90px 80px 110px 90px 72px' }}>
                <span className="th">Product</span>
                <span className="th">Type</span>
                <span className="th" style={{ minWidth: '90px' }}>Category</span>
                <span className="th" style={{ minWidth: '80px' }}>Status</span>
                <span className="th" style={{ minWidth: '110px' }}>Best Seller</span>
                <span className="th" style={{ minWidth: '90px', textAlign: 'right' }}>Price</span>
                <span className="th" style={{ minWidth: '72px' }}></span>
              </div>

              {/* Table Body */}
              <div>
                {filtered.map((product, idx) => (
                  <div key={product.id} className="product-row" style={{ animationDelay: `${idx * 0.04}s`, animation: 'fadeInUp 0.3s ease both' }}>
                    {/* Product info */}
                    <div className="prd-info" style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '12px',
                        background: '#f8fafc', border: '1.5px solid #e2e8f0',
                        overflow: 'hidden', flexShrink: 0, position: 'relative',
                      }}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="52px" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <Link href={`/admin/products/${product.id}`}
                          style={{
                            fontSize: '14px', fontWeight: '600', color: '#1e293b',
                            textDecoration: 'none', display: 'block',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#d4af5f')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#1e293b')}
                        >
                          {product.name}
                        </Link>
                        <Link
                          href={`/product/${buildProductSlug(product.name, product.id)}`}
                          target="_blank"
                          style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', display: 'block', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#d4af5f')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          /product/{buildProductSlug(product.name, product.id)}
                        </Link>
                      </div>
                    </div>

                    {/* Meta info wrapper for mobile */}
                    <div className="prd-meta">
                      {/* Type Badge */}
                      <div className="prd-type" style={{ minWidth: '90px' }}>
                        <span style={{ 
                        display: 'inline-flex', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em',
                        background: product.type === 'perfume' ? 'rgba(56, 189, 248, 0.15)' : product.type === 'bakhoor' ? 'rgba(168,132,42,0.15)' : product.type === 'incense' ? 'rgba(234,179,8,0.15)' : 'rgba(212,175,95,0.15)',
                        color: product.type === 'perfume' ? '#0ea5e9' : product.type === 'bakhoor' ? '#a8842a' : product.type === 'incense' ? '#ca8a04' : '#d4af5f', border: `1px solid ${product.type === 'perfume' ? 'rgba(56, 189, 248, 0.3)' : product.type === 'bakhoor' ? 'rgba(168,132,42,0.3)' : product.type === 'incense' ? 'rgba(234,179,8,0.3)' : 'rgba(212,175,95,0.3)'}`
                      }}>
                        {product.type === 'perfume' ? 'Perfume' : product.type === 'bakhoor' ? 'Bakhoor' : product.type === 'incense' ? 'Incense' : 'Attar'}
                      </span>
                    </div>

                    {/* Category */}
                    <span className="prd-cat" style={{ fontSize: '12.5px', fontWeight: '500', color: '#64748b', minWidth: '90px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.category || '—'}
                    </span>

                    {/* Status */}
                    <div className="prd-status" style={{ minWidth: '80px' }}>
                      <button 
                        onClick={() => handleToggleStock(product)}
                        disabled={togglingId === product.id + '-stock'}
                        style={{
                          border: 'none',
                          background: product.inStock === false ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: product.inStock === false ? '#ef4444' : '#22c55e',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          opacity: togglingId === product.id + '-stock' ? 0.5 : 1,
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span style={{ 
                          width: '6px', height: '6px', borderRadius: '50%', 
                          background: product.inStock === false ? '#ef4444' : '#22c55e' 
                        }}></span>
                        {product.inStock === false ? 'Out of Stock' : 'Active'}
                      </button>
                    </div>

                    {/* Best Seller Toggle */}
                    <div style={{ minWidth: '110px' }}>
                      <label className="bs-toggle" title={product.isBestSeller ? 'Remove from Best Sellers' : 'Add to Best Sellers'}>
                        <input
                          type="checkbox"
                          checked={!!product.isBestSeller}
                          disabled={togglingId === product.id}
                          onChange={() => handleToggleBestSeller(product)}
                        />
                        <div className="bs-toggle-track">
                          <div className="bs-toggle-thumb" />
                        </div>
                        <span className="bs-label">
                          {togglingId === product.id ? 'Saving…' : product.isBestSeller ? '★ Featured' : 'Off'}
                        </span>
                      </label>
                    </div>

                    {/* Price */}
                    <div className="prd-price" style={{ textAlign: 'right', minWidth: '90px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>₹{product.price?.toLocaleString()}</div>
                      {product.originalPrice > product.price && (
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', textDecoration: 'line-through', marginTop: '1px' }}>
                          ₹{product.originalPrice?.toLocaleString()}
                        </div>
                      )}
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="prd-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '72px', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/products/${product.id}`} className="action-btn edit-btn" title="Edit product" aria-label={`Edit ${product.name}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="action-btn del-btn"
                        title="Delete product"
                        style={{ opacity: deletingId === product.id ? 0.5 : 1 }}
                      >
                        {deletingId === product.id ? (
                          <div style={{ width: '14px', height: '14px', border: '2px solid #e2e8f0', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        {!loading && filtered.length > 0 && (
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fafbff',
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
              Showing {filtered.length} of {products.length} products
            </span>
            <Link href="/admin/products/add"
              style={{
                fontSize: '12px', fontWeight: '600', color: '#d4af5f',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add product
            </Link>
          </div>
        )}
      </div>

      {showAddTypeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setShowAddTypeModal(false)}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)', animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>What would you like to add?</h3>
              <button onClick={() => setShowAddTypeModal(false)} style={{
                background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/admin/products/add?type=attar" 
                style={{
                   display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px',
                   border: '1px solid #e2e8f0', background: '#f8fafc', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af5f'; e.currentTarget.style.background = 'rgba(212,175,95,0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '24px' }}>💧</span>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>Premium Attar</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>6ml, 12ml, and 24ml pure oils</div>
                </div>
              </Link>

              <Link href="/admin/products/add?type=perfume" 
                style={{
                   display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px',
                   border: '1px solid #e2e8f0', background: '#f8fafc', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af5f'; e.currentTarget.style.background = 'rgba(212,175,95,0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '24px' }}>✨</span>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>Luxury Perfume</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>30ml, 50ml, and 100ml sprays</div>
                </div>
              </Link>

              <Link href="/admin/products/add?type=bakhoor" 
                style={{
                   display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px',
                   border: '1px solid #e2e8f0', background: '#f8fafc', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af5f'; e.currentTarget.style.background = 'rgba(212,175,95,0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '24px' }}>🪔</span>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>Premium Bakhoor</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>20g, 40g, and 100g incense chips</div>
                </div>
              </Link>

              <Link href="/admin/products/add?type=incense" 
                style={{
                   display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px',
                   border: '1px solid #e2e8f0', background: '#f8fafc', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d4af5f'; e.currentTarget.style.background = 'rgba(212,175,95,0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '24px' }}>🕯️</span>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>Incense Sticks</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Premium aggarbatti packs</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
