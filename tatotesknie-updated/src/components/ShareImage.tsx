'use client'

import { useEffect, useState } from 'react'
import { Letter } from '@/lib/supabase'
import { X, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import { truncate } from '@/lib/utils'

interface ShareImageProps {
  isOpen: boolean
  letter: Letter | null
  onClose: () => void
}

export default function ShareImage({ isOpen, letter, onClose }: ShareImageProps) {
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  async function generateImage() {
    if (!letter) return

    setGenerating(true)

    try {
      const element = document.getElementById('share-canvas')
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0e27',
        scale: 2,
        logging: false,
      })

      canvas.toBlob((blob) => {
        if (!blob) return
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tatotesknie-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(url)

        setGenerating(false)
        onClose()
      })
    } catch (error) {
      console.error('Failed to generate image:', error)
      setGenerating(false)
    }
  }

  if (!isOpen || !letter) return null

  const quote = truncate(letter.content, 280)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-memorial-dark border border-memorial-accent/30 rounded-2xl p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Podziel się listem</h3>
          <button
            onClick={onClose}
            className="text-memorial-gray hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          id="share-canvas"
          className="w-full aspect-[9/16] bg-gradient-to-br from-memorial-dark to-memorial-darker rounded-xl p-8 flex flex-col justify-between relative overflow-hidden mb-6"
        >
          <div className="absolute inset-0 opacity-20">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random(),
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="text-memorial-accent text-4xl mb-4">🕊️</div>
            <p className="text-white text-lg font-serif leading-relaxed italic">
              "{quote}"
            </p>
          </div>

          <div className="relative z-10">
            {letter.signature && (
              <p className="text-memorial-accent text-sm mb-4">
                — {letter.signature}
              </p>
            )}
            <div className="text-memorial-gray text-base font-semibold">
              tatotesknie.pl
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateImage}
            disabled={generating}
            className="flex-1 px-6 py-3 bg-memorial-accent hover:bg-memorial-accent-light text-memorial-dark rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>Generuję...</>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Pobierz grafikę
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-memorial-dark border border-memorial-accent/30 text-white rounded-lg font-semibold hover:bg-memorial-accent/10 transition-all duration-300"
          >
            Anuluj
          </button>
        </div>

        <p className="text-memorial-gray text-xs text-center mt-4">
          Grafika gotowa do wrzucenia na Instagram Stories (9:16)
        </p>
      </div>
    </div>
  )
}
