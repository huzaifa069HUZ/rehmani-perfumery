'use client';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

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
                    <div className="qty-ctrl">
                      <button onClick={() => updateQuantity(i, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(i, 1)}>+</button>
                    </div>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">₹{item.price * item.quantity}</span>
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
