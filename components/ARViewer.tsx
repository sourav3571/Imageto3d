'use client'

import { useEffect, useRef } from 'react'

interface ARViewerProps {
  modelUrl: string
  poster?: string
}

export function ARViewer({ modelUrl, poster }: ARViewerProps) {
  const modelViewerRef = useRef<any>(null)

  useEffect(() => {
    import('@google/model-viewer')
  }, [])

  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden bg-gray-900">
      {/* @ts-ignore */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        poster={poster}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        <button 
          slot="ar-button" 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm shadow-lg"
        >
          View in your space
        </button>
      </model-viewer>
    </div>
  )
}
