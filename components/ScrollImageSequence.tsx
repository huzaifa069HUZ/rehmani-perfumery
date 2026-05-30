'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollImageSequenceProps {
  frameCount: number;
  framePrefix: string;
  frameSuffix: string;
}

export default function ScrollImageSequence({
  frameCount,
  framePrefix,
  frameSuffix,
}: ScrollImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We keep track of the current frame in an object so GSAP can tween it
    const scrollState = {
      frame: 1
    };

    // Preload all images
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // format: ezgif-frame-001.jpg
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `${framePrefix}${paddedIndex}${frameSuffix}`;
        
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / frameCount) * 100));
          
          // Draw the very first frame immediately once it loads
          if (i === 1) {
            renderFrame(1);
          }

          if (loadedCount === frameCount) {
            setIsReady(true);
            initGSAP();
          }
        };
        images.push(img);
      }
    };

    // Draw a specific frame to the canvas, covering the whole area
    const renderFrame = (index: number) => {
      if (!canvas || !ctx || !images[index - 1]) return;
      
      const img = images[index - 1];
      
      // Calculate aspect ratio to "object-fit: cover" the canvas
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    let gsapCtx: gsap.Context;

    const initGSAP = () => {
      gsapCtx = gsap.context(() => {
        // Create a single timeline that pins the container for 400vh
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=400%',
            pin: true,
            pinSpacing: false,
            scrub: 0.5, // Smooth scrubbing
          }
        });

        // Animate the frame from 1 to frameCount. 
        // We use duration: 0.75 so it finishes when the scroll is at 300% (75% of 400%)
        // The remaining 25% (100vh) keeps it pinned while the next section overlaps it.
        tl.to(scrollState, {
          frame: frameCount,
          ease: 'none',
          duration: 0.75,
          onUpdate: () => {
            requestAnimationFrame(() => renderFrame(Math.round(scrollState.frame)));
          }
        });
      });
    };

    // Handle canvas resizing
    const resizeCanvas = () => {
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          if (loadedCount > 0) {
            renderFrame(Math.round(scrollState.frame));
          }
        }
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    preloadImages();

    return () => {
      gsapCtx?.revert();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [frameCount, framePrefix, frameSuffix]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Loading State Overlay - Using opacity instead of conditional render to prevent React Node errors */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#000', color: '#c9a55a', fontFamily: 'sans-serif',
        opacity: isReady ? 0 : 1,
        pointerEvents: isReady ? 'none' : 'auto',
        transition: 'opacity 0.5s ease'
      }}>
        <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Loading Cinematic
        </p>
        <div style={{ width: 200, height: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div style={{ width: `${loadingProgress}%`, height: '100%', background: '#c9a55a', transition: 'width 0.2s' }} />
        </div>
      </div>

      {/* The Canvas element replaces the video */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
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
