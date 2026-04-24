'use client'

import { useState, useEffect } from 'react'
import { Letter } from '@/lib/supabase'
import HeroTeaser from '@/components/HeroTeaser'
import AnimatedCounters from '@/components/AnimatedCounters'
import SocialProof from '@/components/SocialProof'
import SupportSection from '@/components/SupportSection'
import LetterOfDay from '@/components/LetterOfDay'
import LetterForm from '@/components/LetterForm'
import ShareImage from '@/components/ShareImage'

export default function HomePage() {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  useEffect(() => {
    const handleOpenShareModal = (e: CustomEvent) => {
      setSelectedLetter(e.detail.letter)
      setShareModalOpen(true)
    }

    window.addEventListener('openShareModal' as any, handleOpenShareModal as any)
    return () => {
      window.removeEventListener('openShareModal' as any, handleOpenShareModal as any)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <header className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 animate-fade-in">
          Tato, tęsknię.
        </h1>
        <p className="text-memorial-gray text-lg md:text-xl max-w-2xl mx-auto animate-slide-up">
          Miejsce na słowa, których nie zdążyliśmy wypowiedzieć
        </p>
      </header>

      <div className="container mx-auto px-4 max-w-4xl">
        <HeroTeaser />
        <AnimatedCounters />
        <SocialProof />
        <SupportSection variant="hero" />
        <LetterOfDay />
        <LetterForm />
        
        {/* TODO: LettersList component - stream of all letters */}
        {/* <LettersList /> */}
        
        <SupportSection variant="bottom" />

        <footer className="py-12 text-center text-memorial-gray text-sm border-t border-memorial-accent/10 mt-16">
          <p className="mb-4">
            © 2026 tatotesknie.pl - Projekt społeczny
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/polityka-prywatnosci" className="hover:text-white transition-colors">
              Polityka prywatności
            </a>
            <a href="/regulamin" className="hover:text-white transition-colors">
              Regulamin
            </a>
            <a 
              href="https://instagram.com/tato_tesknie" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
          <p className="mt-6 text-xs text-memorial-gray/60">
            Made with ❤️ and 💔
          </p>
        </footer>
      </div>

      <ShareImage
        isOpen={shareModalOpen}
        letter={selectedLetter}
        onClose={() => setShareModalOpen(false)}
      />
    </main>
  )
}
