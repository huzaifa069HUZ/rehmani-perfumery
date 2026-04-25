'use client';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useMemo } from 'react';
import { MYSTERY_ATTAR_ID } from '@/components/FreeAttarPopup';

const FREE_SHIPPING_THRESHOLD = 999;

function ShippingProgressBar({ totalPrice }: { totalPrice: number }) {
  const progress = useMemo(() => Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100), [totalPrice]);
  const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;
  const isUnlocked = totalPrice >= FREE_SHIPPING_THRESHOLD;

  const milestones = [
    { value: 0, label: '₹0' },
    { value: 499, label: '₹499' },
    { value: FREE_SHIPPING_THRESHOLD, label: '₹999' },
  ];

  return (
    <div className={`shipping-progress-wrap${isUnlocked ? ' unlocked' : ''}`}>
      {/* Message */}
      <div className="shipping-msg">
        {isUnlocked ? (
          <>
            <span className="shipping-icon shipping-icon-unlocked">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </span>
            <span className="shipping-msg-text unlocked-text">
              You&apos;ve unlocked <strong>FREE Shipping!</strong> 🎉
            </span>
          </>
        ) : (
          <>
            <span className="shipping-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </span>
            <span className="shipping-msg-text">
              Add <strong>₹{remaining}</strong> more for <strong>FREE Shipping</strong>
            </span>
          </>
        )}
      </div>

      {/* Progress Track */}
      <div className="shipping-track">
        <div className="shipping-track-bg" />
        <div
          className="shipping-track-fill"
          style={{ width: `${progress}%` }}
        />
        {/* Glow dot at the tip */}
        {totalPrice > 0 && (
          <div
            className="shipping-track-dot"
            style={{ left: `${progress}%` }}
          />
        )}
        {/* Milestone markers */}
        {milestones.map((m) => {
          const pos = (m.value / FREE_SHIPPING_THRESHOLD) * 100;
          const reached = totalPrice >= m.value;
          return (
            <div
              key={m.value}
              className={`shipping-milestone${reached ? ' reached' : ''}`}
              style={{ left: `${pos}%` }}
            >
              <div className="milestone-dot" />
              <span className="milestone-label">{m.label}</span>
            </div>
          );
        })}
      </div>

      {/* Sparkle particles when unlocked */}
      {isUnlocked && (
        <div className="shipping-sparkles">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="sparkle" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div className="drawer-backdrop" onClick={toggleCart} />
      )}

      <div className={`cart-drawer${isCartOpen ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <h2 className="cart-title">YOUR BAG</h2>
          <button className="drawer-close-btn" onClick={toggleCart} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <ShippingProgressBar totalPrice={totalPrice} />

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your cart is empty</p>
              <button className="btn-primary" onClick={toggleCart}>Continue Shopping</button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div className="cart-item" key={i}>
                <div className="cart-item-img">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>Size: {item.size}ml</p>
                  <div className="cart-item-footer">
                    {item.id === MYSTERY_ATTAR_ID ? (
                      /* Mystery attar: locked at qty 1, no +/- controls */
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: 'linear-gradient(135deg,#d4af37,#b8902a)',
                          color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                          padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.06em',
                          whiteSpace: 'nowrap',
                        }}>
                          🎁 FREE GIFT
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Qty: 1 (locked)</span>
                      </div>
                    ) : (
                      <div className="qty-ctrl">
                        <button onClick={() => updateQuantity(i, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(i, 1)}>+</button>
                      </div>
                    )}
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">
                        {item.id === MYSTERY_ATTAR_ID
                          ? <span style={{ color: '#16a34a', fontWeight: 800 }}>FREE</span>
                          : `₹${item.price * item.quantity}`
                        }
                      </span>
                      <button className="remove-btn" onClick={() => removeItem(i)} aria-label="Remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button className="checkout-btn">CHECKOUT</button>
            <button className="continue-btn" onClick={toggleCart}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}
