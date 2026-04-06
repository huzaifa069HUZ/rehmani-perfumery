'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 6);
  const [currentImg, setCurrentImg] = useState(0);
  const { addToCart } = useCart();

  const activePriceData = product.pricing?.[selectedSize];
  const displayPrice = activePriceData ? activePriceData.price : product.price;
  const displayOriginal = activePriceData ? activePriceData.originalPrice : product.originalPrice;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      size: selectedSize,
      price: displayPrice,
      image: product.images?.[0] || '',
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="modal-body">
          {/* Image panel */}
          <div className="modal-img-panel">
            <div className="modal-img-wrap">
              {product.images?.[currentImg] ? (
                <Image
                  src={product.images[currentImg]}
                  alt={product.name}
                  fill
                  className="modal-img"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                  No Image
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="modal-thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`modal-thumb${currentImg === i ? ' active' : ''}`}
                    onClick={() => setCurrentImg(i)}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="modal-info-panel">
            <span className="modal-category">{product.category.toUpperCase()}</span>
            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-notes">{product.notes}</p>
            <div className="modal-price-row">
              <span className="modal-price">₹{displayPrice}</span>
              {displayOriginal && displayOriginal > displayPrice && (
                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '15px', fontWeight: '500' }}>
                  ₹{displayOriginal}
                </span>
              )}
            </div>

            <div className="modal-section-label">SELECT SIZE</div>
            <div className="modal-sizes">
              {(product.sizes || [6, 12, 18]).map(size => (
                <button
                  key={size}
                  className={`size-btn${selectedSize === size ? ' active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}ml
                </button>
              ))}
            </div>

            <button className="modal-add-btn" onClick={handleAdd}>
              ADD TO BAG
            </button>

            <div className="modal-trust">
              <span>✦ Pure Arabian Oil</span>
              <span>✦ Free Shipping ₹999+</span>
              <span>✦ Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
