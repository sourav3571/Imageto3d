'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2, Box } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThreeViewer } from '@/components/ThreeViewer'

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resolution, setResolution] = useState(32)
  const [depthData, setDepthData] = useState<number[] | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFile(droppedFile)
    }
  }, [])

  const handleFile = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleConvert = async () => {
    if (!file) return;
    
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image')
      }
      
      setResolution(data.resolution || 32)
      setDepthData(data.depthMap)
      setShowViewer(true)
      setViewMode('3d')
    } catch (error: any) {
      console.error('Conversion error:', error)
      alert(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Create 3D Model</h1>
        <p className="text-gray-400">Upload a clear image of an object to generate its 3D counterpart.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Area / Viewer */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "relative aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all overflow-hidden",
            !file && "hover:border-blue-500/50 hover:bg-blue-500/5",
            file && "border-solid border-white/20"
          )}
        >
          <AnimatePresence mode="wait">
            {showViewer && depthData ? (
              <motion.div 
                key="viewer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full"
              >
                <ThreeViewer 
                  depthData={depthData} 
                  textureUrl={preview || undefined} 
                  width={resolution} 
                  height={resolution} 
                />
                <button 
                  onClick={() => setShowViewer(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ) : !file ? (
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-8"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">Drag & drop image</p>
                <p className="text-sm text-gray-500 mb-6">PNG, JPG up to 10MB</p>
                <label className="px-6 py-2 bg-white text-black rounded-full font-medium cursor-pointer hover:bg-gray-200 transition-colors">
                  Browse Files
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
                  />
                </label>
              </motion.div>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-full group"
              >
                <img src={preview!} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="p-3 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls & Status */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              Image Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Resolution</span>
                <span>{file ? 'Detected' : '--'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Complexity</span>
                <span>{file ? 'Medium' : '--'}</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <button
                disabled={!file || isProcessing}
                onClick={handleConvert}
                className="w-full py-4 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Depth...
                  </>
                ) : (
                  <>
                    <Box className="w-5 h-5" />
                    Generate 3D Model
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-blue-500/20 bg-blue-500/5">
            <p className="text-sm text-blue-300 leading-relaxed">
              Tip: For best results, use images with a clear subject and simple background.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
