'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

interface DBBanner {
  id: string;
  image: string;
  link: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<DBBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as DBBanner[];
        setBanners(data);
      } catch (e) {
        console.error('Error fetching banners:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'banners', id));
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch {
      alert('Failed to delete banner.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (banner: DBBanner) => {
    setTogglingId(banner.id);
    const newVal = !banner.isActive;
    try {
      await updateDoc(doc(db, 'banners', banner.id), { isActive: newVal });
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: newVal } : b));
    } catch {
      alert('Failed to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px) saturate(180%);
          color: #1e293b;
          font-size: 14.5px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.6), inset 0 0 0 1px rgba(212,175,95,0.3);
        }

        .add-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 40px rgba(212,175,95,0.15), inset 0 0 0 1px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(212,175,95,0.5);
        }

        .main-card {
          background: white;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04);
          overflow: hidden;
          animation: fadeInUp 0.4s ease 0.15s both;
        }

        .banner-row {
          display: grid;
          grid-template-columns: 200px 1fr 100px 72px;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }
        
        @media (max-width: 768px) {
          .banner-row {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
            gap: 12px;
          }
          .banner-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .banner-header { display: none !important; }
        }

        .banner-row:hover {
          background: #fafbff;
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
        }

        .del-btn {
          background: #f1f5f9;
          color: #94a3b8;
        }

        .del-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        /* Toggle */
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
        .bs-toggle input:checked + .bs-toggle-track { background: #10b981; }
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
        }
        .bs-toggle:has(input:checked) .bs-label { color: #10b981; }
        
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
        }
        .empty-state-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 30px rgba(212,175,95,0.55);
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af5f, #c9973a)', boxShadow: '0 0 0 3px rgba(212,175,95,0.2)' }} />
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>Banners</h1>
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, paddingLeft: '18px', fontWeight: '400' }}>
            Manage the homepage image slider
          </p>
        </div>
        <Link href="/admin/banners/add" className="add-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Banner
        </Link>
      </div>

      {/* Main Panel */}
      <div className="main-card">
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Loading banners...</div>
        ) : banners.length === 0 ? (
           <div style={{ padding: '72px 32px', textAlign: 'center' }}>
             <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' }}>No banners found</h3>
             <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 28px' }}>Get started by uploading your first promotional banner.</p>
             <Link href="/admin/banners/add" className="empty-state-btn">Add your first banner</Link>
           </div>
        ) : (
          <div>
            <div className="banner-header" style={{ display: 'grid', gridTemplateColumns: '200px 1fr 100px 72px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: '#fafbff', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              <span>Image</span>
              <span>Link</span>
              <span>Status</span>
              <span></span>
            </div>
            {banners.map(banner => (
              <div key={banner.id} className="banner-row">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  {banner.image ? (
                     <Image src={banner.image} alt="Banner" fill style={{ objectFit: 'cover' }} />
                  ) : (
                     <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>No Image</span>
                  )}
                </div>
                
                <div style={{ overflow: 'hidden' }}>
                  <a href={banner.link} target="_blank" rel="noreferrer" style={{ fontSize: '14px', fontWeight: '500', color: '#3b82f6', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {banner.link || 'No link'}
                  </a>
                </div>

                <div>
                  <label className="bs-toggle">
                    <input type="checkbox" checked={banner.isActive} disabled={togglingId === banner.id} onChange={() => handleToggleActive(banner)} />
                    <div className="bs-toggle-track"><div className="bs-toggle-thumb" /></div>
                    <span className="bs-label">{banner.isActive ? 'Active' : 'Hidden'}</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleDelete(banner.id)} disabled={deletingId === banner.id} className="action-btn del-btn" title="Delete banner">
                    {deletingId === banner.id ? (
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
        )}
      </div>
    </div>
  );
}
