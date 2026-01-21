'use client'

<<<<<<< HEAD
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, X, Image as ImageIcon, Loader2, Box, Settings2,
  Type, MoveRight, Sparkles, Layers, BoxSelect, Eraser,
  Download, Globe, Lock, Info, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThreeViewer } from '@/components/ThreeViewer'

export default function StudioPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Settings
  const [quality, setQuality] = useState<'standard' | 'ultra'>('standard') // Standard=32, Ultra=64
  const [enableTexture, setEnableTexture] = useState(true)
  const [thickness, setThickness] = useState(1.0)

  // Data
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Input State
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload')
  const [prompt, setPrompt] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
=======
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
>>>>>>> 10f727a2780857222d81c2d30723026a715452ba

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

<<<<<<< HEAD
  const handleTextGenerate = async () => {
    if (!prompt.trim()) return
    setIsGeneratingImage(true)
    setFile(null)
    setPreview(null)
    setModelUrl(null)
    setTaskId(null)
    setProgress(0)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPreview(data.imageUrl)
      const imageRes = await fetch(data.imageUrl)
      const blob = await imageRes.blob()
      setFile(new File([blob], "generated.jpg", { type: "image/jpeg" }))
    } catch (error: any) {
      alert("Failed to generate image: " + error.message)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleConvert = async () => {
    if (!file && !preview) return;
    setIsProcessing(true)
    setProgress(0)
    setTaskId(null)
    setModelUrl(null)

    try {
      // Create FormData with the file
      // If we only have a preview URL (e.g. from text gen), we need to convert it to a blob/file first
      let fileToUpload = file;
      if (!fileToUpload && preview) {
        const res = await fetch(preview);
        const blob = await res.blob();
        fileToUpload = new File([blob], "image.jpg", { type: "image/jpeg" });
      }

      if (!fileToUpload) throw new Error("No image file available");

      const formData = new FormData();
      formData.append('image', fileToUpload);

      // Stability AI is fast (~5-10s), so we just await the response directly.
      // We simulate progress for better UX.
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 5;
        })
      }, 500);

      const response = await fetch('/api/stability', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate model");
      }

      // Get the binary blob (GLB)
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setModelUrl(url);
      setProgress(100);

