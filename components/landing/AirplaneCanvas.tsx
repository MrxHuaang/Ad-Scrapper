"use client";

import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

function Airplane({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // true = use Draco decoder at /draco/
  const { scene } = useGLTF("/boeing-767-opt.glb", "/draco/");
  const ref = useRef<THREE.Group>(null);

  // Darken + metallic — blends with black bg, gold accent from lights
  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          const m = mat as THREE.MeshStandardMaterial;
          if (m.color) m.color.multiplyScalar(0.18);
          m.roughness = 0.55;
          m.metalness = 0.9;
          m.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!ref.current) return;
    const t = scrollYProgress.get();
    ref.current.position.x = THREE.MathUtils.lerp(-5, 5, t);
    ref.current.position.y = Math.sin(t * Math.PI) * 0.6 - 1.0;
    ref.current.position.z = Math.sin(t * Math.PI) * 1.2;
    ref.current.rotation.y = -Math.PI * 0.5;
    ref.current.rotation.x = Math.sin(t * Math.PI) * -0.06;
    ref.current.rotation.z = Math.sin(t * Math.PI) * 0.04;
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={0.22} />
    </group>
  );
}

interface AirplaneCanvasProps {
  scrollYProgress: MotionValue<number>;
}

export function AirplaneCanvas({ scrollYProgress }: AirplaneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 7], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#000000", 8, 22]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 4]} intensity={3.5} color="#e8b84b" />
      <directionalLight position={[-3, -2, 3]} intensity={0.6} color="#8899bb" />
      <directionalLight position={[0, 2, -6]} intensity={1.2} color="#e8b84b" />
      <Suspense fallback={null}>
        <Airplane scrollYProgress={scrollYProgress} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/boeing-767-opt.glb", "/draco/");
