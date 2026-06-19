'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2, ChevronRight, CreditCard, Wallet, Banknote,
  ShieldCheck, Truck, AlertCircle, Lock, Package, Trash2, Tag,
  Plus, Minus, ArrowLeft, Zap
} from 'lucide-react';
import { MYSTERY_ATTAR_ID } from '@/components/FreeAttarPopup';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

type Step = 'details' | 'payment' | 'success';
type PaymentMethod = 'cod' | 'razorpay' | 'upi';

export default function CheckoutForm() {
  const { cart, totalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  // Step state
  const [step, setStep] = useState<Step>('details');

  // Form state
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [email, setEmail]     = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity]       = useState('');
  const [state, setState]     = useState('');
  const [house, setHouse]     = useState('');
  const [area, setArea]       = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Payment
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cod');

  // Pincode
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Order
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Snapshot totals BEFORE clearing cart (fixes the ₹0 bug)
  const [confirmedName, setConfirmedName]   = useState('');
  const [confirmedPhone, setConfirmedPhone] = useState('');
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [confirmedItems, setConfirmedItems] = useState(0);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.displayName) setName(user.displayName);
  }, [user]);

  useEffect(() => {
    if (step === 'success') {
      const msg = `Hello Rahmani Perfumery, I have placed an order!\n\nOrder ID: ${confirmedOrderId}\nName: ${confirmedName}\nAmount: ₹${confirmedTotal}\nItems: ${confirmedItems}\n\nPlease confirm my order.`;
      const encodedMsg = encodeURIComponent(msg);
      const timer = setTimeout(() => {
        window.location.href = `https://wa.me/918540047972?text=${encodedMsg}`;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, confirmedOrderId, confirmedName, confirmedTotal, confirmedItems]);

  const shippingFee  = totalPrice >= 999 ? 0 : 90;
  const finalTotal   = totalPrice + shippingFee;

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      setIsLoadingPincode(true);
      setPincodeError('');
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data?.[0]?.Status === 'Success') {
          const p = data[0].PostOffice[0];
          setCity(p.District);
          setState(p.State);
        } else {
          setPincodeError('Invalid pincode. Please verify.');
          setCity(''); setState('');
        }
      } catch {
        setPincodeError('Could not fetch. Enter manually.');
      } finally {
        setIsLoadingPincode(false);
      }
    } else {
      setCity(''); setState(''); setPincodeError('');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    // Snapshot before clearing
    setConfirmedName(name);
    setConfirmedPhone(phone);
    setConfirmedTotal(finalTotal);
    setConfirmedItems(cart.reduce((s, i) => s + i.quantity, 0));

    // Generate custom order ID (e.g., RP0133X4)
    const generateOrderId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let id = 'RP';
      for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    };
    const orderId = generateOrderId();

    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        orderId: orderId, // Store custom order ID in the document
        customerInfo: { name, email, phone },
        shippingAddress: { pincode, city, state, house, area },
        items: cart,
        totalPrice,
        shippingFee,
        finalTotal,
        paymentMethod: payMethod === 'cod' ? 'COD' : 'Razorpay (Pending)',
        status: 'Pending',
        createdAt: serverTimestamp(),
        userId: user?.uid || 'guest',
      });
      
      setConfirmedOrderId(orderId);

      // Trigger Email Notification (non-blocking for UI if we don't await, but let's fire and forget)
      fetch('/api/email/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerInfo: { name, email, phone },
          shippingAddress: { pincode, city, state, house, area },
          items: cart,
          finalTotal,
          shippingFee,
          paymentMethod: payMethod === 'cod' ? 'COD' : 'Razorpay',
        }),
      }).catch(err => console.error("Email API failed:", err));

      clearCart();
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Order error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Shared Order Summary Panel ── */
  const renderOrderSummary = () => (
    <aside className="ck-summary">
      <div className="ck-sum-sticky">
        <h3 className="ck-sum-heading">Order Summary</h3>

        <div className="ck-items-list">
          {cart.map((item, i) => (
            <div key={i} className="ck-item">
              <div className="ck-thumb-wrap">
                <div className="ck-thumb">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="ck-thumb-img" />
                </div>
                <span className="ck-badge">×{item.quantity}</span>
              </div>
              <div className="ck-item-meta">
                <p className="ck-item-name">{item.name}</p>
                <p className="ck-item-size">{item.size === 1 ? '1 Box' : `${item.size}ml`}</p>
                {item.id !== MYSTERY_ATTAR_ID ? (
                  <div className="ck-qty">
                    <button type="button" className="ck-qbtn" onClick={() => updateQuantity(i, -1)}><Minus size={10} strokeWidth={3}/></button>
                    <span className="ck-qval">{item.quantity}</span>
                    <button type="button" className="ck-qbtn" onClick={() => updateQuantity(i, 1)}><Plus size={10} strokeWidth={3}/></button>
                  </div>
                ) : <span className="ck-free-tag">🎁 Free Gift</span>}
              </div>
              <div className="ck-item-end">
                <span className="ck-item-price">
                  {item.id === MYSTERY_ATTAR_ID
                    ? <span className="ck-free-price">FREE</span>
                    : `₹${item.price * item.quantity}`}
                </span>
                {item.id !== MYSTERY_ATTAR_ID && step === 'details' && (
                  <button type="button" className="ck-del" onClick={() => removeItem(i)}><Trash2 size={13} strokeWidth={1.8}/></button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="ck-sep" />

        {/* Promo */}
        {step === 'details' && (
          <>
            <div className="ck-promo">
              <p className="ck-promo-label"><Tag size={12}/>PROMO CODE</p>
              <div className="ck-promo-row">
                <input type="text" value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  className="ck-promo-inp" placeholder="Enter code" />
                <button type="button" className="ck-promo-btn"
                  onClick={() => promoCode && setPromoApplied(true)}>Apply</button>
              </div>
              {promoApplied && <p className="ck-promo-ok">✓ Promo applied!</p>}
            </div>
            <div className="ck-sep" />
          </>
        )}

        <div className="ck-totals">
          <div className="ck-tot-row"><span>Subtotal</span><span>₹{totalPrice}</span></div>
          <div className="ck-tot-row">
            <span>Shipping</span>
            <span className={shippingFee === 0 ? 'ck-free-price' : ''}>
              {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
            </span>
          </div>
        </div>

        <div className="ck-sep" />

        <div className="ck-grand">
          <span className="ck-grand-lbl">Total</span>
          <span className="ck-grand-val">₹{finalTotal}</span>
        </div>

        {shippingFee > 0 && (
          <p className="ck-ship-hint">Add ₹{999 - totalPrice} more for free shipping</p>
        )}

        <div className="ck-trust-row">
          <div className="ck-trust-pill"><ShieldCheck size={11}/>Secure</div>
          <div className="ck-trust-pill"><Truck size={11}/>Pan-India</div>
          <div className="ck-trust-pill"><Lock size={11}/>Encrypted</div>
        </div>
        <p className="ck-trust-txt">Your payment info is processed securely. We do not store credit card details nor have access to your credit card information.</p>
      </div>
    </aside>
  );

  /* ── Empty Cart ── */
  if (cart.length === 0 && step !== 'success') {
    return (
      <>
        <style>{CSS}</style>
        <div className="ck-empty">
          <div className="ck-empty-icon"><Package size={38} strokeWidth={1.2}/></div>
          <h2>Your bag is empty</h2>
          <p>Discover our curated collection of premium fragrances.</p>
          <Link href="/store" className="ck-cta-btn" style={{ textDecoration: 'none' }}>Explore Collection</Link>
        </div>
      </>
    );
  }

  /* ── Order Success ── */
  if (step === 'success') {
    return (
      <>
        <style>{CSS}</style>
        <div className="ck-success-page">
          <div className="ck-success-card">
            <div className="ck-check-ring">
              <CheckCircle2 size={34} strokeWidth={1.5}/>
            </div>
            <p className="ck-success-eyebrow">ORDER CONFIRMED</p>
            <h2 className="ck-success-heading">Thank you, {confirmedName || name}!</h2>
            <p className="ck-success-desc">Your order has been placed successfully.</p>

            <div className="ck-cod-notice">
              <AlertCircle size={15} className="ck-notice-ico"/>
              <div>
                <strong>WhatsApp Order Confirmation</strong>
                <p>You will be redirected to WhatsApp in a few seconds to confirm your order. If nothing happens, <a href={`https://wa.me/918540047972?text=Hello%20Rahmani%20Perfumery,%20I%20have%20placed%20an%20order!%0A%0AOrder%20ID:%20${confirmedOrderId}%0AAmount:%20%E2%82%B9${confirmedTotal}%0A%0APlease%20confirm%20my%20order.`} style={{ textDecoration: 'underline', color: '#B45309' }}>click here</a>.</p>
              </div>
            </div>

            <div className="ck-success-rows">
              <div className="ck-success-row">
                <span>Order ID</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{confirmedOrderId}</span>
              </div>
              <div className="ck-success-row">
                <span>Customer</span>
                <span>{confirmedName || '—'}</span>
              </div>
              <div className="ck-success-row">
                <span>Phone</span>
                <span>{confirmedPhone || '—'}</span>
              </div>
              <div className="ck-success-row">
                <span>Items</span>
                <span>{confirmedItems} item{confirmedItems !== 1 ? 's' : ''}</span>
              </div>
              <div className="ck-success-row">
                <span>Payment</span>
                <span>Cash on Delivery</span>
              </div>
              <div className="ck-success-row ck-success-row-total">
                <span>Amount</span>
                <span>₹{confirmedTotal}</span>
              </div>
            </div>

            <Link href="/store" className="ck-cta-btn" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', textDecoration: 'none' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      {/* ── Header ── */}
      <header className="ck-header">
        <Link href="/" className="ck-logo">
          <span className="ck-logo-brand">RAHMANI</span>
          <span className="ck-logo-tag">PERFUMERY</span>
        </Link>
        <nav className="ck-breadcrumb">
          <span className={`ck-bc ${step === 'details' ? 'ck-bc-active' : 'ck-bc-done'}`}>Details</span>
          <ChevronRight size={12} className="ck-bc-sep"/>
          <span className={`ck-bc ${step === 'payment' ? 'ck-bc-active' : 'ck-bc-dim'}`}>Payment</span>
          <ChevronRight size={12} className="ck-bc-sep"/>
          <span className={`ck-bc ck-bc-dim`}>Confirmed</span>
        </nav>
        <div className="ck-lock-badge"><Lock size={10}/><span>Secure</span></div>
      </header>

      {/* ── Step Indicator ── */}
      <div className="ck-step-bar">
        <div className={`ck-step-dot ${step !== 'details' ? 'ck-sdot-done' : 'ck-sdot-active'}`}>
          {step !== 'details' ? <CheckCircle2 size={14}/> : '1'}
        </div>
        <div className={`ck-step-line ${step !== 'details' ? 'ck-sline-done' : ''}`}/>
        <div className={`ck-step-dot ${step === 'payment' ? 'ck-sdot-active' : 'ck-sdot-dim'}`}>
          {'2'}
        </div>
        <div className={`ck-step-line`}/>
        <div className={`ck-step-dot ck-sdot-dim`}>
          {'3'}
        </div>
      </div>

      <div className="ck-body">
        <div className="ck-container">

          {/* ═══════ STEP 1 — DETAILS ═══════ */}
          {step === 'details' && (
            <form className="ck-left" onSubmit={handleDetailsSubmit}>

              <div className="ck-card ck-card-in" style={{ '--d': '0ms' } as React.CSSProperties}>
                <div className="ck-card-head">
                  <span className="ck-num">01</span>
                  <h2 className="ck-section-title">Contact Information</h2>
                </div>
                <div className="ck-grid">
                  <div className="ck-field ck-field-full">
                    <label htmlFor="ck-email" className="ck-lbl">Email Address</label>
                    <input id="ck-email" type="email" required value={email}
                      onChange={e => setEmail(e.target.value)} className="ck-inp" placeholder="you@example.com"/>
                  </div>
                  <div className="ck-field">
                    <label htmlFor="ck-name" className="ck-lbl">Full Name</label>
                    <input id="ck-name" type="text" required value={name}
                      onChange={e => setName(e.target.value)} className="ck-inp" placeholder="Your full name"/>
                  </div>
                  <div className="ck-field">
                    <label htmlFor="ck-phone" className="ck-lbl">Phone Number</label>
                    <input id="ck-phone" type="tel" required value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      className="ck-inp" placeholder="+91 XXXXXXXXXX"/>
                  </div>
                </div>
              </div>

              <div className="ck-card ck-card-in" style={{ '--d': '80ms' } as React.CSSProperties}>
                <div className="ck-card-head">
                  <span className="ck-num">02</span>
                  <h2 className="ck-section-title">Delivery Address</h2>
                </div>
                <div className="ck-grid">
                  <div className="ck-field">
                    <label htmlFor="ck-pin" className="ck-lbl ck-lbl-flex">
                      Pincode
                      {isLoadingPincode && <span className="ck-detecting">Detecting…</span>}
                    </label>
                    <input id="ck-pin" type="text" required maxLength={6} value={pincode}
                      onChange={handlePincodeChange}
                      className={`ck-inp${pincodeError ? ' ck-inp-err' : ''}`} placeholder="6-digit PIN"/>
                    {pincodeError && <p className="ck-ferr">{pincodeError}</p>}
                  </div>
                  <div className="ck-field">
                    <label htmlFor="ck-city" className="ck-lbl">City / District</label>
                    <input id="ck-city" type="text" required value={city}
                      onChange={e => setCity(e.target.value)} className="ck-inp ck-inp-auto" placeholder="Auto-filled"/>
                  </div>
                  <div className="ck-field">
                    <label htmlFor="ck-state" className="ck-lbl">State</label>
                    <input id="ck-state" type="text" required value={state}
                      onChange={e => setState(e.target.value)} className="ck-inp ck-inp-auto" placeholder="Auto-filled"/>
                  </div>
                  <div className="ck-field">
                    <label htmlFor="ck-house" className="ck-lbl">House / Flat / Office No.</label>
                    <input id="ck-house" type="text" required value={house}
                      onChange={e => setHouse(e.target.value)} className="ck-inp" placeholder="e.g. Flat 4B"/>
                  </div>
                  <div className="ck-field ck-field-full">
                    <label htmlFor="ck-area" className="ck-lbl">Road / Area / Colony</label>
                    <input id="ck-area" type="text" required value={area}
                      onChange={e => setArea(e.target.value)} className="ck-inp" placeholder="e.g. MG Road, near Gandhi Chowk"/>
                  </div>
                </div>
              </div>

              {/* Mobile sticky CTA */}
              <div className="ck-mob-bar">
                <div className="ck-mob-total">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
                <button type="submit" className="ck-cta-btn ck-mob-cta-btn">
                  Continue to Payment <ChevronRight size={14}/>
                </button>
              </div>

              {/* Desktop CTA inside form col */}
              <button type="submit" className="ck-cta-btn ck-desk-next">
                Continue to Payment <ChevronRight size={14}/>
              </button>
            </form>
          )}

          {/* ═══════ STEP 2 — PAYMENT ═══════ */}
          {step === 'payment' && (
            <div className="ck-left">
              <div className="ck-card ck-card-in" style={{ '--d': '0ms' } as React.CSSProperties}>
                <div className="ck-card-head">
                  <span className="ck-num">02</span>
                  <h2 className="ck-section-title">Payment Method</h2>
                </div>

                {/* Razorpay — disabled / coming soon */}
                <div className="ck-pay-row ck-pay-disabled" aria-disabled="true">
                  <div className="ck-pay-radio-wrap">
                    <div className="ck-radio ck-radio-off"/>
                  </div>
                  <div className="ck-pay-body">
                    <div className="ck-pay-top">
                      <span className="ck-pay-name">Pay via Razorpay</span>
                      <div className="ck-card-chips">
                        <span className="ck-chip">VISA</span>
                        <span className="ck-chip">MC</span>
                        <span className="ck-chip">UPI</span>
                      </div>
                    </div>
                    <span className="ck-pay-sub">Credit Card, Debit Card, UPI, NetBanking — Coming Soon</span>
                    <span className="ck-coming-badge"><Zap size={10}/>Coming Soon</span>
                  </div>
                </div>

                {/* UPI — disabled */}
                <div className="ck-pay-row ck-pay-disabled" aria-disabled="true">
                  <div className="ck-pay-radio-wrap">
                    <div className="ck-radio ck-radio-off"/>
                  </div>
                  <div className="ck-pay-body">
                    <div className="ck-pay-top">
                      <span className="ck-pay-name">UPI</span>
                      <Wallet size={18} className="ck-pay-ico-right"/>
                    </div>
                    <span className="ck-pay-sub">Google Pay, PhonePe, Paytm — Coming Soon</span>
                  </div>
                </div>

                {/* COD — ACTIVE */}
                <div
                  className={`ck-pay-row ck-pay-selectable ${payMethod === 'cod' ? 'ck-pay-active' : ''}`}
                  onClick={() => setPayMethod('cod')}
                  role="radio" aria-checked={payMethod === 'cod'}
                >
                  <div className="ck-pay-radio-wrap">
                    <div className={`ck-radio ${payMethod === 'cod' ? 'ck-radio-on' : 'ck-radio-off'}`}/>
                  </div>
                  <div className="ck-pay-body">
                    <div className="ck-pay-top">
                      <span className="ck-pay-name">WHATSAPP ORDER</span>
                      <Truck size={18} className={`ck-pay-ico-right ${payMethod === 'cod' ? 'ck-ico-active' : ''}`}/>
                    </div>
                    <span className="ck-pay-sub">confirm your order through our official whatsapp</span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="ck-pay-actions">
                  <button type="button" className="ck-back-btn" onClick={() => setStep('details')}>
                    <ArrowLeft size={15}/> Back
                  </button>
                  <button type="button" className="ck-pay-btn" disabled={isSubmitting} onClick={handlePlaceOrder}>
                    {isSubmitting
                      ? <span className="ck-spinner"/>
                      : <><Lock size={13}/> Pay ₹{finalTotal}</>}
                  </button>
                </div>
              </div>

              {/* Mobile sticky */}
              <div className="ck-mob-bar">
                <button type="button" className="ck-back-mob" onClick={() => setStep('details')}>
                  <ArrowLeft size={14}/>
                </button>
                <button type="button" className="ck-pay-btn ck-mob-pay-btn" disabled={isSubmitting} onClick={handlePlaceOrder}>
                  {isSubmitting ? <span className="ck-spinner"/> : <><Lock size={13}/> Pay ₹{finalTotal}</>}
                </button>
              </div>
            </div>
          )}

          {renderOrderSummary()}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   CSS — Two-Step Checkout   |   Inter + System-UI
   Rose-red accents · Gradient cards · Micro animations
══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --ck-bg:       #F4F1ED;
  --ck-surface:  #FFFFFF;
  --ck-ink:      #1C1917;
  --ck-ink2:     #44403C;
  --ck-muted:    #78716C;
  --ck-border:   #E7E3DE;
  --ck-gold:     #92400E;
  --ck-rose:     #E11D48;
  --ck-rose-lt:  #FFF1F4;
  --ck-rose-mid: #FFE4E8;
  --ck-green:    #065F46;
  --ck-green-lt: #ECFDF5;
  --ck-pay-green:#16A34A;
  --ck-err:      #DC2626;
  --ck-shadow:   0 1px 3px rgba(0,0,0,0.05),0 4px 14px rgba(0,0,0,0.05);
  --ck-shadow-md:0 2px 8px rgba(0,0,0,0.07),0 8px 28px rgba(0,0,0,0.07);
  --ck-r:        14px;
  --ck-r-sm:     9px;
  --ck-tr:       180ms cubic-bezier(.4,0,.2,1);
}

.ck-body,.ck-header,.ck-empty,.ck-success-page,
.ck-step-bar,
.ck-body *,.ck-header *,.ck-empty *,.ck-success-page *,.ck-step-bar * {
  box-sizing:border-box;
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  -webkit-font-smoothing:antialiased;
}

/* ── BG ── */
.ck-body { background:var(--ck-bg); min-height:calc(100vh - 62px); }

/* ── CONTAINER ── */
.ck-container {
  max-width:1100px; margin:0 auto;
  padding:clamp(1.25rem,3vw,2.5rem) clamp(1rem,3vw,2rem);
  display:grid;
  grid-template-columns:1fr 360px;
  gap:1.5rem;
  align-items:start;
}
@media(max-width:900px){
  .ck-container{grid-template-columns:1fr;gap:0;padding:0;}
}

/* ── HEADER ── */
.ck-header {
  position:sticky;top:0;z-index:100;
  background:rgba(244,241,237,.95);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--ck-border);
  height:58px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(1rem,4vw,2.5rem);
}
.ck-logo{text-decoration:none;display:flex;flex-direction:column;line-height:1;}
.ck-logo-brand{font-family:system-ui;font-size:.95rem;font-weight:800;letter-spacing:.18em;color:var(--ck-ink);}
.ck-logo-tag{font-size:.5rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--ck-gold);}
.ck-breadcrumb{display:flex;align-items:center;gap:4px;}
.ck-bc{font-size:.68rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;}
.ck-bc-done{color:var(--ck-gold);}
.ck-bc-active{color:var(--ck-ink);}
.ck-bc-dim{color:var(--ck-muted);}
.ck-bc-sep{color:var(--ck-border);flex-shrink:0;}
.ck-lock-badge{
  display:flex;align-items:center;gap:4px;
  font-size:.64rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  color:var(--ck-muted);background:var(--ck-rose-lt);
  border:1px solid var(--ck-rose-mid);
  padding:4px 10px;border-radius:20px;
}
.ck-lock-badge svg{color:var(--ck-rose);}
@media(max-width:520px){.ck-breadcrumb{display:none;}}

/* ── STEP BAR ── */
.ck-step-bar{
  display:flex;align-items:center;justify-content:center;
  gap:0;padding:1rem 0 0;
  max-width:340px;margin:0 auto;
}
.ck-step-dot{
  width:30px;height:30px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:.78rem;font-weight:800;
  transition:all var(--ck-tr);flex-shrink:0;
}
.ck-sdot-active{background:var(--ck-rose);color:#fff;box-shadow:0 0 0 4px rgba(225,29,72,.15);}
.ck-sdot-done{background:var(--ck-green);color:#fff;}
.ck-sdot-dim{background:var(--ck-border);color:var(--ck-muted);}
.ck-step-line{flex:1;height:2px;background:var(--ck-border);margin:0 6px;transition:background var(--ck-tr);}
.ck-sline-done{background:var(--ck-green);}

/* ── LEFT COLUMN ── */
.ck-left{display:flex;flex-direction:column;gap:1rem;}
@media(max-width:900px){.ck-left{padding:1.25rem 1rem 0;}}

/* ── CARD ── */
.ck-card{
  background:linear-gradient(145deg,#FFFFFF 0%,#FDFCFA 100%);
  border:1px solid var(--ck-border);
  border-radius:var(--ck-r);
  padding:1.6rem 1.75rem 1.8rem;
  box-shadow:var(--ck-shadow);
  position:relative;overflow:hidden;
  transition:box-shadow var(--ck-tr),border-color var(--ck-tr);
}
.ck-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--ck-rose) 0%,#FB7185 50%,#F59E0B 100%);
  opacity:0;transition:opacity var(--ck-tr);
}
.ck-card:focus-within::before{opacity:1;}
.ck-card:focus-within{box-shadow:var(--ck-shadow-md);border-color:#FBCFE8;}
.ck-card-in{animation:ck-up 400ms cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0ms);}
@keyframes ck-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

.ck-card-head{
  display:flex;align-items:center;gap:.75rem;
  margin-bottom:1.4rem;padding-bottom:.85rem;
  border-bottom:1px solid var(--ck-border);
}
.ck-num{font-family:system-ui;font-size:1.3rem;font-weight:800;color:var(--ck-rose);line-height:1;min-width:26px;}
.ck-section-title{font-family:system-ui;font-size:1rem;font-weight:700;color:var(--ck-ink);margin:0;}

/* ── GRID / FIELDS ── */
.ck-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
@media(max-width:520px){.ck-grid{grid-template-columns:1fr;}}
.ck-field{display:flex;flex-direction:column;gap:.38rem;}
.ck-field-full{grid-column:1/-1;}
.ck-lbl{font-size:.67rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ck-ink2);}
.ck-lbl-flex{display:flex;align-items:center;justify-content:space-between;}
.ck-detecting{font-size:.62rem;font-weight:600;color:var(--ck-rose);text-transform:none;animation:ck-pulse 1s ease-in-out infinite;}
.ck-inp{
  height:44px;width:100%;padding:0 .875rem;
  background:#FAFAF8;border:1.5px solid var(--ck-border);
  border-radius:var(--ck-r-sm);
  font-size:.875rem;font-weight:500;color:var(--ck-ink);outline:none;
  transition:border-color var(--ck-tr),box-shadow var(--ck-tr),background var(--ck-tr),transform 100ms;
}
.ck-inp::placeholder{color:#C8C4BF;font-weight:400;}
.ck-inp:focus{border-color:var(--ck-rose);box-shadow:0 0 0 3px rgba(225,29,72,.1);background:#fff;transform:translateY(-1px);}
.ck-inp-auto{background:#F6F3EF;}
.ck-inp-auto:focus{transform:none;}
.ck-inp-err{border-color:var(--ck-err);}
.ck-inp-err:focus{box-shadow:0 0 0 3px rgba(220,38,38,.1);}
.ck-ferr{font-size:.66rem;color:var(--ck-err);font-weight:600;margin:1px 0 0;}

/* ── PAYMENT ROWS ── */
.ck-pay-row{
  display:flex;align-items:flex-start;gap:.9rem;
  padding:1rem 1.1rem;
  border:1.5px solid var(--ck-border);
  border-radius:var(--ck-r-sm);
  margin-bottom:.6rem;
  transition:all var(--ck-tr);
  background:var(--ck-surface);
}
.ck-pay-selectable{cursor:pointer;}
.ck-pay-selectable:hover{border-color:#FBCFE8;background:var(--ck-rose-lt);}
.ck-pay-disabled{opacity:.42;cursor:not-allowed;filter:grayscale(.4);}
.ck-pay-active{
  border-color:var(--ck-rose)!important;
  background:var(--ck-rose-lt)!important;
  box-shadow:0 0 0 3px rgba(225,29,72,.1);
}
.ck-pay-radio-wrap{padding-top:2px;flex-shrink:0;}
.ck-radio{width:18px;height:18px;border-radius:50%;flex-shrink:0;transition:all var(--ck-tr);}
.ck-radio-off{border:2px solid var(--ck-border);}
.ck-radio-on{border:5px solid var(--ck-rose);background:#fff;box-shadow:0 0 0 2px rgba(225,29,72,.15);}
.ck-pay-body{flex:1;}
.ck-pay-top{display:flex;align-items:center;justify-content:space-between;gap:.5rem;}
.ck-pay-name{font-size:.88rem;font-weight:700;color:var(--ck-ink);}
.ck-pay-sub{display:block;font-size:.7rem;color:var(--ck-muted);margin-top:3px;}
.ck-pay-ico-right{color:var(--ck-muted);}
.ck-ico-active{color:var(--ck-rose);}
.ck-card-chips{display:flex;gap:4px;}
.ck-chip{
  font-size:.6rem;font-weight:800;letter-spacing:.04em;
  background:#F1F1F1;color:var(--ck-ink2);
  padding:2px 6px;border-radius:4px;border:1px solid var(--ck-border);
}
.ck-coming-badge{
  display:inline-flex;align-items:center;gap:3px;
  font-size:.6rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  background:var(--ck-rose-lt);color:var(--ck-rose);
  border:1px solid var(--ck-rose-mid);
  padding:2px 7px;border-radius:20px;margin-top:5px;
}

/* ── PAYMENT ACTIONS ── */
.ck-pay-actions{
  display:flex;align-items:center;gap:.75rem;
  margin-top:1.25rem;padding-top:1.25rem;
  border-top:1px solid var(--ck-border);
}
.ck-back-btn{
  display:flex;align-items:center;gap:5px;
  background:none;border:1.5px solid var(--ck-border);
  border-radius:var(--ck-r-sm);
  height:48px;padding:0 1.1rem;
  font-size:.8rem;font-weight:700;color:var(--ck-ink2);
  cursor:pointer;transition:all var(--ck-tr);white-space:nowrap;
}
.ck-back-btn:hover{border-color:var(--ck-rose);color:var(--ck-rose);}
.ck-pay-btn{
  flex:1;height:48px;
  display:flex;align-items:center;justify-content:center;gap:6px;
  background:linear-gradient(135deg,#15803D 0%,#16A34A 100%);
  color:#fff;border:none;border-radius:var(--ck-r-sm);
  font-family:system-ui;font-size:.88rem;font-weight:800;
  letter-spacing:.06em;text-transform:uppercase;
  cursor:pointer;
  box-shadow:0 4px 18px rgba(22,163,74,.3);
  transition:all var(--ck-tr);
}
.ck-pay-btn:hover:not(:disabled){
  background:linear-gradient(135deg,#166534 0%,#15803D 100%);
  box-shadow:0 6px 24px rgba(22,163,74,.4);
  transform:translateY(-1px);
}
.ck-pay-btn:active:not(:disabled){transform:translateY(0);}
.ck-pay-btn:disabled{opacity:.6;cursor:not-allowed;}

/* ── CTA (Continue to Payment) ── */
.ck-cta-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  width:100%;height:50px;
  background:linear-gradient(135deg,#1C1917 0%,#292524 100%);
  color:#fff;border:none;border-radius:var(--ck-r-sm);
  font-family:system-ui;font-size:.8rem;font-weight:800;
  letter-spacing:.08em;text-transform:uppercase;
  cursor:pointer;text-decoration:none;
  box-shadow:0 4px 16px rgba(28,25,23,.22);
  transition:all var(--ck-tr);
  position:relative;overflow:hidden;
}
.ck-cta-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--ck-rose) 0%,#BE185D 100%);opacity:0;transition:opacity var(--ck-tr);}
.ck-cta-btn:hover::after{opacity:1;}
.ck-cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(225,29,72,.25);}
.ck-cta-btn > *{position:relative;z-index:1;}
.ck-desk-next{display:none;}
@media(min-width:901px){.ck-desk-next{display:inline-flex;}}

/* ── MOBILE BAR ── */
.ck-mob-bar{
  display:none;
  position:sticky;bottom:0;
  background:rgba(244,241,237,.97);
  backdrop-filter:blur(16px);
  border-top:1px solid var(--ck-border);
  padding:.75rem 1rem;gap:.75rem;align-items:center;
  z-index:50;
}
@media(max-width:900px){.ck-mob-bar{display:flex;}}
.ck-mob-total{flex:1;}
.ck-mob-total span:first-child{display:block;font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ck-muted);}
.ck-mob-total span:last-child{display:block;font-size:1.2rem;font-weight:800;color:var(--ck-rose);font-family:system-ui;}
.ck-mob-cta-btn{flex:1.8;}
.ck-mob-pay-btn{flex:1.8;}
.ck-back-mob{
  display:flex;align-items:center;justify-content:center;
  width:42px;height:42px;border-radius:50%;flex-shrink:0;
  background:var(--ck-border);border:none;cursor:pointer;
  color:var(--ck-ink2);transition:all var(--ck-tr);
}
.ck-back-mob:hover{background:var(--ck-rose-lt);color:var(--ck-rose);}

.ck-spinner{
  width:18px;height:18px;border-radius:50%;
  border:2px solid rgba(255,255,255,.3);border-top-color:#fff;
  animation:ck-spin .65s linear infinite;
}

/* ══════════════════════════════════
   ORDER SUMMARY
══════════════════════════════════ */
.ck-summary{
  background:linear-gradient(160deg,#FFFFFF 0%,#FDF9F5 60%,#FFF1F4 100%);
  border:1px solid var(--ck-border);
  border-radius:var(--ck-r);
  box-shadow:var(--ck-shadow-md);
  padding:1.6rem 1.5rem;
  animation:ck-up 400ms cubic-bezier(.16,1,.3,1) both;
  animation-delay:200ms;
}
@media(max-width:900px){
  .ck-summary{border-radius:0;border-left:none;border-right:none;border-top:none;padding:1.25rem 1rem;order:-1;box-shadow:none;animation-delay:0ms;}
}
.ck-sum-sticky{position:sticky;top:78px;}
@media(max-width:900px){.ck-sum-sticky{position:static;}}

.ck-sum-heading{
  font-family:system-ui,-apple-system,sans-serif;
  font-size:1.05rem;font-weight:800;
  color:var(--ck-ink);margin:0 0 1.25rem;
  padding-bottom:.85rem;border-bottom:1px solid var(--ck-border);
  letter-spacing:-.01em;
}

/* Items */
.ck-items-list{
  display:flex;flex-direction:column;
  max-height:340px;overflow-y:auto;
  scrollbar-width:thin;scrollbar-color:var(--ck-border) transparent;
}
.ck-items-list::-webkit-scrollbar{width:3px;}
.ck-items-list::-webkit-scrollbar-thumb{background:var(--ck-border);border-radius:4px;}

.ck-item{
  display:flex;align-items:flex-start;gap:.85rem;
  padding:.85rem 0;border-bottom:1px solid var(--ck-border);
}
.ck-item:last-child{border-bottom:none;}

/* Badge ABOVE image */
.ck-thumb-wrap{position:relative;flex-shrink:0;width:64px;padding-top:10px;}
.ck-thumb{
  position:relative;width:64px;height:64px;
  border-radius:8px;overflow:hidden;
  border:1px solid var(--ck-border);background:var(--ck-bg);
}
.ck-thumb-img{object-fit:cover;}
.ck-badge{
  position:absolute;top:0;right:-4px;
  background:var(--ck-rose);color:#fff;
  font-size:9px;font-weight:800;
  min-width:20px;height:20px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  padding:0 4px;border:2px solid #fff;z-index:2;
  box-shadow:0 1px 4px rgba(225,29,72,.35);
}

.ck-item-meta{flex:1;min-width:0;padding-top:10px;}
.ck-item-name{font-size:.82rem;font-weight:700;color:var(--ck-ink);margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ck-item-size{font-size:.68rem;color:var(--ck-muted);margin:0 0 7px;font-weight:500;}

/* Qty */
.ck-qty{display:inline-flex;align-items:center;border:1.5px solid var(--ck-border);border-radius:6px;overflow:hidden;transition:border-color var(--ck-tr),box-shadow var(--ck-tr);}
.ck-qty:hover{border-color:var(--ck-rose);box-shadow:0 0 0 2px rgba(225,29,72,.08);}
.ck-qbtn{width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:#F8F6F3;border:none;cursor:pointer;color:var(--ck-ink2);transition:background var(--ck-tr),color var(--ck-tr),transform 100ms;}
.ck-qbtn:hover{background:var(--ck-rose-lt);color:var(--ck-rose);}
.ck-qbtn:active{transform:scale(.88);}
.ck-qval{width:30px;text-align:center;font-size:.8rem;font-weight:700;color:var(--ck-ink);border-left:1.5px solid var(--ck-border);border-right:1.5px solid var(--ck-border);line-height:26px;}
.ck-free-tag{font-size:.67rem;font-weight:700;color:var(--ck-green);}

.ck-item-end{display:flex;flex-direction:column;align-items:flex-end;gap:5px;padding-top:10px;flex-shrink:0;}
.ck-item-price{font-size:.88rem;font-weight:800;color:var(--ck-ink);white-space:nowrap;}
.ck-free-price{color:var(--ck-green);font-weight:800;}
.ck-del{background:none;border:none;cursor:pointer;color:#D0CBC5;padding:3px;border-radius:4px;transition:color var(--ck-tr),background var(--ck-tr),transform 100ms;}
.ck-del:hover{color:var(--ck-err);background:#FEE2E2;}
.ck-del:active{transform:scale(.88);}

/* Sep */
.ck-sep{height:1px;background:var(--ck-border);margin:.85rem 0;}

/* Promo */
.ck-promo{padding:.25rem 0 .1rem;}
.ck-promo-label{display:flex;align-items:center;gap:5px;font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--ck-ink2);margin:0 0 .55rem;}
.ck-promo-label svg{color:var(--ck-rose);}
.ck-promo-row{display:flex;}
.ck-promo-inp{flex:1;height:38px;padding:0 .8rem;border:1.5px solid var(--ck-border);border-right:none;border-radius:var(--ck-r-sm) 0 0 var(--ck-r-sm);font-size:.8rem;font-weight:500;color:var(--ck-ink);background:var(--ck-bg);outline:none;transition:border-color var(--ck-tr);}
.ck-promo-inp::placeholder{color:#C8C4BF;}
.ck-promo-inp:focus{border-color:var(--ck-rose);background:#fff;}
.ck-promo-btn{height:38px;padding:0 .9rem;background:var(--ck-ink);color:#fff;border:none;border-radius:0 var(--ck-r-sm) var(--ck-r-sm) 0;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:background var(--ck-tr);}
.ck-promo-btn:hover{background:var(--ck-rose);}
.ck-promo-ok{font-size:.68rem;color:var(--ck-green);font-weight:700;margin:.4rem 0 0;animation:ck-fade 300ms ease;}

/* Totals */
.ck-totals{display:flex;flex-direction:column;gap:.45rem;}
.ck-tot-row{display:flex;justify-content:space-between;align-items:center;font-size:.83rem;}
.ck-tot-row span:first-child{color:var(--ck-muted);font-weight:500;}
.ck-tot-row span:last-child{color:var(--ck-ink);font-weight:700;}
.ck-grand{display:flex;justify-content:space-between;align-items:baseline;margin:.2rem 0;}
.ck-grand-lbl{font-family:system-ui;font-size:1rem;font-weight:800;color:var(--ck-ink);}
.ck-grand-val{font-family:system-ui;font-size:1.75rem;font-weight:800;color:var(--ck-rose);letter-spacing:-.03em;text-shadow:0 1px 8px rgba(225,29,72,.12);}
.ck-ship-hint{font-size:.68rem;font-weight:600;color:var(--ck-gold);margin:.2rem 0 0;}

/* Trust */
.ck-trust-row{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;margin-top:1.1rem;}
.ck-trust-pill{display:flex;align-items:center;gap:4px;font-size:.63rem;font-weight:700;color:var(--ck-muted);letter-spacing:.05em;text-transform:uppercase;background:var(--ck-bg);border:1px solid var(--ck-border);padding:4px 9px;border-radius:20px;}
.ck-trust-pill svg{color:var(--ck-rose);}
.ck-trust-txt{font-size:.63rem;color:var(--ck-muted);text-align:center;line-height:1.55;margin:.6rem 0 0;}

/* ── EMPTY ── */
.ck-empty{min-height:65vh;background:var(--ck-bg);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2.5rem 1.5rem;}
.ck-empty-icon{width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,#fff,#FFF1F4);border:1px solid var(--ck-rose-mid);display:flex;align-items:center;justify-content:center;color:var(--ck-rose);margin-bottom:1.4rem;box-shadow:var(--ck-shadow-md);}
.ck-empty h2{font-family:system-ui;font-size:1.6rem;font-weight:800;color:var(--ck-ink);margin:0 0 .4rem;letter-spacing:-.02em;}
.ck-empty p{color:var(--ck-muted);font-size:.88rem;margin:0 0 1.75rem;}

/* ── SUCCESS SCREEN ── */
.ck-success-page{min-height:75vh;background:var(--ck-bg);display:flex;align-items:center;justify-content:center;padding:2.5rem 1.25rem;}
.ck-success-card{
  background:linear-gradient(160deg,#fff 0%,#FFF8F9 100%);
  border:1px solid var(--ck-border);
  border-radius:18px;padding:2.5rem 2rem;
  max-width:460px;width:100%;text-align:center;
  box-shadow:var(--ck-shadow-md);
  animation:ck-up 500ms cubic-bezier(.16,1,.3,1) both;
}
@keyframes ck-bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes ck-bounce-icon {
  0% { transform: scale(0); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.ck-check-ring{
  width:72px;height:72px;border-radius:50%;
  background:var(--ck-green-lt);
  border:1.5px solid rgba(6,95,70,.18);
  display:flex;align-items:center;justify-content:center;
  color:var(--ck-green);margin:0 auto 1rem;
  box-shadow:0 0 0 6px rgba(6,95,70,.07);
  animation: ck-bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation-delay: 150ms;
}
.ck-check-ring svg {
  animation: ck-bounce-icon 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation-delay: 300ms;
}
.ck-success-eyebrow{font-size:.62rem;letter-spacing:.22em;color:var(--ck-rose);font-weight:800;margin:0 0 .5rem;text-transform:uppercase;}
.ck-success-heading{font-family:system-ui;font-size:1.7rem;font-weight:800;color:var(--ck-ink);margin:0 0 .35rem;letter-spacing:-.02em;}
.ck-success-desc{font-size:.86rem;color:var(--ck-muted);margin:0 0 1.4rem;}

.ck-cod-notice{
  display:flex;gap:.7rem;text-align:left;
  background:#FFFBEB;border:1px solid #FDE68A;
  border-radius:10px;padding:.9rem 1rem;
  font-size:.79rem;color:#92400E;line-height:1.65;
  margin-bottom:1.25rem;
}
.ck-cod-notice strong{display:block;font-weight:800;margin-bottom:.15rem;}
.ck-cod-notice p{margin:0;font-weight:400;}
.ck-notice-ico{color:#D97706;flex-shrink:0;margin-top:2px;}

/* Success details table */
.ck-success-rows{
  background:var(--ck-bg);
  border:1px solid var(--ck-border);
  border-radius:10px;overflow:hidden;text-align:left;
}
.ck-success-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:.7rem 1.1rem;font-size:.82rem;
  border-bottom:1px solid var(--ck-border);
  transition:background var(--ck-tr);
}
.ck-success-row:last-child{border-bottom:none;}
.ck-success-row:hover{background:rgba(225,29,72,.02);}
.ck-success-row span:first-child{color:var(--ck-muted);font-weight:500;}
.ck-success-row span:last-child{color:var(--ck-ink);font-weight:700;}
.ck-success-row-total span:last-child{color:var(--ck-rose);font-size:1rem;font-weight:800;}

/* ── KEYFRAMES ── */
@keyframes ck-spin{to{transform:rotate(360deg)}}
@keyframes ck-pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes ck-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

/* ── MOBILE POLISH ── */
@media(max-width:900px){
  .ck-left{gap:0;padding:0 0 88px;}
  .ck-card{border-radius:0;border-left:none;border-right:none;border-top:none;box-shadow:none;margin-bottom:0;}
  .ck-card::before{display:none;}
  .ck-card-in{animation:none;}
  .ck-card:focus-within{border-color:var(--ck-border);box-shadow:none;}
  .ck-desk-next{display:none!important;}
}
@media(max-width:420px){
  .ck-sum-heading{font-size:.95rem;}
  .ck-grand-val{font-size:1.45rem;}
  .ck-section-title{font-size:.92rem;}
  .ck-success-heading{font-size:1.4rem;}
}
@media(prefers-reduced-motion:reduce){
  .ck-card-in,.ck-success-card{animation:none;}
  .ck-spinner{animation:none;border-top-color:#fff;}
}
`;