=======
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
>>>>>>> 10f727a2780857222d81c2d30723026a715452ba
    } catch (error: any) {
      console.error('Conversion error:', error)
      alert(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-[#0f0f12] text-white font-sans overflow-hidden">

      {/* --- SIDEBAR --- */}
      <div className="w-[360px] flex-shrink-0 flex flex-col border-r border-white/5 bg-[#141417]">

        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-[#8b5cf6]">
            <Sparkles className="w-5 h-5 fill-current" />
            <span className="font-bold text-lg tracking-tight text-white">Vart<span className="text-[#8b5cf6]">Studio</span></span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">

          {/* 1. Generate Model / Input Card */}
          <div className="bg-[#1c1c21] rounded-2xl border border-white/5 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <h2 className="font-semibold text-sm">Generate Model</h2>
            </div>

            {/* Input Toggle */}
            <div className="grid grid-cols-2 p-1 bg-black/40 rounded-lg">
              <button
                onClick={() => setInputMode('upload')}
                className={cn("text-xs font-medium py-1.5 rounded-md transition-all", inputMode === 'upload' ? 'bg-[#2c2c35] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300')}
              >
                Upload
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={cn("text-xs font-medium py-1.5 rounded-md transition-all", inputMode === 'text' ? 'bg-[#2c2c35] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300')}
              >
                Text
              </button>
            </div>

            {/* Input Area */}
            {inputMode === 'upload' ? (
              <div
                className={cn(
                  "relative aspect-square bg-black/20 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center transition-all group overflow-hidden",
                  !preview && "hover:border-[#8b5cf6]/50 cursor-pointer"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => !preview && document.getElementById('studio-upload')?.click()}
              >
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }} className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-red-500/80 transition-colors">
                        <Eraser className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#2c2c35] mb-2" />
                    <span className="text-xs text-gray-500">Drag & Drop or Click</span>
                  </>
                )}
                <input id="studio-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create..."
                  className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6]/50 resize-none placeholder:text-gray-600"
                />
                <button
                  onClick={handleTextGenerate}
                  disabled={isGeneratingImage || !prompt}
                  className="w-full py-2 bg-[#2c2c35] hover:bg-[#3c3c45] rounded-lg text-xs font-medium text-gray-300 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isGeneratingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate Preview
                </button>
              </div>
            )}

            {/* Buttons */}
          </div>

          {/* 2. Settings */}
          <div className="space-y-6 px-1">

            {/* Mesh Quality */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-medium">Mesh Quality</span>
                <Info className="w-3 h-3 text-gray-600" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQuality('standard')}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all",
                    quality === 'standard'
                      ? "bg-[#2c2c35] border-[#8b5cf6]/50 text-white"
                      : "bg-transparent border-white/5 text-gray-500 hover:border-white/10"
                  )}
                >
                  Standard
                </button>
                <button
                  onClick={() => setQuality('ultra')}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all",
                    quality === 'ultra'
                      ? "bg-[#2c2c35] border-yellow-500/50 text-white"
                      : "bg-transparent border-white/5 text-gray-500 hover:border-white/10"
                  )}
                >
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  Ultra
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              {/* Privacy */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-300">Privacy</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 cursor-not-allowed">
                  Public
                  <div className="w-8 h-4 bg-[#2c2c35] rounded-full relative opacity-50">
                    <div className="w-2 h-2 bg-gray-500 rounded-full absolute left-1 top-1" />
                  </div>
                </div>
              </div>

              {/* Texture */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-medium text-gray-300">Texture</span>
                </div>
                <button
                  onClick={() => setEnableTexture(!enableTexture)}
                  className={cn("w-8 h-4 rounded-full relative transition-colors", enableTexture ? "bg-[#8b5cf6]" : "bg-[#2c2c35]")}
                >
                  <div className={cn("w-2 h-2 bg-white rounded-full absolute top-1 transition-all", enableTexture ? "left-5" : "left-1")} />
                </button>
              </div>
            </div>

            {/* Thickness / Topology Settings */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <button className="flex items-center justify-between w-full text-xs font-medium text-gray-400 hover:text-white transition-colors">
                <span className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" /> Topology Settings
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <div className="pl-6 space-y-2">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                  <span>Thickness</span>
                  <span>{thickness}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={thickness}
                  onChange={(e) => setThickness(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#2c2c35] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#8b5cf6] [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Generate Action */}
        <div className="p-4 border-t border-white/5 bg-[#141417]">
          <button
            onClick={handleConvert}
            disabled={!preview || isProcessing}
            className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c4dff] disabled:bg-[#2c2c35] disabled:text-gray-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing {progress}%...
              </>
            ) : (
              <>
                Generate 3D Model
              </>
            )}
          </button>

          <div className="mt-3 flex justify-between items-center text-[10px] text-gray-600 font-mono">
            <span>v3.0 (Fast & Detailed)</span>
            <span className="flex items-center gap-1"><Sparkles className="w-2 h-2 text-yellow-500" /> 275 Credits</span>
          </div>
        </div>
      </div>

      {/* --- MAIN MAINPORT --- */}
      <div className="flex-1 relative bg-gradient-to-br from-[#121214] to-[#0a0a0c]">

        {/* Top Navbar overlay */}
        <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex items-center gap-1 bg-[#1c1c21]/80 backdrop-blur-md rounded-full p-1 border border-white/5 pointer-events-auto">
            {['Overview', 'Segmentation', 'Retopology', 'Texture', 'Rigging'].map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                  i === 0 ? "bg-[#2c2c35] text-white" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full">
          <div className="w-full h-full">
            <ThreeViewer
              modelUrl={modelUrl || undefined}
              textureUrl={enableTexture ? preview || undefined : undefined}
            />
          </div>
        </div>

=======
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
>>>>>>> 10f727a2780857222d81c2d30723026a715452ba
      </div>
    </div>
  )
}
