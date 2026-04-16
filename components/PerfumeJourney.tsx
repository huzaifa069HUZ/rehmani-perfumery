'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── 3D Bottle — GPU-optimised ─────────────────────────────────────────────────
function Bottle3D({ progress }: { progress: React.RefObject<number> }) {
  const { scene } = useGLTF('/assets/3dbottle.glb');
  const bottleGroup = useRef<THREE.Group>(null);
  const floatGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!bottleGroup.current || !floatGroup.current) return;
    const p = progress.current ?? 0;

    // Position: enter from bottom-right
    if (p < 0.25) {
      const t = p / 0.25;
      const e = 1 - Math.pow(1 - t, 3); // cubic ease-out
      bottleGroup.current.position.set(1.5 * (1 - e), -2.5 * (1 - e), -1 * (1 - e));
      const s = 0.5 + 0.5 * e;
      bottleGroup.current.scale.set(s, s, s);
    } else if (p < 0.6) {
      bottleGroup.current.position.set(0, 0, 0);
      bottleGroup.current.scale.set(1, 1, 1);
    } else if (p < 0.85) {
      const t = (p - 0.6) / 0.25;
      const e = t * t * (3 - 2 * t);
      bottleGroup.current.position.set(0, -0.3 * e, e);
      const s = 1 + 0.25 * e;
      bottleGroup.current.scale.set(s, s, s);
    }

    bottleGroup.current.rotation.x = Math.PI * 0.1 * (1 - Math.min(p / 0.25, 1));
    bottleGroup.current.rotation.z = Math.PI * 0.05 * (1 - Math.min(p / 0.25, 1));
    bottleGroup.current.rotation.y = -Math.PI * 0.5 + p * Math.PI * 2.5;

    // Subtle float bob
    floatGroup.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.04;
  });

  return (
    <group ref={bottleGroup}>
      <group ref={floatGroup}>
        <Center>
          <primitive object={scene} scale={[1, 1, 1]} />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload('/assets/3dbottle.glb');

import { useMotionValue, useInView } from 'framer-motion';
import { TextRevealByWord } from '@/components/ui/text-reveal';

const REVEAL_TEXT =
  "Rahmani Perfumery — Patna's finest attar house. " +
  "We craft pure, alcohol-free attars and long-lasting perfumes " +
  "from the rarest oud, musk, rose and saffron oils. " +
  "Every drop carries the soul of Arabian perfumery, " +
  "bottled with heritage and delivered to your door.";

// ─── Main Section ───────────────────────────────────────────────────────────────
export default function PerfumeJourney() {
  const pinnedRef = useRef<HTMLDivElement>(null);
  const cardRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const blurRef   = useRef<HTMLDivElement>(null);
  const progress  = useRef<number>(0);
  const fmProgress = useMotionValue(0);
  const isCanvasInView = useInView(pinnedRef, { margin: '800px 0px' });

  useEffect(() => {
    if (!pinnedRef.current || !cardRef.current || !canvasRef.current || !blurRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinnedRef.current,
        pin: true,
        start: 'top top',
        end: '+=150%',
        scrub: 1.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => { 
          progress.current = self.progress; 
          fmProgress.set(self.progress);
        },
      },
    });

    tl.fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0);
    tl.fromTo(blurRef.current,   { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.inOut' }, 0.5);
    tl.fromTo(cardRef.current,   { opacity: 0, y: 50, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.5);

    // Deep layout shift compensation: observe the page for height changes (e.g. from images loading)
    let ro: ResizeObserver | null = null;
    if (typeof window !== 'undefined') {
      ro = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      ro.observe(document.body);
    }
    
    // Fallback re-read incase visual elements load post-hydration
    const tId1 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const tId2 = setTimeout(() => ScrollTrigger.refresh(), 1500);

    return () => { 
      ScrollTrigger.getAll().forEach(st => st.kill()); 
      if (ro) ro.disconnect();
      clearTimeout(tId1);
      clearTimeout(tId2);
    };
  }, [fmProgress]);

  return (
    <section
      className="relative z-[9999]"
      style={{ background: '#060402' }}
    >
      {/* Subtle film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.28,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Pinned viewport ── */}
      <div
        ref={pinnedRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 55%, rgba(50,28,8,0.55) 0%, #050402 80%)',
        }}
      >
        {/* Large ambient glow */}
        <div style={{
          position: 'absolute', top: '43%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '55vw', height: '55vw', maxWidth: 600, maxHeight: 600,
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          willChange: 'transform', // GPU layer
        }} />

        <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center px-4 sm:px-8 pointer-events-none">

          {/* BACKGROUND TEXT REVEAL */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: 0,
            right: 0,
            zIndex: 5,
            padding: '0 40px',
            opacity: 0.75, // Keeps it subtly in the background
            mixBlendMode: 'screen',
            pointerEvents: 'none'
          }}>
            <TextRevealByWord 
              text={REVEAL_TEXT} 
              progress={fmProgress}
            />
          </div>

          {/* Depth blur plate */}
          <div
            ref={blurRef}
            className="absolute inset-0 z-10 hidden md:block"
            style={{ opacity: 0, backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', background: 'rgba(0,0,0,0.12)' }}
          />

          {/* ── Premium Info Card ─────────────────────────────────────────── */}
          <div
            ref={cardRef}
            style={{
              position: 'absolute',
              zIndex: 20,
              inset: 'auto',
              // Desktop: right-positioned. Mobile: centred bottom
              right: 'clamp(12px, 4vw, 48px)',
              bottom: 'clamp(40px, 8vh, 80px)',
              width: 'min(100% - 24px, 480px)',
              opacity: 0,
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: [
                '0 2px 0 0 rgba(255,255,255,0.06) inset',
                '0 60px 100px -20px rgba(0,0,0,0.8)',
                '0 0 0 0.5px rgba(255,255,255,0.07)',
                '0 0 50px 10px rgba(212,175,55,0.04)',
              ].join(', '),
              cursor: 'default',
              pointerEvents: 'auto',
              transition: 'transform 0.45s cubic-bezier(0.25,1,0.5,1)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.012)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; }}
          >
            {/* Glass surface */}
            <div style={{
              position: 'relative',
              padding: 'clamp(1.6rem, 4vw, 2.6rem)',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 24,
            }}>
              {/* Top glass highlight streak */}
              <div style={{
                position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                borderRadius: 999, pointerEvents: 'none',
              }} />
              {/* Right edge glow */}
              <div style={{
                position: 'absolute', top: '25%', right: -1, width: 1, height: '40%',
                background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.22), transparent)',
                pointerEvents: 'none',
              }} />

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'rgba(212,175,55,0.9)',
                      boxShadow: '0 0 8px rgba(212,175,55,0.65)',
                      display: 'inline-block', flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: '0.58rem', letterSpacing: '0.42em',
                      textTransform: 'uppercase', fontWeight: 500,
                      color: 'rgba(212,175,55,0.75)',
                    }}>
                      Rahmani Perfumery&nbsp;·&nbsp;Est. 2010
                    </span>
                  </div>
                  {/* Quality badge */}
                  <span style={{
                    fontSize: '0.55rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(212,175,55,0.6)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: 30, padding: '3px 9px',
                  }}>
                    Premium
                  </span>
                </div>

                {/* Heading */}
                <h2 style={{
                  margin: 0,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)',
                  fontWeight: 700, lineHeight: 1.1,
                  letterSpacing: '-0.015em', color: '#ffffff',
                }}>
                  Crafted for{' '}
                  <span style={{
                    fontStyle: 'italic', fontWeight: 400,
                    background: 'linear-gradient(110deg, #D4AF37 10%, #e8b84b 55%, #f0d080 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Presence
                  </span>
                </h2>

                {/* Divider */}
                <div style={{
                  height: 0.5,
                  background: 'linear-gradient(90deg, rgba(212,175,55,0.25), rgba(255,255,255,0.04))',
                  borderRadius: 999,
                }} />

                {/* Description — fixed: warm off-white, NOT green */}
                <p style={{
                  margin: 0,
                  fontFamily: '"Inter", "Satoshi", system-ui, sans-serif',
                  fontSize: 'clamp(0.84rem, 1.3vw, 0.95rem)',
                  fontWeight: 300, lineHeight: 1.8,
                  color: 'rgba(230,220,200,0.72)', // warm off-white — matches brand
                  maxWidth: '40ch',
                }}>
                  From sunlit rose fields to ancient oud forests — every bottle
                  is a journey into pure sensory artistry. Worn by those who
                  move through the world with intention.
                </p>

                {/* Feature tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Pure Attar', 'Handcrafted', 'Long-Lasting', 'Alcohol Free'].map(tag => (
                    <span key={tag} style={{
                      padding: '4px 13px', borderRadius: 999,
                      fontSize: '0.58rem', letterSpacing: '0.07em',
                      fontWeight: 500,
                      color: 'rgba(235,225,200,0.55)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '0.5px solid rgba(255,255,255,0.09)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', paddingTop: '0.15rem' }}>

                  {/* Primary gold button */}
                  <a
                    href="/attars"
                    style={{
                      position: 'relative', overflow: 'hidden',
                      display: 'inline-flex', alignItems: 'center', gap: 9,
                      padding: '13px 26px', borderRadius: 999,
                      fontSize: '0.68rem', letterSpacing: '0.2em',
                      textTransform: 'uppercase', fontWeight: 700,
                      color: '#0d0900', textDecoration: 'none',
                      background: 'linear-gradient(120deg, #D4AF37 0%, #c88a1a 55%, #e8b84b 100%)',
                      boxShadow: '0 4px 22px rgba(212,175,55,0.28), 0 1px 0 rgba(255,255,255,0.18) inset',
                      transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translateY(-2px) scale(1.04)';
                      el.style.boxShadow = '0 10px 40px rgba(212,175,55,0.55), 0 1px 0 rgba(255,255,255,0.25) inset';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translateY(0) scale(1)';
                      el.style.boxShadow = '0 4px 22px rgba(212,175,55,0.28), 0 1px 0 rgba(255,255,255,0.18) inset';
                    }}
                  >
                    {/* Shimmer sweep on hover */}
                    <span style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.55s ease',
                      pointerEvents: 'none',
                    }} />
                    <span>Explore Collection</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>

                  {/* Ghost text link */}
                  <a
                    href="#about"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: '0.65rem', letterSpacing: '0.14em',
                      textTransform: 'uppercase', fontWeight: 400,
                      color: 'rgba(215,205,180,0.4)',
                      textDecoration: 'none',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212,175,55,0.82)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(215,205,180,0.4)'; }}
                  >
                    Our Story
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* WebGL Canvas — GPU composited layer */}
          <div
            ref={canvasRef}
            className="absolute inset-0 z-[15] pointer-events-none"
            style={{
              opacity: 0,
              willChange: 'opacity', // hint browser to keep on GPU
            }}
          >
            {isCanvasInView && (
              <Canvas
                camera={{ position: [0, 0, 5], fov: 35 }}
                // Cap pixel ratio to 2 - prevents excessive GPU load on retina screens
                dpr={[1, 2]}
                // Use offscreen rendering for better perf on modern browsers
                gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
                className="w-full h-full"
              >
                <ambientLight intensity={0.6} />
                <spotLight position={[5, 10, 5]} intensity={6} angle={0.4} penumbra={1} color="#ffdcb4" />
                <directionalLight position={[-5, 5, -5]} intensity={1.2} color="#b0caff" />
                <pointLight position={[0, -2, 3]} intensity={4} color="#ffedd5" />
                <Environment preset="studio" />
                {/* Reduced sparkle count for mobile perf */}
                <Sparkles count={50} scale={6} size={2} speed={0.15} opacity={0.22} color="#f5c97a" />
                <Suspense fallback={null}>
                  <Bottle3D progress={progress} />
                </Suspense>
              </Canvas>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
