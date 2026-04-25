'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = 'rahmani_free_attar_claimed';
const POPUP_DELAY = 8000; // 8 seconds
export const MYSTERY_ATTAR_ID = 'mystery-free-2ml';

export const MYSTERY_ATTAR_ITEM = {
  id: MYSTERY_ATTAR_ID,
  name: '🎁 Mystery Attar — FREE Gift',
  size: 2,
  price: 0,
  image: '/popup.png',
};

function FreeAttarPopupInner() {
  const [visible, setVisible] = useState(false);
  const [claimed, setClaimed] = useState(false); // hides the floating icon after claim
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingClaim, setCheckingClaim] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // 'form' | 'login-gate' — shown when user is not logged in
  const [view, setView] = useState<'form' | 'login-gate'>('form');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const { user, loading: authLoading } = useAuth();

  // Check if user already has the mystery attar in their cart
  const alreadyInCart = cart.some(item => item.id === MYSTERY_ATTAR_ID);

  useEffect(() => {
    // Wait for auth to resolve before deciding
    if (authLoading) return;

    // Already claimed — hide floating icon too
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) {
      setClaimed(true);
      return;
    }

    // If user is logged in, check their Firestore doc for prior claim
    const checkAndShow = async () => {
      if (user) {
        setCheckingClaim(true);
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists() && snap.data().freeAttarClaimed) {
            // Already claimed on this account — never show again
            localStorage.setItem(STORAGE_KEY, '1');
            setClaimed(true);
            return;
          }
        } catch {
          // Firestore error — still show the popup
        } finally {
          setCheckingClaim(false);
        }
      }

      timerRef.current = setTimeout(() => {
        setVisible(true);
      }, POPUP_DELAY);
    };

    checkAndShow();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, authLoading]);

  // When user logs in while popup is open, switch from login-gate back to form
  useEffect(() => {
    if (user && view === 'login-gate') {
      setView('form');
    }
  }, [user, view]);

  const close = () => setVisible(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Require login before claiming
    if (!user) {
      setView('login-gate');
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all fields to claim your gift.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (alreadyInCart) {
      setError('You already have the mystery attar in your cart!');
      return;
    }

    setLoading(true);
    try {
      // 1. Double-check Firestore — prevent duplicate claims per account
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().freeAttarClaimed) {
        localStorage.setItem(STORAGE_KEY, '1');
        setError('You have already claimed this offer on your account.');
        setLoading(false);
        return;
      }

      // 2. Save lead to popup_leads collection
      await addDoc(collection(db, 'popup_leads'), {
        uid: user.uid,
        email: user.email || '',
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        offer: '2ml Free Mystery Attar',
        claimedAt: serverTimestamp(),
        source: 'homepage_popup',
      });

      // 3. Mark claim on the user's own doc so it's tied to the account
      await setDoc(userRef, { freeAttarClaimed: true }, { merge: true });

      // 4. Mark in localStorage as local cache too
      localStorage.setItem(STORAGE_KEY, '1');
      setClaimed(true); // hide the floating icon immediately

      // 5. Add exactly 1 mystery attar to cart (addToCart is idempotent for existing IDs)
      if (!alreadyInCart) {
        addToCart(MYSTERY_ATTAR_ITEM);
      }

      setSuccess(true);

      // 6. Auto-close after 2.5s
      setTimeout(() => {
        setVisible(false);
      }, 2500);
    } catch (err) {
      console.error('Popup lead save error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Floating gift icon (shown when not yet claimed & popup is closed) ───
  const floatBtn = !claimed && !visible && !checkingClaim ? (
    <>
      <style>{`
        @keyframes giftGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.7), 0 4px 20px rgba(212,175,55,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(212,175,55,0), 0 4px 28px rgba(212,175,55,0.6); }
        }
        @keyframes giftFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes giftBadgePop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .frp-float-btn {
          position: fixed;
          left: 16px;
          bottom: 80px;
          z-index: 99980;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
        }
        .frp-float-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #b8902a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          animation: giftGlow 2s ease-in-out infinite, giftFloat 3s ease-in-out infinite;
          border: 2px solid rgba(255,255,255,0.6);
          transition: transform 0.2s;
        }
        .frp-float-btn:hover .frp-float-circle {
          transform: scale(1.12) translateY(-3px);
        }
        .frp-float-label {
          background: linear-gradient(135deg, #d4af37, #b8902a);
          color: #fff;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(212,175,55,0.45);
          animation: giftBadgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @media (max-width: 640px) {
          .frp-float-btn { bottom: 100px; left: 12px; }
          .frp-float-circle { width: 48px; height: 48px; font-size: 1.35rem; }
        }
      `}</style>
      <button
        className="frp-float-btn"
        onClick={() => setVisible(true)}
        aria-label="Claim your free 2ml mystery attar"
        title="Claim Free 2ml Attar!"
      >
        <div className="frp-float-circle">🎁</div>
        <span className="frp-float-label">Free Attar!</span>
      </button>
    </>
  ) : null;

  if (checkingClaim) return null;
  if (!visible) return floatBtn;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
          70% { box-shadow: 0 0 0 14px rgba(212,175,55,0); }
          100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes loginBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .frp-overlay {
          position: fixed; inset: 0;
          background: rgba(10,8,5,0.78);
          z-index: 99990;
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.3s ease forwards;
          padding: 16px;
          backdrop-filter: blur(3px);
        }
        .frp-modal {
          display: flex;
          width: min(900px, 100%);
          max-height: 90vh;
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.25);
          animation: popupSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
          position: relative;
        }
        .frp-left {
          flex: 0 0 45%;
          position: relative;
          overflow: hidden;
        }
        .frp-left img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .frp-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(10,8,5,0.25) 0%, rgba(0,0,0,0.6) 100%);
        }
        .frp-badge {
          position: absolute; top: 20px; left: 20px;
          background: linear-gradient(135deg, #d4af37, #b8902a);
          color: #fff; font-size: 0.62rem; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.25);
          box-shadow: 0 4px 14px rgba(212,175,55,0.4);
        }
        .frp-offer-tag {
          position: absolute; bottom: 24px; left: 20px; right: 20px;
          background: rgba(0,0,0,0.72); backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.3); border-radius: 12px;
          padding: 14px 16px; color: #fff;
        }
        .frp-offer-tag h3 {
          font-size: 1.1rem; font-weight: 800; margin: 0 0 4px;
          background: linear-gradient(135deg, #f4d03f, #d4af37);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; font-family: 'Playfair Display', serif;
        }
        .frp-offer-tag p { font-size: 0.75rem; color: rgba(255,255,255,0.75); margin: 0; line-height: 1.5; }

        .frp-right {
          flex: 1; padding: 36px 32px;
          display: flex; flex-direction: column;
          overflow-y: auto; background: #fff;
        }
        .frp-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: #374151; z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s;
        }
        .frp-close:hover { background: #fff; transform: scale(1.1); }

        .frp-eyebrow {
          font-size: 0.65rem; font-weight: 800; letter-spacing: 0.15em;
          text-transform: uppercase; color: #d4af37; margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .frp-eyebrow::before, .frp-eyebrow::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, #d4af37aa);
        }
        .frp-eyebrow::after { background: linear-gradient(to left, transparent, #d4af37aa); }

        .frp-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem; font-weight: 800; color: #0f172a;
          line-height: 1.2; margin: 0 0 6px;
        }
        .frp-subheading { font-size: 0.82rem; color: #64748b; margin-bottom: 24px; line-height: 1.6; }
        .frp-form { display: flex; flex-direction: column; gap: 14px; }
        .frp-input-group { display: flex; flex-direction: column; gap: 5px; }
        .frp-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #374151; }
        .frp-input {
          width: 100%; padding: 11px 14px; border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-size: 0.9rem; color: #0f172a; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; background: #f8fafc;
          box-sizing: border-box; font-family: inherit;
        }
        .frp-input:focus { border-color: #d4af37; background: #fff; box-shadow: 0 0 0 3px rgba(212,175,55,0.12); }
        .frp-phone-row { display: flex; gap: 8px; align-items: stretch; }
        .frp-country-code {
          padding: 11px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 0.9rem; color: #0f172a; background: #f1f5f9; font-weight: 600;
          white-space: nowrap; flex-shrink: 0; display: flex; align-items: center;
        }
        .frp-textarea {
          width: 100%; padding: 11px 14px; border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-size: 0.9rem; color: #0f172a; outline: none;
          resize: none; background: #f8fafc; transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit; box-sizing: border-box; min-height: 72px;
        }
        .frp-textarea:focus { border-color: #d4af37; background: #fff; box-shadow: 0 0 0 3px rgba(212,175,55,0.12); }

        .frp-cta {
          padding: 14px; border: none; border-radius: 12px;
          font-size: 0.95rem; font-weight: 800; cursor: pointer; letter-spacing: 0.03em;
          background: linear-gradient(135deg, #d4af37 0%, #b8902a 100%);
          color: #fff; margin-top: 4px; transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(212,175,55,0.35);
          animation: pulse-ring 2s infinite; font-family: inherit;
        }
        .frp-cta:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(212,175,55,0.5); }
        .frp-cta:disabled { opacity: 0.65; cursor: wait; animation: none; }

        .frp-cta-secondary {
          padding: 12px 14px; border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
          background: #f8fafc; color: #374151; transition: all 0.2s; font-family: inherit;
          margin-top: 8px;
        }
        .frp-cta-secondary:hover { border-color: #d4af37; color: #0f172a; background: #fff; }

        .frp-error {
          background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626;
          padding: 10px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
        }
        .frp-disclaimer { font-size: 0.67rem; color: #94a3b8; text-align: center; margin-top: 8px; line-height: 1.55; }

        /* Login gate */
        .frp-login-gate {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; flex: 1; gap: 16px; padding: 10px 0;
        }
        .frp-login-icon {
          font-size: 3rem;
          animation: loginBounce 1.6s ease-in-out infinite;
        }
        .frp-login-title { font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 800; color: #0f172a; margin: 0; }
        .frp-login-desc { font-size: 0.82rem; color: #64748b; line-height: 1.6; margin: 0; max-width: 260px; }
        .frp-login-note {
          background: #fef9c3; border: 1px solid #fde68a; color: #92400e;
          padding: 10px 16px; border-radius: 10px; font-size: 0.78rem; font-weight: 600;
          width: 100%; box-sizing: border-box; text-align: center;
        }

        /* Success */
        .frp-success-screen {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; flex: 1; gap: 14px; padding: 20px 0;
        }
        .frp-success-icon { font-size: 3.5rem; animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .frp-success-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; }
        .frp-success-desc { font-size: 0.83rem; color: #64748b; line-height: 1.6; margin: 0; max-width: 280px; }
        .frp-cart-badge {
          background: linear-gradient(135deg, #d4af37, #b8902a);
          color: #fff; padding: 10px 20px; border-radius: 20px;
          font-size: 0.8rem; font-weight: 800; letter-spacing: 0.04em;
          box-shadow: 0 4px 14px rgba(212,175,55,0.35);
        }

        @media (max-width: 640px) {
          .frp-left { display: none; }
          .frp-right { padding: 28px 22px; }
          .frp-heading { font-size: 1.35rem; }
        }
      `}</style>

      <div className="frp-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="frp-modal">

          {/* Close button */}
          <button className="frp-close" onClick={close} aria-label="Close popup">✕</button>

          {/* Left — Image panel */}
          <div className="frp-left">
            <img src="/popup.png" alt="Rahmani Perfumery — Free Mystery Attar Offer" />
            <div className="frp-left-overlay" />
            <div className="frp-badge">✨ Exclusive Offer</div>
            <div className="frp-offer-tag">
              <h3>2ml Mystery Attar — FREE!</h3>
              <p>Added to your cart with every order. No minimum value needed.</p>
            </div>
          </div>

          {/* Right — Content panel */}
          <div className="frp-right">

            {/* ─── SUCCESS ─── */}
            {success ? (
              <div className="frp-success-screen">
                <div className="frp-success-icon">🎁</div>
                <p className="frp-success-title">Offer Claimed!</p>
                <p className="frp-success-desc">
                  Your <strong>2ml Mystery Attar</strong> has been added to your cart as a FREE gift — applied with your next order.
                </p>
                <div className="frp-cart-badge">🛒 Mystery Attar Added to Cart</div>
                <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: 0 }}>You&apos;re all set! Happy shopping.</p>
              </div>

            /* ─── LOGIN GATE ─── */
            ) : view === 'login-gate' ? (
              <div className="frp-login-gate">
                <div className="frp-login-icon">🔐</div>
                <p className="frp-login-title">Login to Claim</p>
                <p className="frp-login-desc">
                  To receive your <strong>free 2ml mystery attar</strong>, you need to be logged in. This ensures the gift is reserved for you and only you.
                </p>
                <div className="frp-login-note">
                  🎁 One free attar per account — limited offer!
                </div>
                <button
                  className="frp-cta"
                  style={{ width: '100%' }}
                  onClick={() => {
                    close();
                    router.push('/auth?from=popup&offer=free-attar');
                  }}
                >
                  🔑 Login / Sign Up to Claim
                </button>
                <button className="frp-cta-secondary" style={{ width: '100%' }} onClick={() => setView('form')}>
                  ← Back
                </button>
              </div>

            /* ─── FORM ─── */
            ) : (
              <>
                <div className="frp-eyebrow">Limited Time Gift</div>
                <h2 className="frp-heading">Get a FREE 2ml<br />Mystery Attar 🎁</h2>
                <p className="frp-subheading">
                  {user
                    ? <>Logged in as <strong>{user.displayName || user.email}</strong>. Fill in your details to claim.</>
                    : <>Share your details below. You&apos;ll need to <strong>log in</strong> to finalise your claim.</>
                  }
                </p>

                <form className="frp-form" onSubmit={handleSubmit}>
                  <div className="frp-input-group">
                    <label className="frp-label" htmlFor="frp-name">Your Name</label>
                    <input
                      id="frp-name"
                      className="frp-input"
                      type="text"
                      placeholder="e.g. Aryan Khan"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      maxLength={60}
                    />
                  </div>

                  <div className="frp-input-group">
                    <label className="frp-label" htmlFor="frp-phone">Mobile Number</label>
                    <div className="frp-phone-row">
                      <div className="frp-country-code">🇮🇳 +91</div>
                      <input
                        id="frp-phone"
                        className="frp-input"
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className="frp-input-group">
                    <label className="frp-label" htmlFor="frp-address">Delivery Address</label>
                    <textarea
                      id="frp-address"
                      className="frp-textarea"
                      placeholder="House/Flat no., Street, City, State — Pincode"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      maxLength={250}
                    />
                  </div>

                  {error && <div className="frp-error">⚠️ {error}</div>}

                  <button
                    id="frp-claim-btn"
                    type="submit"
                    className="frp-cta"
                    disabled={loading}
                  >
                    {loading
                      ? '⏳ Claiming...'
                      : user
                        ? '✨ Claim My Free 2ml Attar'
                        : '✨ Continue to Claim'}
                  </button>
                </form>

                <p className="frp-disclaimer">
                  By claiming, you agree to be contacted via WhatsApp/SMS for order updates.
                  {!user && <> You will be asked to <strong>login</strong> to confirm your claim. One per account.</>}
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// Export as a client-only component to prevent SSR hydration issues
export default dynamic(() => Promise.resolve(FreeAttarPopupInner), { ssr: false });
