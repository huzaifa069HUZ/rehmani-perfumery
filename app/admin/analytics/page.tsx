'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProductStat {
  id: string;
  name: string;
  category: string;
  images?: string[];
  price: number;
  cartCount: number;
  wishlistCount: number;
}

interface CartItem {
  id: string | number;
  name: string;
  size: number;
  price: number;
  quantity: number;
  image?: string;
}

interface CartUser {
  uid: string;
  email?: string;
  name?: string;
  phone?: string;
  googleName?: string;
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<ProductStat[]>([]);
  const [users, setUsers] = useState<{ id: string; wishlist?: string[] }[]>([]);
  const [cartUsers, setCartUsers] = useState<CartUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Force fresh read from Firestore server (bypass local SDK cache)
        const { getDocsFromServer } = await import('firebase/firestore');

        const prodSnap = await getDocsFromServer(collection(db, 'products'));
        const prodList = prodSnap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<ProductStat, 'id' | 'cartCount' | 'wishlistCount'>),
          cartCount: 0,
          wishlistCount: 0,
        }));

        const userSnap = await getDocsFromServer(collection(db, 'users'));
        const userList = userSnap.docs.map(d => ({ id: d.id, ...(d.data() as { wishlist?: string[] }) }));

        // Build cart users list — users who have at least one item in their cart
        const cartUsersList: CartUser[] = [];
        userSnap.docs.forEach(d => {
          const data = d.data() as {
            name?: string; phone?: string; email?: string; googleName?: string;
            wishlist?: string[];
            cart?: CartItem[];
          };
          if (data.cart && data.cart.length > 0) {
            const cartTotal = data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartItemCount = data.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartUsersList.push({
              uid: d.id,
              email: data.email || '',
              name: data.name || '',
              googleName: data.googleName || '',
              phone: data.phone || '',
              cart: data.cart,
              cartTotal,
              cartItemCount,
            });
          }
        });
        cartUsersList.sort((a, b) => b.cartTotal - a.cartTotal);

        userList.forEach(u => {
          if (u.wishlist) {
            u.wishlist.forEach(pid => {
              const prod = prodList.find(p => p.id === pid);
              if (prod) prod.wishlistCount++;
            });
          }
        });

        setProducts(prodList);
        setUsers(userList);
        setCartUsers(cartUsersList);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]); // re-runs every time refreshKey changes

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalWishlisted = products.reduce((sum, p) => sum + p.wishlistCount, 0);
  const usersWithWishlist = users.filter(u => u.wishlist && u.wishlist.length > 0).length;
  const wishlistRate = totalUsers > 0 ? Math.round((usersWithWishlist / totalUsers) * 100) : 0;
  const avgWishlistPerUser = totalUsers > 0 ? (totalWishlisted / totalUsers).toFixed(1) : '0';
  const sortedByWishlist = [...products].sort((a, b) => b.wishlistCount - a.wishlistCount);
  const maxWish = sortedByWishlist[0]?.wishlistCount || 1;

  const kpis = [
    { label: 'Total Products', value: totalProducts, sub: 'In catalogue', color: '#1e3a5f', accent: '#2563eb', icon: '📦' },
    { label: 'Registered Users', value: totalUsers, sub: 'Unique accounts', color: '#14302a', accent: '#16a34a', icon: '👤' },
    { label: 'Total Hearts', value: totalWishlisted, sub: 'Across all users', color: '#3b1f0a', accent: '#d4af37', icon: '❤️' },
    { label: 'Wishlist Rate', value: `${wishlistRate}%`, sub: 'Users who engaged', color: '#1f1040', accent: '#7c3aed', icon: '📊' },
  ];

  const suggestions = [
    { icon: '🛒', title: 'Cart Abandonment', desc: 'Track users who added to cart but never purchased. Industry avg: 70%. Key lever for recovery.', tag: 'HIGH IMPACT', tc: '#dc2626', bg: '#fef2f2' },
    { icon: '💰', title: 'Revenue by Product', desc: 'Identify top revenue-generating products vs underperformers to focus inventory.', tag: 'CRITICAL', tc: '#16a34a', bg: '#f0fdf4' },
    { icon: '📈', title: 'Sales Over Time', desc: 'Weekly/monthly line chart — spot seasonal peaks like Eid or Diwali to stock ahead.', tag: 'RECOMMENDED', tc: '#2563eb', bg: '#eff6ff' },
    { icon: '🔁', title: 'Repeat Buyer Rate', desc: 'Percentage of customers who ordered 2+ times. Higher = stronger brand loyalty.', tag: 'LOYALTY', tc: '#d97706', bg: '#fffbeb' },
    { icon: '🌍', title: 'Geographic Demand', desc: 'Detect top cities/regions to optimize delivery partners and COD availability.', tag: 'GROWTH', tc: '#0891b2', bg: '#ecfeff' },
    { icon: '🔍', title: 'Search Behavior', desc: 'What customers search for most reveals gaps in your product catalogue.', tag: 'PRODUCT', tc: '#7c3aed', bg: '#f5f3ff' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#d4af37', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#6b7280', fontSize: '0.9rem', fontFamily: 'Inter, system-ui, sans-serif' }}>Loading analytics...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .an-page { padding: 32px; max-width: 1200px; margin: 0 auto; font-family: 'Inter', system-ui, sans-serif; }
        @media (max-width: 768px) { .an-page { padding: 16px; } }

        /* Page heading */
        .an-h1 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .an-sub { font-size: 0.85rem; color: #64748b; margin-bottom: 32px; }

        /* KPI Cards */
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .kpi-card {
          border-radius: 14px;
          padding: 24px;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }
        .kpi-icon { font-size: 1.6rem; margin-bottom: 4px; }
        .kpi-val { font-size: 2.2rem; font-weight: 800; line-height: 1; color: #fff; }
        .kpi-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; opacity: 0.75; }
        .kpi-foot { font-size: 0.75rem; opacity: 0.55; margin-top: 2px; }

        /* Panels */
        .an-panel {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 26px;
          margin-bottom: 22px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .an-panel-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .live-badge {
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 20px;
          background: #dcfce7;
          color: #16a34a;
          font-weight: 700;
          letter-spacing: 0.06em;
          border: 1px solid #bbf7d0;
        }

        /* Leaderboard Table */
        .lb-table { width: 100%; border-collapse: collapse; }
        .lb-table th { 
          text-align: left; font-size: 0.68rem; text-transform: uppercase; 
          letter-spacing: 0.1em; color: #94a3b8; font-weight: 700;
          padding: 10px 12px; border-bottom: 2px solid #f1f5f9;
        }
        .lb-table td { 
          padding: 14px 12px; font-size: 0.88rem; color: #1e293b; 
          border-bottom: 1px solid #f8fafc; vertical-align: middle;
        }
        .lb-table tr:last-child td { border-bottom: none; }
        .lb-table tr:hover td { background: #f8fafc; }

        .rank-ball {
          width: 28px; height: 28px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 800;
        }

        /* Bar chart */
        .bar-row { display: flex; flex-direction: column; gap: 14px; }
        .bar-item { display: flex; align-items: center; gap: 12px; }
        .bar-name { font-size: 0.82rem; color: #374151; width: 150px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
        .bar-track { flex: 1; height: 9px; background: #f1f5f9; border-radius: 6px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 6px; transition: width 0.8s ease; }
        .bar-count { font-size: 0.78rem; color: #6b7280; width: 28px; text-align: right; font-weight: 700; flex-shrink: 0; }

        /* Engagement Row */
        .eng-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 14px; }
        .eng-tile {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 18px;
        }
        .eng-val { font-size: 2rem; font-weight: 800; line-height: 1; }
        .eng-label { font-size: 0.72rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; margin-top: 8px; }

        /* Suggestions */
        .sug-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        .sug-card {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 18px;
          display: flex; gap: 14px; align-items: flex-start;
        }
        .sug-ico { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
        .sug-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .sug-desc { font-size: 0.78rem; color: #64748b; line-height: 1.55; }
        .sug-tag {
          display: inline-block; margin-top: 10px;
          font-size: 0.65rem; padding: 3px 8px; border-radius: 4px;
          font-weight: 800; letter-spacing: 0.07em;
        }

        .two-col { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; margin-bottom: 22px; }
        @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
      `}</style>

      <div className="an-page">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="an-h1">Analytics</h1>
            <p className="an-sub" style={{ marginBottom: 0 }}>
              Live from Firestore
              {lastUpdated && <span style={{ marginLeft: '8px', color: '#16a34a', fontWeight: 600 }}>· Last updated {lastUpdated}</span>}
            </p>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '8px',
              background: loading ? '#f1f5f9' : '#0f172a',
              color: loading ? '#94a3b8' : '#fff',
              border: 'none', cursor: loading ? 'wait' : 'pointer',
              fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all 0.2s', marginTop: '4px',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }}>
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {loading ? 'Fetching...' : 'Refresh'}
          </button>
        </div>
        <div style={{ marginBottom: '28px' }} />

        {/* KPI Cards — each with its own deep colored bg */}
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi-card" key={i} style={{ background: `linear-gradient(135deg, ${k.color} 0%, ${k.accent}cc 100%)` }}>
              <div className="kpi-icon">{k.icon}</div>
              <div className="kpi-val">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-foot">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard + Bar Chart */}
        <div className="two-col">
          <div className="an-panel">
            <div className="an-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              Most Wished Products
              <span className="live-badge">LIVE</span>
            </div>
            <table className="lb-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Hearts</th>
                </tr>
              </thead>
              <tbody>
                {sortedByWishlist.slice(0, 8).map((p, idx) => {
                  const medals = [
                    { bg: '#fef9c3', color: '#ca8a04' },
                    { bg: '#f1f5f9', color: '#64748b' },
                    { bg: '#fff7ed', color: '#c2410c' },
                  ];
                  const m = medals[idx] || { bg: '#f8fafc', color: '#94a3b8' };
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className="rank-ball" style={{ background: m.bg, color: m.color }}>
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{p.category || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: p.wishlistCount > 0 ? '#d4af37' : '#cbd5e1', fontWeight: 800 }}>
                          {p.wishlistCount > 0 ? `♥ ${p.wishlistCount}` : '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '28px', fontSize: '0.85rem' }}>
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="an-panel">
            <div className="an-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Wishlist Distribution
            </div>
            <div className="bar-row">
              {sortedByWishlist.slice(0, 7).map(p => {
                const pct = maxWish > 0 ? (p.wishlistCount / maxWish) * 100 : 0;
                const barColor = pct > 60 ? '#d4af37' : pct > 30 ? '#2563eb' : '#64748b';
                return (
                  <div className="bar-item" key={p.id}>
                    <div className="bar-name" title={p.name}>{p.name}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.max(pct, 4)}%`, background: barColor }} />
                    </div>
                    <div className="bar-count">{p.wishlistCount}</div>
                  </div>
                );
              })}
              {products.length === 0 && (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>No data yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Active Carts Panel */}
        <div className="an-panel">
          <div className="an-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Active Carts
            <span className="live-badge" style={{ background: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}>REAL-TIME</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
              {cartUsers.length} user{cartUsers.length !== 1 ? 's' : ''} with items in cart
            </span>
          </div>
          {cartUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 20px', color: '#94a3b8', fontSize: '0.88rem' }}>
              No logged-in users have items in their cart right now.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="lb-table" style={{ minWidth: '750px' }}>
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th style={{ textAlign: 'center' }}>Items</th>
                    <th style={{ textAlign: 'right' }}>Cart Value</th>
                    <th>Products in Cart</th>
                  </tr>
                </thead>
                <tbody>
                  {cartUsers.map((cu, idx) => (
                    <tr key={cu.uid}>
                      <td>
                        <span className="rank-ball" style={{ background: '#fee2e2', color: '#dc2626' }}>{idx + 1}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                          {cu.name || cu.googleName || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>—</span>}
                        </div>
                        {cu.googleName && !cu.name && (
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px' }}>via Google</div>
                        )}
                        <div style={{ fontSize: '0.68rem', color: '#cbd5e1', fontFamily: 'monospace', marginTop: '1px' }}>{cu.uid.slice(0, 14)}&hellip;</div>
                      </td>
                      <td>
                        {cu.email ? (
                          <div>
                            <a href={`mailto:${cu.email}`} style={{ color: '#2563eb', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
                              {cu.email}
                            </a>
                          </div>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>Missing — ask user to re-login</span>
                        )}
                      </td>
                      <td>
                        {cu.phone ? (
                          <span style={{ color: '#0f172a', fontSize: '0.88rem', fontWeight: 600 }}>{cu.phone}</span>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '0.82rem', fontStyle: 'italic' }}>Not provided</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                          {cu.cartItemCount}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#16a34a', fontSize: '0.95rem' }}>
                        &#8377;{cu.cartTotal.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {cu.cart.slice(0, 3).map((item, i) => (
                            <div key={i} style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37', flexShrink: 0, display: 'inline-block' }} />
                              {item.name} ({item.size}ml) &times; {item.quantity}
                            </div>
                          ))}
                          {cu.cart.length > 3 && (
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>+{cu.cart.length - 3} more</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Engagement */}
        <div className="an-panel">
          <div className="an-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            User Engagement Breakdown
          </div>
          <div className="eng-grid">
            {[
              { v: totalUsers, l: 'Total Accounts', c: '#2563eb' },
              { v: usersWithWishlist, l: 'Active Wishlists', c: '#d4af37' },
              { v: totalUsers - usersWithWishlist, l: 'No Wishlist Yet', c: '#ef4444' },
              { v: `${wishlistRate}%`, l: 'Wishlist Rate', c: '#7c3aed' },
              { v: avgWishlistPerUser, l: 'Avg Per User', c: '#0891b2' },
              { v: cartUsers.length, l: 'Active Carts Now', c: '#ef4444' },
            ].map((e, i) => (
              <div className="eng-tile" key={i}>
                <div className="eng-val" style={{ color: e.c }}>{e.v}</div>
                <div className="eng-label">{e.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Suggestions */}
        <div className="an-panel">
          <div className="an-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Recommended Analytics to Add
          </div>
          <div className="sug-grid">
            {suggestions.map((s, i) => (
              <div className="sug-card" key={i} style={{ borderLeft: `3px solid ${s.tc}` }}>
                <div className="sug-ico">{s.icon}</div>
                <div>
                  <div className="sug-title">{s.title}</div>
                  <div className="sug-desc">{s.desc}</div>
                  <span className="sug-tag" style={{ background: s.bg, color: s.tc }}>{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '0.73rem', color: '#94a3b8', textAlign: 'center', marginTop: '8px' }}>
          Data pulled live from Firestore · Cart & Revenue analytics require Orders collection (coming after payment integration)
        </p>
      </div>
    </>
  );
}
