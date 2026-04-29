'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import QuickViewModal from './QuickViewModal';
import { buildProductSlug } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [currentImg, setCurrentImg] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToCart, toggleCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const liked = isInWishlist(product.id);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentImg === 0) {
      setCurrentImg(1);
      setIsHovered(true); // reveals quick add btn on swipe left
    } else if (isRightSwipe && currentImg === 1) {
      setCurrentImg(0);
      setIsHovered(false);
    }
  };

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const images = product.images || [];
    const sizes = product.sizes || [6, 12];
    addToCart({
      id: product.id,
      name: product.name,
      size: sizes[0],
      price: product.price,
      image: images[0] || '',
    });
  }, [product, addToCart]);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const images = product.images || [];
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: images[0] || '',
    });
  }, [product, toggleWishlist]);

  return (
    <>
      <Link
        className="product-card"
        href={`/product/${buildProductSlug(product.name, String(product.id))}`}
        prefetch={true}
        onMouseEnter={() => { setIsHovered(true); setCurrentImg(1); }}
        onMouseLeave={() => { setIsHovered(false); setCurrentImg(0); }}
        style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
      >
        <div
          className="product-img-wrap"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {product.isNew && <span className="product-badge">New</span>}

          <div className="product-img-slider">
            {(product.images || []).slice(0, 2).map((img, i) => (
              <div
                key={i}
                className="product-img-slide"
                style={{ transform: `translateX(${(i - currentImg) * 100}%)` }}
              >
                <Image
                  src={img}
                  alt={product.name}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="product-img"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="img-dots">
            {(product.images || []).slice(0, 2).map((_, i) => (
              <span key={i} className={`img-dot${currentImg === i ? ' active' : ''}`} />
            ))}
          </div>

          {/* Action buttons stack (top-right) */}
          <div className={`product-action-btns${isHovered ? ' visible' : ''}`}>
            {/* Wishlist heart */}
            <button
              className={`wishlist-btn${liked ? ' active' : ''}`}
              onClick={handleWishlistToggle}
              aria-label={liked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            {/* Quick view eye */}
            <button
              className="quickview-btn"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModalOpen(true); }}
              aria-label="Quick View"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>

          {/* Quick add */}
          <button
            className={`quick-add-btn${isHovered ? ' visible' : ''}`}
            onClick={product.inStock === false ? (e) => { e.preventDefault(); e.stopPropagation(); } : handleQuickAdd}
            disabled={product.inStock === false}
            aria-label="Quick Add"
            style={{ 
              opacity: product.inStock === false ? 0.8 : 1, 
              cursor: product.inStock === false ? 'not-allowed' : 'pointer',
              backgroundColor: product.inStock === false ? '#d32f2f' : undefined,
              color: product.inStock === false ? '#fff' : undefined
            }}
          >
            {product.inStock === false ? 'OUT OF STOCK' : 'ADD TO BAG'}
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-notes">{product.notes || ''}</p>
          <div className="price-block">
            <span className="product-price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
            {product.originalPrice > product.price && (
              <span className="discount-badge">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            )}
          </div>
        </div>
      </Link>

      {modalOpen && (
        <QuickViewModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
