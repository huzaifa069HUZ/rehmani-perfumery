'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── 3D Bottle ─────────────────────────────────────────────────────────────────
function Bottle3D({ progress }: { progress: React.RefObject<number> }) {
  const { scene } = useGLTF('/assets/3dbottle.glb');
  const bottleGroup = useRef<THREE.Group>(null);
  const floatGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!bottleGroup.current || !floatGroup.current) return;

    const p = progress.current ?? 0;

    // ── Position: enters from bottom-right ──────────────────────────
    if (p < 0.25) {
      const t = p / 0.25;
      const eased = 1 - Math.pow(1 - t, 3);
      bottleGroup.current.position.set(
        1.5 * (1 - eased),
        -2.5 * (1 - eased),
        -1 * (1 - eased),
      );
      // Scale: 0.5 → 1
      const s = 0.5 + 0.5 * eased;
      bottleGroup.current.scale.set(s, s, s);
    } else if (p < 0.6) {
      // Settled at center
      bottleGroup.current.position.set(0, 0, 0);
      bottleGroup.current.scale.set(1, 1, 1);
    } else if (p < 0.85) {
      // Slight zoom-in as card reveals
      const t = (p - 0.6) / 0.25;
      const eased = t * t * (3 - 2 * t); // smoothstep
      bottleGroup.current.position.set(0, -0.3 * eased, eased);
      const s = 1 + 0.25 * eased;
      bottleGroup.current.scale.set(s, s, s);
    }

    // ── Continuous Y-rotation mapped to 0→1 ──────────────────────────
    bottleGroup.current.rotation.x = Math.PI * 0.1 * (1 - Math.min(p / 0.25, 1));
    bottleGroup.current.rotation.z = Math.PI * 0.05 * (1 - Math.min(p / 0.25, 1));
    bottleGroup.current.rotation.y = -Math.PI * 0.5 + p * Math.PI * 2.5;

    // ── Idle float (very subtle) ─────────────────────────────────────
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


