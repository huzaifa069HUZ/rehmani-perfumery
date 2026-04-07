'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'details' | 'wishlist'>('details');
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Profile Data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Wishlist Data
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [likedProducts, setLikedProducts] = useState<DocumentData[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

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
            setWishlistIds(data.wishlist);
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

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (wishlistIds.length === 0) {
        setLikedProducts([]);
        return;
      }
      try {
        // Firestore 'in' query limitation is 10 chunks. For a standard wishlist, batching is optimal.
        // We will fetch up to 10 for display natively to prevent chunking logic for basic integration.
        const chunk = wishlistIds.slice(0, 10);
        const q = query(collection(db, 'products'), where('__name__', 'in', chunk));
        const snapshots = await getDocs(q);
        const products: DocumentData[] = [];
        snapshots.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
        });
        setLikedProducts(products);
      } catch (error) {
        console.error("Error fetching liked products:", error);
      }
    };
    
    if (activeTab === 'wishlist' && wishlistIds.length > 0) {
      fetchLikedProducts();
    }
  }, [activeTab, wishlistIds]);

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

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const updatedList = wishlistIds.filter(id => id !== productId);
      setWishlistIds(updatedList);
      setLikedProducts(likedProducts.filter(p => p.id !== productId));
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        wishlist: updatedList
      }, { merge: true });
    } catch (err) {
      console.error("Error removing from wishlist", err);
    }
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
      `}</style>

      <Header onMenuOpen={() => {}} />

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
                className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                My Wishlist ({wishlistIds.length})
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

              {activeTab === 'wishlist' && (
                <div className="form-animation-fade">
                  <h2 className="section-title">My Loved Scents</h2>
                  <p className="section-desc">Products you have saved for later.</p>

                  <div className="wishlist-grid">
                    {likedProducts.map(p => (
                      <div className="wishlist-card" key={p.id}>
                        <div className="wish-img-box" onClick={() => router.push(`/product/${p.id}`)}>
                          <button className="wish-remove-btn" onClick={(e) => { e.stopPropagation(); handleRemoveFromWishlist(p.id); }} aria-label="Remove">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          </button>
                          {p.images?.[0] && (
                            <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover', padding: '10%' }} />
                          )}
                        </div>
                        <div className="wish-info">
                          <div className="wish-cat">{p.category || 'Perfume'}</div>
                          <div className="wish-name" onClick={() => router.push(`/product/${p.id}`)}>{p.name}</div>
                          <div style={{ fontWeight: 700 }}>₹{p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {wishlistIds.length === 0 && (
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
