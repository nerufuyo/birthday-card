import { useEffect, useRef, useState } from 'react'
import { FinalSection } from './components/FinalSection'
import { FloatingNatureDecor } from './components/FloatingNatureDecor'
import { LoveLetter } from './components/LoveLetter'
import { MemoryStack } from './components/MemoryStack'
import { PhotoCarousel } from './components/PhotoCarousel'
import { audioContent } from './data/audio'
import { content } from './data/content'
import { memories, scrapbookInstances } from './data/memories'

const carouselImages = memories.map((m) => m.image)

function App() {
  const [unlockedStep, setUnlockedStep] = useState(0)
  const [showCarousel, setShowCarousel] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const musicStartedRef = useRef(false)

  const revealStep = (step: number) => {
    setUnlockedStep((value) => Math.max(value, step))

    requestAnimationFrame(() => {
      sectionRefs.current[step]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const replay = () => {
    setUnlockedStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setShowCarousel(true)
  }

  useEffect(() => {
    let cancelled = false

    const imageSources = Array.from(new Set(memories.map((memory) => memory.image)))
    const totalAssets = imageSources.length + 1
    let loadedAssets = 0

    const markLoaded = () => {
      if (cancelled) return

      loadedAssets += 1
      const nextPercent = Math.round((loadedAssets / totalAssets) * 100)
      setLoadingPercent(nextPercent)

      if (loadedAssets >= totalAssets) {
        setTimeout(() => {
          if (!cancelled) setAssetsReady(true)
        }, 120)
      }
    }

    for (const src of imageSources) {
      const image = new Image()
      image.decoding = 'async'
      image.onload = markLoaded
      image.onerror = markLoaded
      image.src = src
    }

    const audio = document.createElement('audio')
    audio.preload = 'auto'
    audio.src = audioContent.source
    audio.oncanplaythrough = markLoaded
    audio.onerror = markLoaded
    audio.load()

    return () => {
      cancelled = true
      audio.oncanplaythrough = null
      audio.onerror = null
    }
  }, [])

  // Silent music: starts on first user interaction, no visible button
  useEffect(() => {
    const audio = new Audio(audioContent.source)
    audio.loop = true
    audio.volume = 0.45

    const startMusic = () => {
      if (musicStartedRef.current) return
      musicStartedRef.current = true
      audio.play().catch(() => { })
      window.removeEventListener('pointerdown', startMusic)
      window.removeEventListener('touchstart', startMusic)
      window.removeEventListener('keydown', startMusic)
    }

    window.addEventListener('pointerdown', startMusic, { passive: true })
    window.addEventListener('touchstart', startMusic, { passive: true })
    window.addEventListener('keydown', startMusic)

    return () => {
      window.removeEventListener('pointerdown', startMusic)
      window.removeEventListener('touchstart', startMusic)
      window.removeEventListener('keydown', startMusic)
      audio.pause()
    }
  }, [])

  if (!assetsReady) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffaf5] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#eadfce] bg-white/85 p-8 text-center shadow-[0_14px_30px_-24px_rgba(91,75,69,0.5)] backdrop-blur-sm">
          <p className="font-hand text-4xl text-[#5b4b45]">preparing your surprise ✨</p>
          <p className="mt-3 text-sm text-[#7b665f]">Loading photos and music first so everything feels smooth.</p>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-[#efe2d4]">
            <div
              className="h-full rounded-full bg-[#b7c9a8] transition-[width] duration-200 ease-out"
              style={{ width: `${loadingPercent}%` }}
            />
          </div>

          <p className="mt-3 text-xs font-semibold tracking-wide text-[#6f5f57]">{loadingPercent}%</p>
        </div>
      </main>
    )
  }

  // Carousel rendered in isolation — no scrapbook visible behind it
  if (showCarousel) {
    return (
      <PhotoCarousel
        images={carouselImages}
        onClose={() => setShowCarousel(false)}
      />
    )
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#fffaf5]">
      <FloatingNatureDecor />

      <section ref={(el) => { sectionRefs.current[0] = el }}>
        <MemoryStack
          heading={content.memoryStack.heading}
          hint={content.memoryStack.hint}
          items={memories}
          instances={scrapbookInstances}
          onOpenLetter={() => revealStep(1)}
        />
      </section>

      {unlockedStep >= 1 && (
        <section
          ref={(el) => { sectionRefs.current[1] = el }}
          className="px-4 py-10 text-center sm:px-6 sm:py-12"
        >
          <div className="mx-auto max-w-3xl">
            <LoveLetter
              heading={content.letter.heading}
              paragraphs={content.letter.paragraphs}
              signature={content.letter.signature}
              cta={content.letter.cta}
              onNext={() => revealStep(2)}
            />
          </div>
        </section>
      )}

      {unlockedStep >= 2 && (
        <section
          ref={(el) => { sectionRefs.current[2] = el }}
          className="px-4 py-10 text-center sm:px-6 sm:py-12"
        >
          <div className="mx-auto max-w-3xl">
            <FinalSection
              title={content.ending.title}
              message={content.ending.message}
              replay={content.ending.replay}
              onReplay={replay}
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default App
