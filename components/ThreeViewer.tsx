import { useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float, Gltf, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { Download, Wand2, Loader2 } from 'lucide-react'

interface ThreeViewerProps {
  modelUrl?: string
  textureUrl?: string
}

function Scene({ modelUrl }: { modelUrl?: string }) {
  if (!modelUrl) return null;

  return (
    <group rotation={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Gltf src={modelUrl} scale={3} />
      </Float>
      <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
      <Environment preset="city" />
    </group>
  )
}

export function ThreeViewer({ modelUrl }: ThreeViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Clean export logic can be re-added later if needed, but for now we focus on viewing.
  // Viewing GLB is simple in R3F.

  return (
    <div className="w-full h-full relative group bg-transparent">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <Suspense fallback={null}>
          <Scene modelUrl={modelUrl} />
        </Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={30}
        />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
        {/* Bottom Floating Controls */}
        <div className="px-4 py-2 bg-[#1c1c21]/80 backdrop-blur-md rounded-full text-xs font-medium text-gray-300 border border-white/5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span>Viewer Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}
