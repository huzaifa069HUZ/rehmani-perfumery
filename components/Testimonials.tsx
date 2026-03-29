'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ReviewModal from './ReviewModal';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const DEFAULT_TESTIMONIALS = [
  { name: 'Ayesha Khan', text: '"The Royal Oud is absolutely divine! Long-lasting and authentic. Best attar I\'ve ever purchased."', initial: 'A', rating: 5 },
  { name: 'Rahul Sharma', text: '"Pure quality! The packaging is premium and the fragrance lasts all day. Highly recommend!"', initial: 'R', rating: 5 },
  { name: 'Sana Ahmed', text: '"Amazing collection! The Midnight Musk is my favorite. Will definitely order again."', initial: 'S', rating: 5 },
  { name: 'Mohammed Ali', text: '"Excellent service and authentic products. The Velvet Rose is simply mesmerizing!"', initial: 'M', rating: 5 },
  { name: 'Priya Patel', text: '"Fast delivery and beautiful packaging. The quality is outstanding. Worth every penny!"', initial: 'P', rating: 5 },
];

const StarIcon = ({ filled = true }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "transparent"} stroke={filled ? "#fbbf24" : "rgba(255,255,255,0.2)"} strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>(DEFAULT_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews: any[] = [];
      snapshot.forEach(doc => {
        fetchedReviews.push({ id: doc.id, ...doc.data() });
      });
      if (fetchedReviews.length > 0) {
        // If we have less than 4 reviews, pad with defaults to keep marquee smooth
        const merged = [...fetchedReviews];
        if (merged.length < 4) {
          merged.push(...DEFAULT_TESTIMONIALS.slice(0, 4 - merged.length));
        }
        setReviews(merged);
      } else {
        setReviews(DEFAULT_TESTIMONIALS);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGiveReview = () => {
    if (!user) {
      router.push('/auth');
    } else {
      setIsModalOpen(true);
    }
  };

  const doubled = [...reviews, ...reviews];

  return (
    <section className="testimonials-section">
      <div className="section-container">
        <div className="testimonials-header">
          <span className="section-badge">Community</span>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
      </div>

      <div className="testimonials-marquee">
        <div className="testimonials-track">
          {doubled.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="stars">
                {[...Array(5)].map((_, j) => <StarIcon key={j} filled={j < (t.rating || 5)} />)}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initial}</div>
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.product ? `Bought: ${t.product}` : 'Verified Buyer'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <button 
          onClick={handleGiveReview}
          className="give-review-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 36px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%)',
            color: '#000',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            borderRadius: '50px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.25)',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.25)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Write a Review
        </button>
      </div>

      {isModalOpen && <ReviewModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}
