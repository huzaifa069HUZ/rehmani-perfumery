'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoHeroProps {
  src: string;
}

export default function ScrollVideoHero({ src }: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let ctx: gsap.Context;

    const initScrollTrigger = () => {
      setIsReady(true);

      ctx = gsap.context(() => {
        // Pin the video for 400% of the viewport (300% scrub + 100% overlap)
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: '+=400%',
          pin: true,
          pinSpacing: false, // Critical: don't push content down, we will use explicit margin
        });

        // Scrub the video for the first 300% of the viewport
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: '+=300%',
          scrub: 0.5, // Smooth interpolation (0.5s)
          onUpdate: (self) => {
            // Update video time directly; GSAP is already in a rAF loop
            if (video.duration) {
              video.currentTime = self.progress * video.duration;
            }
          },
        });
      });
    };

    // Try to ensure the video is ready for programmatic scrubbing
    // Sometimes forcing a load helps metadata resolve quickly
    if (video.readyState >= 1) {
      initScrollTrigger();
    } else {
      video.load(); 
      video.addEventListener('loadedmetadata', initScrollTrigger, { once: true });
    }

    return () => {
      ctx?.revert();
      video.removeEventListener('loadedmetadata', initScrollTrigger);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="scroll-video-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh', // Exactly 1 viewport high
        background: '#000',
        overflow: 'hidden',
        zIndex: 1, // Stay below the white section
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover',
        }}
      />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* Minimal scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: isReady ? 1 : 0, transition: 'opacity 0.8s ease 1s',
      }}>
        <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          Scroll to explore
        </span>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', background: 'rgba(255,255,255,0.7)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }} />
        </div>
      </div>
      <style>{`
        @keyframes scrollPulse {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