// ─── Main Section ───────────────────────────────────────────────────────────────
export default function PerfumeJourney() {
  // The single element GSAP will PIN
  const pinnedRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  // A mutable ref holding scroll progress 0→1 — drives the rAF loop above
  const progress = useRef<number>(0);

  useEffect(() => {
    if (!pinnedRef.current || !cardRef.current || !canvasRef.current || !blurRef.current) return;

    // ── Master timeline driven by GSAP pin ──────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinnedRef.current,
        // pin the element in place for 2.5× screen-heights of scroll
        pin: true,
        start: 'top top',
        end: '+=250%',        // 2.5 × 100vh worth of scroll distance
        scrub: 1.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      },
    });

    // 0 → 0.2  canvas fades in
    tl.fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0);

    // 0.5 → 0.8  depth blur + card reveal
    tl.fromTo(blurRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.inOut' }, 0.5);

    tl.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.5);

    // 0.85 → 1  everything fades out (clean exit)
    tl.to(canvasRef.current, { opacity: 0, duration: 0.15 }, 0.85);
    tl.to(cardRef.current, { opacity: 0, y: -20, duration: 0.15 }, 0.85);

    return () => { ScrollTrigger.getAll().forEach(st => st.kill()); };
  }, []);

  return (
    /* The section itself is just 100vh — GSAP adds the spacer scroll distance via `pin` */
    <section className="relative bg-neutral-950 z-[9999]">
      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Pinned viewport — GSAP locks this here while user scrolls */}
      <div
        ref={pinnedRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(40,20,10,0.5) 0%, #000 100%)',
        }}
      >
        {/* Ambient glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-xl max-h-xl bg-amber-800/25 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center px-4 pointer-events-none">

          {/* Depth-blur plate — appears 0.5-0.85 */}
          <div
            ref={blurRef}
            className="absolute inset-0 z-10 backdrop-blur-[6px] bg-black/15 hidden md:block"
            style={{ opacity: 0 }}
          />

          {/* ── Ultra-Premium Apple-Level Glassmorphic Card ──────────────── */}
          <div
            ref={cardRef}
            style={{
              position: 'absolute',
              zIndex: 20,
              width: '100%',
              maxWidth: '520px',
              opacity: 0,
              borderRadius: '28px',
              overflow: 'hidden',
              // Floating multi-layer shadow — depth without harshness
              boxShadow: [
                '0 2px 0 0 rgba(255,255,255,0.06) inset',   // top glass highlight
                '0 80px 120px -20px rgba(0,0,0,0.75)',       // deep float shadow
                '0 0 0 0.5px rgba(255,255,255,0.08)',         // subtle frame line
                '0 0 60px 0 rgba(212,175,55,0.06)',           // warm ambient glow
              ].join(', '),
              cursor: 'default',
              pointerEvents: 'auto',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.018)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            {/* Glass surface */}
            <div style={{
              position: 'relative',
              padding: 'clamp(2rem, 5vw, 3rem)',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '28px',
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              // Film grain via repeating noise
              backgroundImage: [
                'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)',
              ].join(', '),
            }}>

              {/* Inner top reflection streak — glass physics */}
              <div style={{
                position: 'absolute',
                top: 0, left: '10%', right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
                borderRadius: '999px',
                pointerEvents: 'none',
              }} />

              {/* Soft edge glow — right side */}
              <div style={{
                position: 'absolute',
                top: '20%', right: '-1px',
                width: '1px', height: '40%',
                background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.25), transparent)',
                pointerEvents: 'none',
              }} />

              {/* Content stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(212,175,55,0.9)',
                    boxShadow: '0 0 8px rgba(212,175,55,0.7)',
                    display: 'inline-block',
                  }} />
                  <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.45em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    color: 'rgba(212,175,55,0.8)',
                  }}>
                    rahmani  Perfumery &nbsp;·&nbsp; Est. 2010
                  </span>
                </div>

                {/* Heading — Playfair-style large serif */}
                <h2 style={{
                  margin: 0,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: '#ffffff',
                }}>
                  Crafted for{' '}
                  <span style={{
                    display: 'inline',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    background: 'linear-gradient(110deg, #D4AF37 0%, #e8a838 45%, #f0c070 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Presence
                  </span>
                </h2>

                {/* Thin divider */}
                <div style={{
                  height: '0.5px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.04))',
                  borderRadius: '999px',
                }} />

                {/* Description */}
                <p style={{
                  margin: 0,
                  fontFamily: '"Inter", "Satoshi", system-ui, sans-serif',
                  fontSize: 'clamp(0.87rem, 1.4vw, 0.97rem)',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'rgba(110,210,140,0.82)',
                  maxWidth: '38ch',
                }}>
                  From sunlit rose fields to ancient oud forests — every bottle
                  is a journey into pure sensory artistry. Worn by those who
                  move through the world with intention.
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {['Pure Attar', 'Handcrafted', 'Long-Lasting', 'Alcohol Free'].map(tag => (
                    <span key={tag} style={{
                      padding: '4px 13px',
                      borderRadius: '999px',
                      fontSize: '0.6rem',
                      letterSpacing: '0.06em',
                      fontWeight: 500,
                      color: 'rgba(240,230,210,0.6)',
                      background: 'rgba(255,255,255,0.05)',
                      border: '0.5px solid rgba(255,255,255,0.1)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingTop: '0.25rem' }}>

                  {/* Primary — gold gradient pill */}
                  <button
                    style={{
                      position: 'relative', overflow: 'hidden',
                      display: 'inline-flex', alignItems: 'center', gap: '9px',
                      padding: '13px 26px',
                      borderRadius: '999px',
                      border: 'none',
                      fontSize: '0.7rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: '#0d0900',
                      background: 'linear-gradient(120deg, #D4AF37 0%, #c8901a 55%, #e8b84b 100%)',
                      boxShadow: '0 4px 20px rgba(212,175,55,0.3), 0 1px 0 rgba(255,255,255,0.2) inset',
                      cursor: 'pointer',
                      transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translateY(-2px) scale(1.03)';
                      el.style.boxShadow = '0 8px 36px rgba(212,175,55,0.55), 0 1px 0 rgba(255,255,255,0.25) inset';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translateY(0) scale(1)';
                      el.style.boxShadow = '0 4px 20px rgba(212,175,55,0.3), 0 1px 0 rgba(255,255,255,0.2) inset';
                    }}
                  >
                    {/* Shimmer sweep */}
                    <span style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.55s ease',
                      pointerEvents: 'none',
                    }} />
                    <span>Explore Collection</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Secondary — minimal text */}
                  <button
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '0.68rem', letterSpacing: '0.12em',
                      textTransform: 'uppercase', fontWeight: 400,
                      color: 'rgba(220,210,190,0.45)',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212,175,55,0.85)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(220,210,190,0.45)'; }}
                  >
                    Our Story
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* WebGL canvas — z below card, above blur plate */}
          <div
            ref={canvasRef}
            className="absolute inset-0 z-[15] pointer-events-none"
            style={{ opacity: 0 }}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 35 }} dpr={[1, 2]} className="w-full h-full">
              <ambientLight intensity={0.6} />
              <spotLight position={[5, 10, 5]} intensity={6} angle={0.4} penumbra={1} color="#ffdcb4" />
              <directionalLight position={[-5, 5, -5]} intensity={1.2} color="#b0caff" />
              <pointLight position={[0, -2, 3]} intensity={4} color="#ffedd5" />
              <Environment preset="studio" />
              <Sparkles count={70} scale={6} size={2.2} speed={0.18} opacity={0.25} color="#f5c97a" />
              <Suspense fallback={null}>
                <Bottle3D progress={progress} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
