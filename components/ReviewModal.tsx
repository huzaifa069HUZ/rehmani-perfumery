'use client';
import { useState, FormEvent, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface ReviewModalProps {
  onClose: () => void;
}

export default function ReviewModal({ onClose }: ReviewModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Pre-fill name if available via Google Auth
  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(onClose, 300); // Matches CSS transition
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return; // Guard
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        uid: user.uid,
        name: name || 'Anonymous Buyer',
        product,
        rating,
        text: review,
        initial: (name || 'Anonymous Buyer').charAt(0).toUpperCase(),
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to add review", err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal-backdrop review-modal-backdrop ${isAnimatingOut ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className={`review-modal-box ${isAnimatingOut ? 'slide-down' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>

        {success ? (
          <div className="review-success">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2>Review Submitted!</h2>
            <p>Thank you for sharing your experience with the world.</p>
          </div>
        ) : (
          <>
            <h2 className="review-modal-title">Write a Review</h2>
            <p className="review-modal-desc">Share your elegant experience with our premium fragrances.</p>
            
            <form onSubmit={handleSubmit} className="review-form">
              <div className="input-row">
                <div className="input-group">
                  <label>Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="input-group">
                  <label>Product Bought</label>
                  <input type="text" value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Royal Oud" required />
                </div>
              </div>

              <div className="rating-group">
                <label>Your Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg 
                      key={star} 
                      className={`rating-star ${(hoveredRating || rating) >= star ? 'filled' : ''}`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Your Review</label>
                <textarea 
                  rows={4} 
                  value={review} 
                  onChange={e => setReview(e.target.value)} 
                  placeholder="Tell us what you loved about it..." 
                  required 
                ></textarea>
              </div>

              <button type="submit" className="submit-review-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
