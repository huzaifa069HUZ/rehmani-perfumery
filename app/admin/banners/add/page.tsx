'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import Image from 'next/image';

export default function AddBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) { alert("Please upload a banner image."); return; }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'banners'), {
        image,
        link,
        isActive,
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/banners'), 1500);
    } catch (error) {
      console.error('Error adding banner:', error);
      alert('Failed to add banner. Please try again.');
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-[10px] text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/10 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes checkDraw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
        @keyframes successPop { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-card {
          background: white;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.04);
          overflow: hidden;
          animation: fadeInUp 0.4s ease both;
        }

        .card-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbff;
        }

        .card-body {
          padding: 24px;
        }

        .field-group {
          margin-bottom: 24px;
        }
        
        .field-group:last-child {
          margin-bottom: 0;
        }

        .btn-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: white;
          font-size: 14.5px;
          font-weight: 600;
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(15,23,42,0.15);
          width: 100%;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.25);
        }
        
        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-submit.success {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 8px 24px rgba(16,185,129,0.3);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
          margin-bottom: 20px;
        }
        .back-link:hover { color: #0f172a; }

        /* Toggle */
        .bs-toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
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
      `}</style>

      <Link href="/admin/banners" className="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Banners
      </Link>

      <div className="form-card">
        <div className="card-header">
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Add New Banner</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Upload a high-quality landscape image for the homepage slider.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="card-body">
          <div className="field-group">
            <label className={labelClass}>Banner Image (Recommended 1920x800)</label>
            <div style={{ marginTop: '8px' }}>
              {!image ? (
                <div style={{ 
                  border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '32px',
                  background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                   <CloudinaryUpload 
                     onSuccess={(url) => setImage(url)} 
                     buttonText="Upload Banner Image" 
                   />
                   <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px', textAlign: 'center' }}>
                     Make sure important text is in the center so it doesn't get cut off on mobile devices.
                   </p>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <Image src={image} alt="Uploaded Banner" fill style={{ objectFit: 'cover' }} />
                  <button 
                    type="button" 
                    onClick={() => setImage('')}
                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="field-group">
            <label className={labelClass}>Redirect Link</label>
            <input 
              type="text" 
              className={inputClass} 
              placeholder="e.g., /attars or /product/my-product"
              value={link} 
              onChange={e => setLink(e.target.value)} 
            />
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>When users click the banner, where should they go?</p>
          </div>

          <div className="field-group">
            <label className="bs-toggle">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
              <div className="bs-toggle-track"><div className="bs-toggle-thumb" /></div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                Active (Show on homepage)
              </span>
            </label>
          </div>

          <div style={{ marginTop: '32px' }}>
             <button type="submit" disabled={loading || success} className={`btn-submit ${success ? 'success' : ''}`}>
               {success ? (
                 <>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'successPop 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                     <path d="M20 6L9 17l-5-5" strokeDasharray="40" strokeDashoffset="40" style={{ animation: 'checkDraw 0.4s ease 0.1s forwards' }} />
                   </svg>
                   Banner Added!
                 </>
               ) : loading ? (
                 <>
                   <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                   Saving...
                 </>
               ) : (
                 'Save Banner'
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
