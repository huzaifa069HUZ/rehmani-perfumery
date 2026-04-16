'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    title: "crueltyfree\nandvegan",
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Bunny face/heart ears */}
        <path d="M32 40c-6 0-10 4-10 8s4 8 10 8 10-4 10-8-4-8-10-8z" />
        <path d="M25 43c-6-8-10-18-5-26 3-4 8-4 10 2 2-6 7-6 10-2 5 8 1 18-5 26" />
        <circle cx="28" cy="48" r="1.5" fill="currentColor" />
        <circle cx="36" cy="48" r="1.5" fill="currentColor" />
        <path d="M32 50v2" />
        <path d="M22 50h-4M23 46h-6M42 50h4M41 46h6" />
      </svg>
    )
  },
  {
    title: "Sulphate\nfree",
    icon: (
      <Image src="/assets/no-chemical.png" alt="Sulphate free" width={48} height={48} style={{ objectFit: 'contain' }} />
    )
  },
  {
    title: "Gentle to\nyour nose",
    icon: (
      <Image src="/assets/nose.png" alt="Gentle to your nose" width={48} height={48} style={{ objectFit: 'contain' }} />
    )
  },
  {
    title: "Non - Carcinogenic",
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Person / Shield contour */}
        <path d="M32 10c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z" fill="currentColor" />
        <path d="M44 32c0-4-6-8-12-8s-12 4-12 8v10l12 12 12-12V32z" fill="currentColor" stroke="none"/>
        <path d="M44 32c0-4-6-8-12-8s-12 4-12 8v10l12 12 12-12V32z" />
        {/* Starburst indicating purity/cleanness inside body */}
        <path d="M32 28v16M24 36h16M28 32l8 8M28 40l8-8" stroke="#fff" strokeWidth="3" />
      </svg>
    )
  },
  {
    title: "Long - Lasting",
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Top/Bottom Caps */}
        <path d="M16 10h32v4H16zM16 50h32v4H16z" />
        {/* Glass shape */}
        <path d="M20 14v8l10 10-10 10v8M44 14v8l-10 10 10 10v8" />
        {/* Sand Top */}
        <path d="M24 20l6 6 6-6" fill="currentColor" stroke="none" opacity="0.6"/>
        {/* Sand Bottom */}
        <path d="M26 44v4h12v-4l-6-6-6 6z" fill="currentColor" stroke="none"/>
        {/* Dripping sand */}
        <path d="M32 26v12" strokeWidth="1.5" strokeDasharray="3,3"/>
      </svg>
    )
  }
];

export default function FeaturesStrip() {
  return (
    <section className="features-strip">
      <div className="features-container">
        {features.map((item, idx) => (
          <motion.div 
            key={idx} 
            className="feature-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className="feature-icon">
              {item.icon}
            </div>
            <p className="feature-title">
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>

      <style>{`
        .features-strip {
          background-color: #F4F4F4; /* Light clean grey/white matching the reference */
          padding: 3rem 1rem;
          width: 100%;
          border-top: 1px solid rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .feature-item {
          flex: 1;
          min-width: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .feature-icon {
          color: #111;
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .feature-title {
          color: #222;
          font-family: inherit; /* Clean sans-serif */
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-line;
          margin: 0;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .features-container {
            gap: 2rem;
            justify-content: center;
          }
          .feature-item {
            flex: 0 0 40%;
          }
          .feature-title {
            font-size: 0.8rem;
          }
          .feature-icon svg {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </section>
  );
}
