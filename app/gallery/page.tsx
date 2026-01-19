'use client'

import { motion } from 'framer-motion'
import { Box, Download, ExternalLink } from 'lucide-react'

const MOCK_MODELS = [
  { id: 1, name: 'Ancient Vase', date: '2 mins ago', thumbnail: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Modern Chair', date: '1 hour ago', thumbnail: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Mountain Peak', date: 'Yesterday', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400' },
]

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Gallery</h1>
          <p className="text-gray-400">Manage and export your converted 3D models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_MODELS.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group glass rounded-3xl overflow-hidden border-white/5 hover:border-white/20 transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={model.thumbnail} 
                alt={model.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                  <Box className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg">{model.name}</h3>
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm text-gray-500">{model.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
