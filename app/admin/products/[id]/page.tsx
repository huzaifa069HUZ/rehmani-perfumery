'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import Image from 'next/image';

const CATEGORIES = [
  { label: 'All Attars (shows in every category)', value: 'all attars' },
  { label: 'Oud', value: 'oud' },
  { label: 'Musk', value: 'musk' },
  { label: 'Floral', value: 'floral' },
  { label: 'Citrus', value: 'citrus' },
];
const GENDERS = ['Unisex', 'Him', 'Her'];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [name, setName] = useState('');
  const [productType, setProductType] = useState<'attar'|'perfume'>('attar');
  const [sizes, setSizes] = useState<number[]>([6, 12, 24]);
  const [availableSizes, setAvailableSizes] = useState<number[]>([6, 12, 24]);
  const [pricing, setPricing] = useState<Record<number, { price: string; originalPrice: string }>>({
    6: { price: '', originalPrice: '' },
    12: { price: '', originalPrice: '' },
    24: { price: '', originalPrice: '' },
  });
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('Unisex');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setSizes(data.sizes || [6, 12, 24]);
          
          // Populate pricing map from database, supporting old price fallback
          const dbPricing = data.pricing || {};
          const fallbackPrice = data.price?.toString() || '';
          const fallbackOriginalPrice = data.originalPrice?.toString() || fallbackPrice;
          
          setPricing({
             6: { price: dbPricing['6']?.price?.toString() || fallbackPrice, originalPrice: dbPricing['6']?.originalPrice?.toString() || fallbackOriginalPrice },
             12: { price: dbPricing['12']?.price?.toString() || fallbackPrice, originalPrice: dbPricing['12']?.originalPrice?.toString() || fallbackOriginalPrice },
             24: { price: dbPricing['24']?.price?.toString() || fallbackPrice, originalPrice: dbPricing['24']?.originalPrice?.toString() || fallbackOriginalPrice },
          });
          setCategory(data.category || 'oud');
          setGender(data.gender || 'Unisex');
          setDescription(data.description || '');
          setNotes(data.notes || '');
          setImages(data.images || []);
          setTagsInput((data.occasions || []).join(', '));
          setIsNew(!!data.isNew);
          
          if (data.type === 'perfume') {
            setProductType('perfume');
            setAvailableSizes([30, 50, 100]);
          } else {
            setProductType('attar');
            setAvailableSizes([6, 12, 24]);
          }
        } else {
          alert('Product not found!');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router]);

  const handleImageUploadSuccess = (url: string) => { setImages(prev => [...prev, url]); };
  const removeImage = (index: number) => { setImages(prev => prev.filter((_, i) => i !== index)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { alert("Please ensure at least one product image remains."); return; }
    setLoading(true);
    try {
      const sortedSizes = [...sizes].sort((a, b) => a - b);
      if (sortedSizes.length === 0) { alert('Please select at least one bottle size.'); setLoading(false); return; }
      
      const parsedPricing: Record<string, { price: number; originalPrice: number }> = {};
      for (const size of sortedSizes) {
         const pData = pricing[size];
         if (!pData || !pData.price || isNaN(parseFloat(pData.price))) {
            alert(`Please enter a valid selling price for the ${size}ml bottle.`);
            setLoading(false);
            return;
         }
         const p = parseFloat(pData.price);
         const op = pData.originalPrice ? parseFloat(pData.originalPrice) : p;
         
         parsedPricing[size.toString()] = { price: p, originalPrice: op };
      }

      const basePrice = parsedPricing[sortedSizes[0]].price;
      const baseOriginalPrice = parsedPricing[sortedSizes[0]].originalPrice;

      const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await updateDoc(doc(db, 'products', id), {
        name, category: category.toLowerCase(), gender, description, notes,
        price: basePrice, originalPrice: baseOriginalPrice, isNew,
        sizes: sortedSizes, pricing: parsedPricing, type: productType,
        images, occasions: parsedTags, updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (error: unknown) {
      console.error('Error saving product:', error);
      setLoading(false);
      if (error instanceof Error && error.message === 'TIMEOUT') {
        setSaveError('Save timed out. Check your internet connection and try again.');
      } else {
        setSaveError('Error saving product. Check console for details.');
      }
    }

  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-[10px] text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/10 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";


  if (initialLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: '16px' }}>
        <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#d4af5f', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Loading product details...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.9) translateY(-8px); }
          60% { transform: scale(1.02) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }

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
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-header-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-header h2 {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .card-header p {
          font-size: 12px;
          color: #94a3b8;
          margin: 2px 0 0;
        }

        .card-body {
          padding: 24px;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-group:last-child {
          margin-bottom: 0;
        }

        .field-label {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 7px;
        }

        .field-hint {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 5px;
          font-weight: 400;
        }

        .premium-input {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13.5px;
          color: #1e293b;
          font-family: 'Inter', system-ui, sans-serif;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .premium-input:focus {
          border-color: #d4af5f;
          background: white;
          box-shadow: 0 0 0 3px rgba(212,175,95,0.12);
        }

        .premium-input::placeholder {
          color: #94a3b8;
        }

        .premium-textarea {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13.5px;
          color: #1e293b;
          font-family: 'Inter', system-ui, sans-serif;
          outline: none;
          transition: all 0.2s;
          resize: vertical;
          box-sizing: border-box;
          min-height: 110px;
          line-height: 1.6;
        }

        .premium-textarea:focus {
          border-color: #d4af5f;
          background: white;
          box-shadow: 0 0 0 3px rgba(212,175,95,0.12);
        }

        .premium-textarea::placeholder {
          color: #94a3b8;
        }

        .premium-select {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 36px 11px 14px;
          font-size: 13.5px;
          color: #1e293b;
          font-family: 'Inter', system-ui, sans-serif;
          outline: none;
          transition: all 0.2s;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          box-sizing: border-box;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }

        .premium-select:focus {
          border-color: #d4af5f;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(212,175,95,0.12);
        }

        .price-input-wrap {
          position: relative;
        }

        .price-symbol {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          pointer-events: none;
          z-index: 1;
        }

        .price-input-wrap .premium-input {
          padding-left: 28px;
        }

        .image-thumb {
          position: relative;
          width: 88px;
          height: 88px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          overflow: hidden;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .image-thumb-remove {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          cursor: pointer;
          border: none;
          width: 100%;
          height: 100%;
        }

        .image-thumb:hover .image-thumb-remove {
          opacity: 1;
        }

        .save-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          color: #1e293b;
          font-size: 14.5px;
          font-weight: 600;
          padding: 14px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.6), inset 0 0 0 1px rgba(212,175,95,0.3);
          letter-spacing: -0.01em;
          font-family: 'Inter', system-ui, sans-serif;
        }

        @media (max-width: 768px) {
          .save-btn {
            padding: 16px 24px;
            font-size: 16px;
            border-radius: 16px;
          }
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 40px rgba(212,175,95,0.15), inset 0 0 0 1px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(212,175,95,0.5);
          color: #0f172a;
        }

        .save-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }

        .save-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .discard-btn {
          width: 100%;
          background: #f8fafc;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 600;
          padding: 11px 24px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-family: 'Inter', system-ui, sans-serif;
          text-decoration: none;
          margin-top: 10px;
        }

        .discard-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #ef4444;
        }

        .toggle-btn {
          position: relative;
          width: 44px;
          height: 24px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: background 0.25s;
          flex-shrink: 0;
        }

        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .success-banner {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 1.5px solid #a7f3d0;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: successPop 0.5s ease both;
        }

        .error-banner {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          border: 1.5px solid #fca5a5;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: successPop 0.5s ease both;
        }

        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: white;
          border: 1.5px solid #e2e8f0;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .back-btn:hover {
          background: #f8fafc;
          border-color: #d4af5f;
          color: #d4af5f;
        }

        .gender-pill {
          flex: 1;
          padding: 9px 12px;
          border-radius: 9px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .gender-pill:hover {
          border-color: #d4af5f;
          color: #d4af5f;
        }

        .gender-pill-active {
          background: linear-gradient(135deg, rgba(212,175,95,0.15), rgba(212,175,95,0.08));
          border-color: #d4af5f;
          color: #c9973a;
        }

        .upload-zone {
          position: relative;
          border: 2px dashed #e2e8f0;
          border-radius: 14px;
          padding: 28px 20px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 130px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .upload-zone:hover {
          border-color: #d4af5f;
          background: rgba(212,175,95,0.04);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 900px) {
          .form-grid { flex-direction: column !important; }
          .form-sidebar { width: 100% !important; }
        }

        @media (max-width: 600px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ─── Page Header ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px', animation: 'fadeInUp 0.3s ease' }}>
        <Link href="/admin/products" className="back-btn" id="back-to-products">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af5f, #c9973a)',
              boxShadow: '0 0 0 3px rgba(212,175,95,0.2)',
            }} />
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
              Edit Product
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '2px 0 0 18px' }}>Update the details for this product</p>
        </div>
      </div>

      {/* ─── Success Banner ─── */}
      {success && (
        <div className="success-banner">
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 40, strokeDashoffset: 0, animation: 'checkDraw 0.5s ease 0.2s both' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#065f46' }}>Product updated successfully!</div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>Redirecting to products list...</div>
          </div>
        </div>
      )}

      {/* ─── Error Banner ─── */}
      {saveError && (
        <div className="error-banner">
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#991b1b' }}>{saveError}</div>
            <button onClick={() => setSaveError('')} style={{ fontSize: '12px', color: '#dc2626', marginTop: '2px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Dismiss</button>
          </div>
        </div>
      )}

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* ─── LEFT COLUMN (Main) ─── */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Product Details Card */}
            <div className="form-card" style={{ animationDelay: '0.05s' }}>
              <div className="card-header">
                <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div>
                  <h2>Product Details</h2>
                  <p>Name, description and fragrance profile</p>
                </div>
              </div>
              <div className="card-body">
                {/* ─── Type Segmented Control ─── */}
                <div className="field-group">
                  <label className="field-label">Product Type</label>
                  <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setProductType('attar');
                        setSizes([6, 12, 24]);
                        setAvailableSizes([6, 12, 24]);
                      }}
                      style={{ 
                        flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                        background: productType === 'attar' ? '#fff' : 'transparent',
                        color: productType === 'attar' ? '#0f172a' : '#64748b',
                        boxShadow: productType === 'attar' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', border: 'none', cursor: 'pointer'
                      }}>
                      Attar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductType('perfume');
                        setSizes([30, 50, 100]);
                        setAvailableSizes([30, 50, 100]);
                      }}
                      style={{ 
                        flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                        background: productType === 'perfume' ? '#fff' : 'transparent',
                        color: productType === 'perfume' ? '#0f172a' : '#64748b',
                        boxShadow: productType === 'perfume' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', border: 'none', cursor: 'pointer'
                      }}>
                      Perfume
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="product-name">Product Name</label>
                  <input
                    id="product-name"
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="premium-input"
                    placeholder="e.g. Royal Oud Attar"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="product-desc">Description</label>
                  <textarea
                    id="product-desc"
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="premium-textarea"
                    placeholder="Write a captivating description of the fragrance, its mood, and occasion…"
                  />
                  <div className="field-hint">{description.length} characters — aim for 80+</div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="product-notes">Fragrance Notes</label>
                  <input
                    id="product-notes"
                    required
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="premium-input"
                    placeholder="Top: Bergamot · Heart: Rose, Jasmine · Base: Oud, Amber"
                  />
                  <div className="field-hint">Separate top, heart, and base notes with · or commas</div>
                </div>
              </div>
            </div>

            {/* Media Card */}
            <div className="form-card" style={{ animationDelay: '0.1s' }}>
              <div className="card-header">
                <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div>
                  <h2>Product Images</h2>
                  <p>Upload high-quality photos (up to 8MB each)</p>
                </div>
              </div>
              <div className="card-body">
                {/* Uploaded thumbnails */}
                {images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    {images.map((url, i) => (
                      <div key={i} className="image-thumb">
                        <Image src={url} alt={`Preview ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="88px" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="image-thumb-remove"
                          title="Remove image"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                        {i === 0 && (
                          <div style={{
                            position: 'absolute', top: '6px', left: '6px',
                            background: 'linear-gradient(135deg, #d4af5f, #c9973a)',
                            color: '#0d0d1f', fontSize: '9px', fontWeight: '800',
                            padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em',
                          }}>MAIN</div>
                        )}
                      </div>
                    ))}
                    {/* Add more slot */}
                    <div style={{ width: '88px', height: '88px', borderRadius: '12px', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: '#f8fafc' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Upload zone */}
                <div style={{ position: 'relative' }}>
                  <CloudinaryUpload onUploadSuccess={handleImageUploadSuccess} />
                </div>

                {images.length === 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    At least one image is required. First image becomes the main product photo.
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="form-card" style={{ animationDelay: '0.15s' }}>
              <div className="card-header">
                <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #d4af5f, #c9973a)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <div>
                  <h2>Bottle Sizes & Pricing</h2>
                  <p>Configure options and their prices</p>
                </div>
              </div>
              <div className="card-body">
                {/* ─── Bottle Sizes ─── */}
                <div className="field-group">
                  <label className="field-label">
                    Active Bottle Sizes
                    <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: '500', color: '#94a3b8', textTransform: 'none', letterSpacing: 0 }}>(select all that apply)</span>
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {availableSizes.map(ml => {
                      const active = sizes.includes(ml);
                      const toggle = () => setSizes(prev =>
                        prev.includes(ml) ? prev.filter(s => s !== ml) : [...prev, ml]
                      );
                      return (
                        <button
                          key={ml}
                          type="button"
                          onClick={toggle}
                          style={{
                            flex: '1',
                            padding: '12px 8px 10px',
                            borderRadius: '12px',
                            border: active ? '2px solid #d4af5f' : '1.5px solid #e2e8f0',
                            background: active
                              ? 'linear-gradient(135deg, rgba(212,175,95,0.15), rgba(212,175,95,0.08))'
                              : '#f8fafc',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px',
                            fontFamily: "'Inter', system-ui, sans-serif",
                            position: 'relative',
                          }}
                        >
                          {/* Checkmark badge */}
                          {active && (
                            <div style={{
                              position: 'absolute', top: '6px', right: '6px',
                              width: '14px', height: '14px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, #d4af5f, #c9973a)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )}
                          {/* Bottle icon */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke={active ? '#d4af5f' : '#94a3b8'}
                            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transition: 'stroke 0.2s' }}
                          >
                            <path d="M8 3h8v2a5 5 0 015 5v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-8a5 5 0 015-5V3z" />
                            <line x1="12" y1="11" x2="12" y2="16" strokeWidth="1.5" />
                            <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" strokeWidth="1.5" />
                          </svg>
                          <span style={{
                            fontSize: '13.5px',
                            fontWeight: '700',
                            color: active ? '#b8860b' : '#64748b',
                            transition: 'color 0.2s',
                            letterSpacing: '-0.01em',
                          }}>{ml} ml</span>
                        </button>
                      );
                    })}
                  </div>
                  {sizes.length === 0 && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                      Select at least one bottle size.
                    </div>
                  )}
                </div>

                {/* ─── Size Specific Pricing ─── */}
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[...sizes].sort((a,b)=>a-b).map(size => {
                    const priceVal = pricing[size]?.price || '';
                    const origVal = pricing[size]?.originalPrice || '';
                    return (
                      <div key={size} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                           <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{size}ml Pricing</span>
                        </div>
                        <div className="pricing-grid">
                          <div className="field-group">
                            <label className="field-label" htmlFor={`price-${size}`}>Selling Price</label>
                            <div className="price-input-wrap">
                              <span className="price-symbol">₹</span>
                              <input
                                id={`price-${size}`}
                                required
                                type="number" min="0" step="0.01" 
                                value={priceVal} 
                                onChange={e => setPricing(p => ({ ...p, [size]: { ...p[size], price: e.target.value } }))} 
                                className="premium-input" placeholder="0.00" 
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <label className="field-label" htmlFor={`orig-${size}`}>Compare-at Price</label>
                            <div className="price-input-wrap">
                              <span className="price-symbol">₹</span>
                              <input
                                id={`orig-${size}`}
                                type="number" min="0" step="0.01" 
                                value={origVal} 
                                onChange={e => setPricing(p => ({ ...p, [size]: { ...p[size], originalPrice: e.target.value } }))} 
                                className="premium-input" placeholder="0.00" 
                              />
                            </div>
                          </div>
                        </div>
                        {priceVal && origVal && parseFloat(origVal) > parseFloat(priceVal) && (
                          <div style={{
                            marginTop: '12px', padding: '8px 12px',
                            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                            border: '1px solid #a7f3d0', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', gap: '6px',
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#065f46' }}>
                              {Math.round(((parseFloat(origVal) - parseFloat(priceVal)) / parseFloat(origVal)) * 100)}% discount
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (Sidebar) ─── */}
          <div className="form-sidebar" style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Publish Card */}
            <div className="form-card" style={{ animationDelay: '0.05s' }}>
              <div className="card-header">
                <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h2>Publish</h2>
                  <p>Product visibility settings</p>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>New Arrival Badge</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>Shows a &quot;New&quot; tag on this product</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNew(!isNew)}
                    className="toggle-btn"
                    id="toggle-new-arrival"
                    style={{ background: isNew ? 'linear-gradient(135deg, #d4af5f, #c9973a)' : '#e2e8f0' }}
                  >
                    <div className="toggle-knob" style={{ transform: isNew ? 'translateX(20px)' : 'translateX(0)' }} />
                  </button>
                </div>

                {/* Status display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 14px', background: isNew ? 'rgba(212,175,95,0.08)' : '#f8fafc', borderRadius: '9px', border: `1.5px solid ${isNew ? 'rgba(212,175,95,0.3)' : '#e2e8f0'}`, transition: 'all 0.25s' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isNew ? '#d4af5f' : '#94a3b8', transition: 'background 0.25s', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: isNew ? '#c9973a' : '#64748b', transition: 'color 0.25s' }}>
                    {isNew ? 'Will appear in New Arrivals' : 'Standard listing'}
                  </span>
                </div>

                {/* Save + Discard */}
                <div style={{ marginTop: '20px' }}>
                  <button type="submit" disabled={loading} className="save-btn" id="save-product-btn">
                    {loading ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2.5px solid rgba(13,13,31,0.2)', borderTopColor: '#0d0d1f', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save Product
                      </>
                    )}
                  </button>
                  <Link href="/admin/products" className="discard-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Discard changes
                  </Link>
                </div>
              </div>
            </div>

            {/* Organization Card */}
            <div className="form-card" style={{ animationDelay: '0.1s' }}>
              <div className="card-header">
                <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <div>
                  <h2>Organization</h2>
                  <p>Category, gender &amp; tags</p>
                </div>
              </div>
              <div className="card-body">
                <div className="field-group">
                  <label className="field-label" htmlFor="product-category">Category</label>
                  <select
                    id="product-category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="premium-select"
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Gender</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {GENDERS.map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`gender-pill ${gender === g ? 'gender-pill-active' : ''}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="product-tags">Occasion Tags</label>
                  <input
                    id="product-tags"
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    className="premium-input"
                    placeholder="daily, wedding, gifting"
                  />
                  <div className="field-hint">Comma-separated — used for occasion filters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
