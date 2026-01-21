'use client'

import Link from 'next/link'
import { Box, Image as ImageIcon, LayoutGrid, Upload } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Box className="w-8 h-8 text-blue-500" />
          <span>DepthVision 3D</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/convert" className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors">
            <Upload className="w-4 h-4" />
            Convert
          </Link>
          <Link href="/gallery" className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors">
            <LayoutGrid className="w-4 h-4" />
            Gallery
          </Link>
        </div>
      </div>
    </nav>
  )
}
