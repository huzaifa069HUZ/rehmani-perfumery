'use client';
import { useRef, useState } from 'react';

const reels = [
  {
    poster: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop',
    likes: '45.2K',
    comments: '892',
  },
  {
    poster: 'https://images.unsplash.com/photo-1616881261314-1fbc8ffc04b5?q=80&w=600&auto=format&fit=crop',
    likes: '38.5K',
    comments: '654',
  },
  {
    poster: 'https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=600&auto=format&fit=crop',
    likes: '52.1K',
    comments: '1.2K',
  },
  {
    poster: 'https://images.unsplash.com/photo-1622618991746-fe6004db3a47?q=80&w=600&auto=format&fit=crop',
    likes: '41.8K',
    comments: '723',
  },
];

function ReelCard({ reel }: { reel: typeof reels[0] }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="reel-card" onClick={toggle}>
      <video
        ref={videoRef}
        poster={reel.poster}
        loop
        muted
        playsInline
        className="reel-video"
        onEnded={() => setPlaying(false)}
      />

      {/* Play / Pause overlay */}
      <div className={`reel-play-btn${playing ? ' hidden' : ''}`}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>

      {/* Instagram gradient overlay at bottom */}
      <div className="reel-gradient" />

      {/* Stats */}
      <div className="reel-stats">
        <span className="reel-stat">
          {/* Heart */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {reel.likes}
        </span>
        <span className="reel-stat">
          {/* Comment bubble */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          {reel.comments}
        </span>
      </div>
    </div>
  );
}

export default function ReelsSection() {
  return (
    <section className="reels-section">
      <div className="section-container">
        <div className="reels-header">
          <div>
            <span className="section-badge">Social Proof</span>
            <h2 className="section-title">Trending on Instagram</h2>
            <p className="reels-subtitle">See what our community is loving</p>
          </div>
          <a
            href="https://instagram.com/rahmani"
            target="_blank"
            rel="noopener noreferrer"
            className="follow-btn"
          >
            {/* Instagram icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Follow Us
          </a>
        </div>

        <div className="reels-grid">
          {reels.map((reel, i) => (
            <ReelCard key={i} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
