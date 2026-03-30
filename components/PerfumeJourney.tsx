'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Custom component to load and animate the 3D bottle
function Bottle3D({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const { scene } = useGLTF('/assets/3dbottle.glb');
  const bottleGroup = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (!bottleGroup.current || !parentRef.current) return;

    // Enable GSAP ScrollTrigger to hook into the page scrolling
    const t = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing effect
      }
    });

    // Start high up, rotate, and fall into place (0, 0, 0)
    t.fromTo(
      bottleGroup.current.position,
      { y: 12, x: 4, z: -8 }, // Starts deep in the background, top right
      { y: -0.5, x: 0, z: 1.5, ease: 'power3.inOut' }, // Falls gracefully to center foreground
      0
    )
    .fromTo(
      bottleGroup.current.rotation,
      { x: Math.PI / 2, y: -Math.PI * 2, z: Math.PI / 4 }, 
      { x: 0, y: Math.PI * 4, z: -Math.PI * 0.05, ease: 'power2.inOut' }, // Intricate spinning logic
      0
    );

    return () => {
      t.kill(); // cleanup
    }
  }, [parentRef]);

  // Subtle levitation/floating idle animation
  useFrame((state) => {
    if (bottleGroup.current) {
      bottleGroup.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.001;
    }
  });

  return (
    <group ref={bottleGroup}>
      {/* Reduced scale safely and added rotation to avoid clipping if original GLB is massive */}
      <primitive object={scene} scale={[1, 1, 1]} />
    </group>
  );
}

// Preload the model to ensure it doesn't flicker on load
useGLTF.preload('/assets/3dbottle.glb');

export default function PerfumeJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !cardRef.current) return;

    // Timeline for the Glassmorphic card revealing behind the bottle
    const t2 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: '40% top', // trigger when user scrolls 40% down the container
        end: '70% top',
        scrub: 1,
      }
    });
    
    t2.fromTo(cardRef.current, 
      { opacity: 0, y: 150, scale: 0.9 },
      { opacity: 1, y: -20, scale: 1, ease: 'back.out(1.5)' }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative h-[300vh] bg-rose-50/50"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 228, 230, 0.4) 0%, rgba(255, 255, 255, 0) 100%)`,
        backgroundBlendMode: 'soft-light',
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        <div className="relative w-full max-w-5xl mx-auto h-full flex items-center justify-center px-4 md:px-8">
          
          {/* Glassmorphic Card (Behind the bottle z-10) */}
          <div
            ref={cardRef}
            className="absolute z-10 w-full max-w-4xl bg-white/20 backdrop-blur-3xl border-[0.5px] border-white/40 p-12 md:p-20 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)] mx-auto top-1/2 -translate-y-1/2 left-4 right-4 md:left-0 md:right-0 overflow-hidden"
            // Make initially invisible until GSAP kicks in
            style={{ opacity: 0 }} 
          >
            {/* Elegant Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/5 opacity-60 pointer-events-none" />
            
            <div className="text-center space-y-8 relative z-10 flex flex-col items-center">
              <span className="text-rose-600 font-bold tracking-[0.3em] uppercase text-xs md:text-sm">
                Our Heritage
              </span>
              <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-[1.1] tracking-tight">
                A Journey of <br/> <span className="italic text-rose-500 font-light pr-2">Pure Essence</span>
              </h2>
              <p className="text-lg md:text-2xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-light">
                Every drop tells a story. From handpicked rare ingredients to the final mesmerizing blend in our signature flacon, discover an olfactory experience that transcends time.
              </p>
            </div>
            
          </div>

          {/* WebGL Canvas for 3D rendering (z-20) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full" dpr={[1, 2]}>
              <ambientLight intensity={2} />
              <directionalLight position={[10, 10, 5]} intensity={2.5} />
              <directionalLight position={[-10, -10, -5]} intensity={1} />
              <Environment preset="city" />
              <Suspense fallback={null}>
                <Bottle3D parentRef={containerRef} />
              </Suspense>
            </Canvas>
          </div>

        </div>
      </div>
    </section>
  );
}
