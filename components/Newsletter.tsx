'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving subscriber:', error);
      setStatus('error');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="section-container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Join Our Community</h2>
          <p className="newsletter-text">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn" disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && <p style={{ color: '#4ade80', marginTop: '12px', fontSize: '0.9rem', fontWeight: 500 }}>Subscribed successfully!</p>}
          {status === 'error' && <p style={{ color: '#f87171', marginTop: '12px', fontSize: '0.9rem', fontWeight: 500 }}>Something went wrong. Please try again.</p>}
        </div>
      </div>
    </section>
  );
}
