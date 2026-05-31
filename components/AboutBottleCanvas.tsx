'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, useGLTF, Center, OrbitControls } from '@react-three/drei';

// Pre-warm the GLB cache so it's ready by the time the user scrolls
useGLTF.preload('/assets/3dbottle.glb');

function BottleModel() {
  const { scene } = useGLTF('/assets/3dbottle.glb');
  return (
    <Center>
      <primitive object={scene} scale={[1.6, 1.6, 1.6]} />
    </Center>
  );
}

export default function AboutBottleCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}         // cap at 1.5× to avoid GPU overload on mobile
      frameloop="always"
    >
      <ambientLight intensity={0.6} />
      <spotLight position={[5, 10, 5]} intensity={5} color="#ffdcb4" />
      <Environment preset="studio" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={1.5}
      />
      <Suspense fallback={null}>
        <BottleModel />
      </Suspense>
    </Canvas>
  );
}
