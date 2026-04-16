'use client';

import './custom-blend.css';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomBlendDelivery() {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' });
  
  // Continuous observer for video playback optimization
  const isVideoInView = useInView(videoRef, { margin: '200px' });
  const [isMuted, setIsMuted] = useState(true);

  // Play/pause video based on viewport intersection to save mobile CPU/GPU

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVideoInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isVideoInView]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section className="custom-blend-wrapper" ref={ref}>
      {/* Left Image Half */}
      <motion.div 
        className="custom-blend-image-container"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <video 
          ref={videoRef}
          src="/assets/custom attar.mp4"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        <button
          onClick={toggleMute}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
        {/* Subtle overlay for better blending */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, rgba(79, 106, 87, 0.4) 100%)' }} />
      </motion.div>

      {/* Right Content Half */}
      <motion.div 
        className="custom-blend-content"
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        <motion.span 
          className="custom-blend-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Exclusive Services
        </motion.span>
        
        <motion.h2 
          className="custom-blend-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Custom Blends &<br/> Same Day Patna Delivery
        </motion.h2>
        
        <motion.p 
          className="custom-blend-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          From the rarest semi-precious ingredients to perfectly balanced compositions, every drop is crafted with care. Experience the true luxury of personalized fragrances made specifically for your aura. Enjoy the unparalleled convenience of our same-day delivery anywhere within Patna.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/contact" style={{ display: 'inline-block' }}>
            <button className="custom-blend-btn" aria-label="Learn More About Custom Blends" style={{ zIndex: 1 }}>
              Learn More
            </button>
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
      </motion.div>
    </section>
  );
}
