'use client'

import { useState } from 'react'
import { Letter } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Heart, Share2, Volume2, Flame } from 'lucide-react'

interface LetterCardProps {
  letter: Letter
  onFeelAdded?: () => void
}

export default function LetterCard({ letter, onFeelAdded }: LetterCardProps) {
  const [feels, setFeels] = useState(letter.feels_count)
  const [hasFeels, setHasFeels] = useState(false)
  const [isReading, setIsReading] = useState(false)

  async function handleFeels() {
    if (hasFeels) return

    try {
      const res = await fetch('/api/feels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId: letter.id })
      })

      const { success } = await res.json()
      
      if (success) {
        setFeels(prev => prev + 1)
        setHasFeels(true)
        onFeelAdded?.()
      }
    } catch (error) {
      console.error('Failed to add feel:', error)
    }
  }

  function handleShare() {
    const event = new CustomEvent('openShareModal', { 
      detail: { letter } 
    })
    window.dispatchEvent(event)
  }

  function handleListen() {
    if (isReading) {
      speechSynthesis.cancel()
      setIsReading(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(letter.content)
    utterance.lang = 'pl-PL'
    utterance.rate = 0.9
    utterance.pitch = 1.0
    
    utterance.onend = () => setIsReading(false)
    utterance.onerror = () => setIsReading(false)
    
    speechSynthesis.speak(utterance)
    setIsReading(true)
  }

  const isPremium = letter.premium_tier && 
    letter.premium_until && 
    new Date(letter.premium_until) > new Date()

  return (
    <div className={`
      bg-memorial-dark/50 border rounded-2xl p-6 md:p-8 
      backdrop-blur-sm transition-all duration-300
      ${isPremium 
        ? 'border-yellow-400/40 shadow-lg shadow-yellow-400/20' 
        : 'border-memorial-accent/20 hover:border-memorial-accent/40'
      }
    `}>
      {isPremium && (
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-flicker" />
          <span className="text-yellow-400 text-sm font-semibold">
            {letter.premium_tier === 'golden_flame' && 'Złoty płomień'}
            {letter.premium_tier === 'animated' && 'Premium'}
          </span>
        </div>
      )}

      <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-4 font-serif">
        "{letter.content}"
      </p>

      {letter.signature && (
        <p className="text-memorial-gray text-sm mb-4">
          — {letter.signature}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm text-memorial-gray mb-6">
        <span>{formatDate(letter.created_at)}</span>
        {letter.years_passed && (
          <span>
            {letter.years_passed} {letter.years_passed === 1 ? 'rok' : 'lat'}
          </span>
        )}
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>{letter.candles}</span>
        </div>
      </div>

      {letter.tags && letter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {letter.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 bg-memorial-accent/10 text-memorial-accent text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFeels}
          disabled={hasFeels}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
            ${hasFeels 
              ? 'bg-memorial-accent/20 text-memorial-accent cursor-not-allowed' 
              : 'bg-memorial-accent/10 text-memorial-accent hover:bg-memorial-accent/20'
            }
          `}
        >
          <Heart className={`w-4 h-4 ${hasFeels ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">
            {feels} {hasFeels ? 'Dziękuję' : 'Ja też tak czuję'}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-memorial-accent/10 text-memorial-accent hover:bg-memorial-accent/20 rounded-lg transition-all duration-300"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Podziel się</span>
        </button>

        <button
          onClick={handleListen}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
            ${isReading 
              ? 'bg-memorial-accent text-memorial-dark' 
              : 'bg-memorial-accent/10 text-memorial-accent hover:bg-memorial-accent/20'
            }
          `}
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isReading ? 'Stop' : 'Odsłuchaj'}
          </span>
        </button>
      </div>
    </div>
  )
}
