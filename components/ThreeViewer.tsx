'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

interface ThreeViewerProps {
  depthData?: number[]
  textureUrl?: string
  width?: number
  height?: number
}

function Scene({ depthData, textureUrl, width = 32, height = 32 }: ThreeViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const { geometry, texture } = useMemo(() => {
    // Create a plane geometry
    const geo = new THREE.PlaneGeometry(5, 5, width - 1, height - 1)
    
    // If we have depth data, displace the vertices
    if (depthData && depthData.length === width * height) {
      const positions = geo.attributes.position.array as Float32Array
      for (let i = 0; i < depthData.length; i++) {
        // The z-coordinate is at index i*3 + 2
        // We multiply by a factor to control the depth intensity
        positions[i * 3 + 2] = depthData[i] * 2 
      }
      geo.computeVertexNormals()
    }

    const tex = textureUrl ? new THREE.TextureLoader().load(textureUrl) : null
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace
    }

    return { geometry: geo, texture: tex }
  }, [depthData, textureUrl, width, height])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            map={texture} 
            color={texture ? "white" : "#3b82f6"}
            roughness={0.7}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4.5} 
      />
      
      <Environment preset="city" />
    </>
  )
}

export function ThreeViewer({ depthData, textureUrl, width = 32, height = 32 }: ThreeViewerProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-gradient-to-b from-gray-900 to-black rounded-3xl overflow-hidden relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
        <Scene depthData={depthData} textureUrl={textureUrl} width={width} height={height} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono text-gray-400 border border-white/5">
          3D PREVIEW MODE
        </div>
      </div>
    </div>
  )
}
