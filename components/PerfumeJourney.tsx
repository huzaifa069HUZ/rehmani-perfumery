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
  const canvasRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const progress = useRef<number>(0);
  const fmProgress = useMotionValue(0);
  const isCanvasInView = useInView(pinnedRef, { margin: '800px 0px' });

  useEffect(() => {
    if (!pinnedRef.current || !canvasRef.current || !blurRef.current) return;

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
    tl.fromTo(blurRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.inOut' }, 0.5);

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
