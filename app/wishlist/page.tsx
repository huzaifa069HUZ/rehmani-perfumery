'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMoveToBag = (item: typeof wishlist[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      size: 6,
      price: item.price,
      image: item.image,
    });
    removeFromWishlist(item.id);
  };

  return (
    <>
      <Header onMenuOpen={() => setMenuOpen(true)} onSearchOpen={() => setSearchOpen(true)} />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />

      <main className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1 className="wishlist-title">My Wishlist</h1>
            {wishlist.length > 0 && (
              <span className="wishlist-count">{wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}</span>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 className="wishlist-empty-title">Your wishlist is empty</h2>
              <p className="wishlist-empty-desc">Save your favourite fragrances and come back to them anytime.</p>
              <Link href="/attars" className="wishlist-shop-btn">EXPLORE COLLECTION</Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-card">
                  <div className="wishlist-card-img-wrap">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width:768px) 50vw, 25vw"
                      className="wishlist-card-img"
                    />
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label="Remove from wishlist"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="wishlist-card-info">
                    <h3 className="wishlist-card-name">{item.name}</h3>
                    <div className="wishlist-card-price-row">
                      <span className="wishlist-card-price">₹{item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="wishlist-card-original">₹{item.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className="wishlist-move-btn"
                      onClick={() => handleMoveToBag(item)}
                    >
                      MOVE TO BAG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
