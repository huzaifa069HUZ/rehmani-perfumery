'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import Image from 'next/image';

const CATEGORIES = ['All Attars', 'Oud', 'Musk', 'Floral', 'Citrus'];
const GENDERS = ['Unisex', 'Him', 'Her'];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
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
          setPrice(data.price?.toString() || '');
          setOriginalPrice(data.originalPrice?.toString() || '');
          setCategory(data.category || 'oud');
          setGender(data.gender || 'Unisex');
          setDescription(data.description || '');
          setNotes(data.notes || '');
          setImages(data.images || []);
          setTagsInput((data.occasions || []).join(', '));
          setIsNew(!!data.isNew);
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
      const parsedPrice = parseFloat(price);
      const parsedOriginal = parseFloat(originalPrice) || parsedPrice;
      const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await updateDoc(doc(db, 'products', id), {
        name, category: category.toLowerCase(), gender, description, notes,
        price: parsedPrice, originalPrice: parsedOriginal, isNew,
        images, occasions: parsedTags, updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-[10px] text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/10 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-7 h-7 border-[2.5px] border-gray-200 border-t-[#8B7355] rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">{name || 'Edit product'}</h1>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Product updated! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800">Product details</h2>
            <div>
              <label className={labelClass}>Title</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Product name" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Product description..." />
            </div>
            <div>
              <label className={labelClass}>Fragrance Notes</label>
              <input required type="text" value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} placeholder="Top: Bergamot · Heart: Rose · Base: Oud" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800">Media</h2>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden group bg-gray-50">
                    <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <CloudinaryUpload onUploadSuccess={handleImageUploadSuccess} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)}
                    className={`${inputClass} pl-7`} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Compare-at price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input type="number" min="0" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                    className={`${inputClass} pl-7`} placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800">Status</h2>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">New arrival</span>
              <button type="button" onClick={() => setIsNew(!isNew)}
                className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${isNew ? 'bg-[#8B7355]' : 'bg-gray-200'}`}>
                <div className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${isNew ? 'translate-x-[18px]' : ''}`} />
              </button>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800">Organization</h2>
            <div>
              <label className={labelClass}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={`${inputClass} appearance-none`}>
                {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className={`${inputClass} appearance-none`}>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tags</label>
              <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className={inputClass} placeholder="daily, party, gift" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#1a1a2e] text-white py-[11px] rounded-lg text-sm font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
