'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PenLine, Send } from 'lucide-react'
import LetterPrompts from './LetterPrompts'

export default function LetterForm() {
  const [content, setContent] = useState('')
  const [signature, setSignature] = useState('')
  const [yearsPassed, setYearsPassed] = useState<number | ''>('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const charCount = content.length
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed || content.trim().length < 10) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('letters')
        .insert({
          content: content.trim(),
          signature: signature.trim() || null,
          years_passed: yearsPassed || null,
          approved: false
        })

      if (error) throw error

      setSuccess(true)
      setContent('')
      setSignature('')
      setYearsPassed('')
      setAgreed(false)

      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Failed to send letter:', error)
      alert('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  function handlePromptSelect(promptText: string) {
    setContent(promptText)
  }

  return (
    <div id="napisz-list" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <PenLine className="w-6 h-6 text-memorial-accent" />
        <h2 className="text-3xl font-serif text-white">Napisz swój list</h2>
      </div>

      <LetterPrompts onSelectPrompt={handlePromptSelect} />

      <form onSubmit={handleSubmit} className="bg-memorial-dark/50 border border-memorial-accent/20 rounded-2xl p-8 backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-memorial-gray text-sm mb-3">
            Twój list <span className="text-memorial-accent">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Drogi Tato..."
            rows={12}
            maxLength={2000}
            className="w-full bg-memorial-darker/50 border border-memorial-accent/20 rounded-xl p-4 text-white placeholder-memorial-gray focus:border-memorial-accent/50 focus:outline-none resize-none font-serif text-lg leading-relaxed"
          />
          <div className="flex justify-between text-sm text-memorial-gray mt-2">
            <span>{wordCount} słów</span>
            <span className={charCount > 1900 ? 'text-orange-400' : ''}>
              {charCount} / 2000 znaków
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-memorial-gray text-sm mb-3">
            Podpis <span className="text-xs">(opcjonalnie)</span>
          </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="np. Syn z Warszawy, Córka"
            maxLength={100}
            className="w-full bg-memorial-darker/50 border border-memorial-accent/20 rounded-xl p-4 text-white placeholder-memorial-gray focus:border-memorial-accent/50 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-memorial-gray text-sm mb-3">
            Ile lat minęło? <span className="text-xs">(opcjonalnie)</span>
          </label>
          <input
            type="number"
            value={yearsPassed}
            onChange={(e) => setYearsPassed(e.target.value ? parseInt(e.target.value) : '')}
            placeholder="np. 5"
            min="0"
            max="100"
            className="w-full bg-memorial-darker/50 border border-memorial-accent/20 rounded-xl p-4 text-white placeholder-memorial-gray focus:border-memorial-accent/50 focus:outline-none"
          />
          <p className="text-xs text-memorial-gray mt-2">
            To pomoże innym zrozumieć Twoją historię
          </p>
        </div>

        <div className="mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-memorial-accent/30 bg-memorial-darker/50 text-memorial-accent focus:ring-memorial-accent/50"
            />
            <span className="text-sm text-memorial-gray">
              Zgadzam się na anonimową publikację mojego listu.
              Rozumiem, że nie są zbierane żadne dane osobowe (IP, e-mail).
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!agreed || content.trim().length < 10 || loading}
          className="w-full sm:w-auto px-8 py-4 bg-memorial-accent hover:bg-memorial-accent-light text-memorial-dark rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>Wysyłam...</>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Wyślij w niebo 🕊️
            </>
          )}
        </button>

        {success && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-center animate-fade-in">
            Twój list został wysłany. Niech doleci tam, gdzie trzeba. 🕊️
          </div>
        )}
      </form>
    </div>
  )
}
