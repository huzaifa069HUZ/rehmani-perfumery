'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalSearch from '@/components/GlobalSearch';

interface OrderItem { name: string; size: number; price: number; quantity: number; }
interface UserOrder {
  id: string;
  items: OrderItem[];
  finalTotal: number;
  shippingFee: number;
  paymentMethod: string;
  status: string;
  createdAt: any;
  shippingAddress: { city: string; state: string; };
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:   { bg: '#FEF9C3', text: '#854D0E', dot: '#EAB308' },
  Confirmed: { bg: '#DCFCE7', text: '#166534', dot: '#16A34A' },
  Shipped:   { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  Delivered: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'details' | 'orders' | 'wishlist'>('details');
  const [profileLoading, setProfileLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Profile Data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Orders
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Wishlist Context Data
  const { wishlist: contextWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Fetch orders
  useEffect(() => {
    if (!user || activeTab !== 'orders') return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const data: UserOrder[] = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as UserOrder)).sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user, activeTab]);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          
          if (data.wishlist && Array.isArray(data.wishlist)) {
            // Note: WishlistContext handles the syncing of this data automatically.
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name,
        phone,
        address,
      }, { merge: true }); // Merge ensures we don't overwrite wishlist array
      setSaveMsg('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      setSaveMsg('Error updating profile. Check Firestore rules.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleRemoveFromWishlist = async (productId: string | number) => {
    removeFromWishlist(productId);
  };

  if (authLoading || profileLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <style>{`
        .profile-wrapper {
          background: #fbfbf9;
          min-height: 100vh;
          padding-top: 120px;
          padding-bottom: 80px;
          font-family: var(--font-sans);
          color: var(--text);
        }
        .profile-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .profile-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
        }
        .logout-btn {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #dc2626;
          background: transparent;
          border: 1px solid #dc2626;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover { 
          background: #dc2626;
          color: #fff; 
        }
        
        .profile-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 60px;
        }
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr; gap: 30px; }
        }

        .tabs-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tab-btn {
          text-align: left;
          padding: 14px 20px;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .tab-btn:hover {
          background: rgba(0,0,0,0.02);
        }
        .tab-btn.active {
          background: #fff;
          color: var(--text);
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        /* Form Styles */
        .content-col {
          background: #fff;
          border-radius: 8px;
          padding: 40px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 10px 40px rgba(0,0,0,0.02);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          .content-col { padding: 24px; }
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .section-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 30px;
        }

        .input-group {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-label {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .input-field {
          padding: 14px 16px;
          border-radius: 6px;
          border: 1px solid rgba(0,0,0,0.1);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          transition: border 0.3s;
          background: #fafafa;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--gold);
          background: #fff;
        }
        .input-field:disabled {
          background: #f0f0f0;
          color: #999;
          cursor: not-allowed;
        }

        .save-btn {
          margin-top: 10px;
          padding: 16px 30px;
          background: var(--charcoal);
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .save-btn:hover { background: var(--gold); }
        .save-btn:disabled { opacity: 0.7; cursor: wait; }

        .sys-msg {
          margin-top: 16px;
          font-size: 0.85rem;
          color: #3BA068;
          font-weight: 500;
        }

        /* Wishlist Grid */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 24px;
        }
        .wishlist-card {
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 6px;
          overflow: hidden;
          background: #fbfbf9;
          position: relative;
        }
        .wish-img-box {
          position: relative;
          aspect-ratio: 1/1;
          background: #f1f1eb;
          cursor: pointer;
        }
        .wish-remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.1);
          z-index: 10;
          transition: all 0.2s;
        }
        .wish-remove-btn:hover { color: red; border-color: red; }
        .wish-info {
          padding: 16px;
        }
        .wish-cat { font-size: 0.65rem; color: var(--gold); text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em; }
        .wish-name { font-size: 1rem; font-weight: 600; margin: 4px 0 8px; cursor: pointer; }
        .wish-name:hover { text-decoration: underline; }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
        }

        /* Orders */
        .orders-list { display: flex; flex-direction: column; gap: 16px; }
        .order-card {
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          transition: border-color 0.2s;
        }
        .order-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px; cursor: pointer; background: #fafafa;
        }
        .order-header:hover { background: #f5f5f5; }
        .order-main-info { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
        .order-id { font-weight: 700; font-family: monospace; font-size: 1.1rem; word-break: break-all; }
        .order-date { font-size: 0.8rem; color: var(--text-muted); }
        .order-status-wrap { display: flex; align-items: center; gap: 12px; }
        .order-status {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .order-dot { width: 6px; height: 6px; border-radius: 50%; }
        
        .order-details {
          padding: 20px;
          border-top: 1px solid rgba(0,0,0,0.06);
          animation: fadein 0.3s ease-out forwards;
        }
        @keyframes fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        
        .order-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .order-item-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.04); }
        .order-item-row:last-child { border-bottom: none; padding-bottom: 0; }
        .oi-name { font-weight: 600; font-size: 0.95rem; }
        .oi-meta { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
        .oi-price { font-weight: 700; }
        
        .order-summary {
          background: #fafafa; padding: 16px; border-radius: 6px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .os-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted); }
        .os-total { display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(0,0,0,0.1); }
        .os-method { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; text-align: right; }

        @media (max-width: 600px) {
          .profile-container { padding: 0 16px; }
          .content-col { padding: 20px 16px; }
          .order-header { padding: 16px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .order-status-wrap { width: 100%; justify-content: space-between; }
          .order-details { padding: 16px; }
          .oi-main { flex: 1; min-width: 0; padding-right: 12px; }
          .oi-name { white-space: normal; word-break: break-word; }
        }
      `}</style>

      <Header onMenuOpen={() => {}} onSearchOpen={() => setIsSearchOpen(true)} />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="profile-wrapper">
        <div className="profile-container">
          
          <div className="profile-header">
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Account Portal</div>
              <h1 className="profile-title">Welcome back{name ? `, ${name.split(' ')[0]}` : ''}.</h1>
            </div>
            <button className="logout-btn" onClick={logout}>Sign Out</button>
          </div>

          <div className="profile-layout">
            <div className="tabs-col">
              <button 
                className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Personal Details
              </button>
              <button 
                className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                My Orders
              </button>
              <button 
                className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                My Wishlist ({contextWishlist.length})
              </button>
            </div>

            <div className="content-col">
              
              {activeTab === 'details' && (
                <div className="form-animation-fade">
                  <h2 className="section-title">Personal Information</h2>
                  <p className="section-desc">Keep your details up to date for seamless checkout.</p>
                  
                  <form onSubmit={handleSaveProfile}>
                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <input type="email" className="input-field" value={user.email || ''} disabled title="Cannot change email here" />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Mohammed Rahman" />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Phone Number</label>
                      <input type="tel" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Delivery Address</label>
                      <textarea className="input-field" style={{ minHeight: '100px', resize: 'vertical' }} value={address} onChange={e => setAddress(e.target.value)} placeholder="Complete street address for shipments" />
                    </div>

                    <button type="submit" className="save-btn" disabled={saving}>
                      {saving ? 'UPDATING...' : 'SAVE CHANGES'}
                    </button>
                    {saveMsg && <div className="sys-msg">{saveMsg}</div>}
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="form-animation-fade">
                  <h2 className="section-title">Order History</h2>
                  <p className="section-desc">View and track your recent orders.</p>

                  {ordersLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', opacity: 0.3 }}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                      <p>You haven't placed any orders yet.</p>
                      <button onClick={() => router.push('/store')} style={{ marginTop: 16, color: 'var(--gold)', fontWeight: 600, textDecoration: 'underline' }}>Shop our collection.</button>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {orders.map(order => {
                        const isExpanded = expandedOrder === order.id;
                        const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                        const dateStr = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        }) || '—';
                        const displayOrderId = (order as any).orderId || order.id;

                        return (
                          <div key={order.id} className="order-card" style={{ borderColor: isExpanded ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.06)' }}>
                            <div className="order-header" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                              <div className="order-main-info">
                                <span className="order-id">#{displayOrderId}</span>
                                <span className="order-date">{dateStr}</span>
                              </div>
                              <div className="order-status-wrap">
                                <span className="order-status" style={{ background: sc.bg, color: sc.text }}>
                                  <span className="order-dot" style={{ background: sc.dot }} />
                                  {order.status}
                                </span>
                                <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                                </span>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="order-details">
                                <div className="order-items">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="order-item-row">
                                      <div className="oi-main">
                                        <div className="oi-name">{item.name}</div>
                                        <div className="oi-meta">{item.size === 1 ? '1 Box' : `${item.size}ml`} &times; {item.quantity}</div>
                                      </div>
                                      <div className="oi-price">{item.price === 0 ? 'FREE' : `₹${item.price * item.quantity}`}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="order-summary">
                                  <div className="os-row">
                                    <span>Subtotal</span>
                                    <span>₹{order.finalTotal - order.shippingFee}</span>
                                  </div>
                                  <div className="os-row">
                                    <span>Shipping</span>
                                    <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                                  </div>
                                  <div className="os-total">
                                    <span>Total</span>
                                    <span>₹{order.finalTotal}</span>
                                  </div>
                                  <div className="os-method">Paid via: {order.paymentMethod}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="form-animation-fade">
                  <h2 className="section-title">My Loved Scents</h2>
                  <p className="section-desc">Products you have saved for later.</p>

                  <div className="wishlist-grid">
                    {contextWishlist.map(p => (
                      <div className="wishlist-card" key={p.id}>
                        <div className="wish-img-box" onClick={() => router.push(`/product/${p.name.toLowerCase().replace(/\s+/g, '-')}-${p.id}`)}>
                          <button className="wish-remove-btn" onClick={(e) => { e.stopPropagation(); handleRemoveFromWishlist(p.id); }} aria-label="Remove">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          </button>
                          {p.image && (
                            <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover', padding: '10%' }} />
                          )}
                        </div>
                        <div className="wish-info">
                          <div className="wish-cat">Attar</div>
                          <div className="wish-name" onClick={() => router.push(`/product/${p.name.toLowerCase().replace(/\s+/g, '-')}-${p.id}`)}>{p.name}</div>
                          <div style={{ fontWeight: 700 }}>₹{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {contextWishlist.length === 0 && (
                    <div className="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 0.3 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      <p>Your wishlist is currently empty.</p>
                      <button onClick={() => router.push('/')} style={{ marginTop: 16, color: 'var(--gold)', fontWeight: 600, textDecoration: 'underline' }}>Discover our collection.</button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
