'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Box, Layers, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Turn 2D Images into <br /> Immersive 3D Models
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Powered by Gemini AI. Upload any photo and watch it transform into a high-fidelity 3D mesh in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/convert"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
              >
                Start Converting <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/gallery"
                className="px-8 py-4 glass hover:bg-white/10 rounded-full font-semibold transition-all"
              >
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] -z-10 rounded-full" />
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="AI Depth Estimation"
            description="Advanced Gemini Vision analysis for precise depth mapping and object segmentation."
          />
          <FeatureCard 
            icon={<Layers className="w-8 h-8 text-blue-500" />}
            title="Instant Mesh Generation"
            description="Convert depth maps into optimized 3D meshes with high-quality UV mapping."
          />
          <FeatureCard 
            icon={<Box className="w-8 h-8 text-purple-500" />}
            title="Export & AR Ready"
            description="Download as GLB or OBJ. Preview in your space with built-in AR support."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 glass rounded-3xl hover:border-white/20 transition-all group">
      <div className="mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}
