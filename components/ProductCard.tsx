'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToCart, toggleCart } = useCart();

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      size: product.sizes[0],
      price: product.price,
      image: product.images[0],
    });
  }, [product, addToCart]);

  return (
    <>
      <div
        className="product-card"
        onMouseEnter={() => { setIsHovered(true); setCurrentImg(1); }}
        onMouseLeave={() => { setIsHovered(false); setCurrentImg(0); }}
        onClick={() => setModalOpen(true)}
      >
        <div className="product-img-wrap">
          {product.isNew && <span className="product-badge">New</span>}

          <div className="product-img-slider">
            {product.images.slice(0, 2).map((img, i) => (
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
            {product.images.slice(0, 2).map((_, i) => (
              <span key={i} className={`img-dot${currentImg === i ? ' active' : ''}`} />
            ))}
          </div>

          {/* Quick add */}
          <button
            className={`quick-add-btn${isHovered ? ' visible' : ''}`}
            onClick={handleQuickAdd}
            aria-label="Quick Add"
          >
            ADD TO BAG
          </button>
        </div>

        <div className="product-info">
          <div className="product-info-row">
            <h3 className="product-name">{product.name}</h3>
            <span className="product-price">₹{product.price}</span>
          </div>
          <p className="product-notes">{product.notes}</p>
        </div>
      </div>

      {modalOpen && (
        <QuickViewModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
