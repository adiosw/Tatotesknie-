'use client'

import { useEffect, useState } from 'react'
import { supabase, Letter } from '@/lib/supabase'
import { Star, Heart, Flame } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function LetterOfDay() {
  const [letter, setLetter] = useState<Letter | null>(null)

  useEffect(() => {
    loadLetterOfDay()
  }, [])

  async function loadLetterOfDay() {
    const { data } = await supabase
      .from('letters')
      .select('*')
      .eq('is_letter_of_day', true)
      .single()
    
    if (data) {
      setLetter(data)
    }
  }

  if (!letter) return null

  return (
    <div className="mb-16 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-serif text-white">List dnia</h2>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400/10 blur-3xl rounded-3xl" />
        
        <div className="relative bg-gradient-to-br from-memorial-dark/80 to-memorial-darker/80 border-2 border-yellow-400/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300">
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-6 font-serif italic">
            "{letter.content}"
          </p>
          
          {letter.signature && (
            <p className="text-yellow-400 font-medium mb-4 text-lg">
              — {letter.signature}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-memorial-gray">
            <span>{formatDate(letter.created_at)}</span>
            {letter.years_passed && (
              <span>{letter.years_passed} {letter.years_passed === 1 ? 'rok' : 'lat'} temu</span>
            )}
            <div className="flex items-center gap-2 text-orange-400">
              <Flame className="w-4 h-4" />
              <span>{letter.candles}</span>
            </div>
            <div className="flex items-center gap-2 text-memorial-accent">
              <Heart className="w-4 h-4" />
              <span>{letter.feels_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
