'use client';
import { useRef, useState } from 'react';

export default function LuxuryVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section className="luxury-video-section">
      <style>{`
        .luxury-video-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .luxury-video-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.35) 0%,
            rgba(0,0,0,0.05) 40%,
            rgba(0,0,0,0.05) 60%,
            rgba(0,0,0,0.45) 100%
          );
        }

        .luxury-video-el {
          width: 100%;
          display: block;
          max-height: 85vh;
          object-fit: cover;
          filter: brightness(0.92);
        }

        .luxury-video-badge {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #d3a958;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 6px 20px;
          border: 1px solid rgba(211,169,88,0.3);
          border-radius: 2px;
          white-space: nowrap;
        }

        .luxury-video-content {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          text-align: center;
          width: 100%;
          padding: 0 16px;
        }

        .luxury-video-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 5vw, 3.2rem);
          font-weight: 400;
          color: #fff;
          letter-spacing: 0.06em;
          margin: 0 0 8px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }

        .luxury-video-subtitle {
          font-size: clamp(0.7rem, 1.5vw, 0.85rem);
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin: 0;
          text-shadow: 0 1px 10px rgba(0,0,0,0.5);
        }

        .luxury-video-mute-btn {
          position: absolute;
          bottom: 32px;
          right: 24px;
          z-index: 4;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .luxury-video-mute-btn:hover {
          background: rgba(211,169,88,0.5);
          border-color: #d3a958;
        }

        @media (max-width: 600px) {
          .luxury-video-el {
            max-height: 60vh;
          }
          .luxury-video-badge {
            font-size: 0.45rem;
            letter-spacing: 0.2em;
            padding: 4px 12px;
            top: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 90vw;
          }
          .luxury-video-title {
            font-size: 1.1rem;
            letter-spacing: 0.03em;
            margin-bottom: 4px;
          }
          .luxury-video-subtitle {
            font-size: 0.55rem;
            letter-spacing: 0.18em;
          }
          .luxury-video-content {
            bottom: 16px;
          }
          .luxury-video-mute-btn {
            width: 32px;
            height: 32px;
            bottom: 16px;
            right: 12px;
          }
        }
      `}</style>

      {/* Gradient overlay */}
      <div className="luxury-video-overlay" />

      {/* Top badge */}
      <div className="luxury-video-badge">Rehmani Perfumery — The Art of Fragrance</div>

      {/* Video */}
      <video
        ref={videoRef}
        className="luxury-video-el"
        src="/assets/Luxury_Perfume_Intro_Video_Generation.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Bottom text */}
      <div className="luxury-video-content">
        <h2 className="luxury-video-title">Crafted for the Extraordinary</h2>
        <p className="luxury-video-subtitle">Experience Luxury in Every Drop</p>
      </div>

      {/* Mute toggle */}
      <button
        className="luxury-video-mute-btn"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          /* Muted icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          /* Unmuted icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </section>
  );
}
