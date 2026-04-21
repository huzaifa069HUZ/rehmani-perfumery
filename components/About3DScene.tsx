'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Pre-load the glb
useGLTF.preload('/assets/3dbottle.glb');

function BottleModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/assets/3dbottle.glb');
  
  // Clone to safely mutate materials if needed, though mostly we just want to transform it
  const { size, viewport } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Calculate global scroll progress (0 to 1) based on standard window scroll
    const scrollY = window.scrollY;
    // Total scrollable height minus viewport
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);
    
    // We only care about progress *after* the hero section (e.g. hero is ~100vh)
    // Let's create a mapped progress that starts after 100vh
    const heroHeight = window.innerHeight;
    const activeScroll = Math.max(0, scrollY - heroHeight * 0.8);
    const activeMaxScroll = maxScroll - heroHeight * 0.8;
    const activeProgress = Math.min(activeScroll / (activeMaxScroll || 1), 1);

    // Default Hidden State (in hero section)
    if (scrollY < heroHeight * 0.5) {
        // Keep it out of view below screen
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -viewport.height - 2, 0.05);
        return;
    }

    // -- Animation Sequence Mapping --
    
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetScale = 1;

    // Phase 1: Intro Section (0 to 0.3 active progress)
    if (activeProgress < 0.3) {
      const p = activeProgress / 0.3; // 0 to 1 for this phase
      // Move from bottom up, stay on the left side
      targetX = viewport.width * 0.25; 
      targetY = THREE.MathUtils.lerp(-viewport.height * 0.5, viewport.height * 0.1, p);
      targetZ = -1;
      targetScale = 1.2;
      targetRotY = THREE.MathUtils.lerp(-Math.PI, -Math.PI / 8, p);
      targetRotZ = 0.1;
    } 
    // Phase 2: Core Offerings (0.3 to 0.6)
    else if (activeProgress >= 0.3 && activeProgress < 0.6) {
      const p = (activeProgress - 0.3) / 0.3; 
      // Move from left to right side
      targetX = THREE.MathUtils.lerp(viewport.width * 0.25, -viewport.width * 0.3, p);
      targetY = THREE.MathUtils.lerp(viewport.height * 0.1, -viewport.height * 0.1, p);
      targetZ = 0;
      targetScale = 0.8;
      targetRotY = THREE.MathUtils.lerp(-Math.PI / 8, Math.PI / 4, p);
      targetRotX = 0.2;
    }
    // Phase 3: Stats & CTA (0.6 to 1.0)
    else {
      const p = (activeProgress - 0.6) / 0.4;
      // Move back to center, scale up heroically
      targetX = THREE.MathUtils.lerp(-viewport.width * 0.3, 0, p);
      targetY = THREE.MathUtils.lerp(-viewport.height * 0.1, 0, p);
      targetZ = THREE.MathUtils.lerp(0, 2, p);
      targetScale = THREE.MathUtils.lerp(0.8, 1.5, p);
      targetRotY = THREE.MathUtils.lerp(Math.PI / 4, 0, p);
      targetRotX = THREE.MathUtils.lerp(0.2, 0, p);
    }

    // Apply Smooth Lerping to the targets
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.08);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.08);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.08);

    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.08);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.08);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotZ, 0.08);

    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.08));
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={scene} />
      </Float>
    </group>
  );
}

export default function About3DScene() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <Canvas 
        shadows 
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
        
        {/* Cinematic Premium Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#D4AF37" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#666666" />
        <Environment preset="city" />

        <Suspense fallback={null}>
            <BottleModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
