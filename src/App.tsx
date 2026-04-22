import { useEffect, useRef, useState } from 'react'
import { FinalSection } from './components/FinalSection'
import { FloatingNatureDecor } from './components/FloatingNatureDecor'
import { LoveLetter } from './components/LoveLetter'
import { MemoryStack } from './components/MemoryStack'
import { PhotoCarousel } from './components/PhotoCarousel'
import { audioContent } from './data/audio'
import { content } from './data/content'
import { memories } from './data/memories'

const carouselImages = memories.map((m) => m.image)

// Only preload the first N images before showing the page — the rest lazy-load
const INITIAL_BATCH = 8

function App() {
  const [unlockedStep, setUnlockedStep] = useState(0)
  const [showCarousel, setShowCarousel] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const musicStartedRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  // ── Preload initial batch of images + audio, then show page ──
  useEffect(() => {
    let cancelled = false

    const imageSources = Array.from(new Set(memories.map((m) => m.image)))
    const initialSources = imageSources.slice(0, INITIAL_BATCH)
    const totalInitial = initialSources.length + 1 // +1 for audio
    let loadedCount = 0

    const tick = () => {
      if (cancelled) return
      loadedCount += 1
      setLoadingPercent(Math.round((loadedCount / totalInitial) * 100))

      if (loadedCount >= totalInitial) {
        // Small delay so the bar visually hits 100% before fading
        setTimeout(() => {
          if (!cancelled) setAssetsReady(true)
        }, 80)
      }
    }

    // Preload first batch of images
    for (const src of initialSources) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = tick
      img.onerror = tick
      img.src = src
    }

    // Preload audio (reuse same element for playback later)
    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = audioContent.source
    audio.oncanplaythrough = () => {
      audio.oncanplaythrough = null
      tick()
    }
    audio.onerror = () => {
      audio.onerror = null
      tick()
    }
    audio.load()
    audioRef.current = audio

    // ── Progressively preload the rest in small batches (after page shown) ──
    const remainingSources = imageSources.slice(INITIAL_BATCH)
    let batchIndex = 0
    const BATCH_SIZE = 4

    const preloadNextBatch = () => {
      if (cancelled || batchIndex >= remainingSources.length) return

      const batch = remainingSources.slice(batchIndex, batchIndex + BATCH_SIZE)
      batchIndex += BATCH_SIZE
      let done = 0

      for (const src of batch) {
        const img = new Image()
        img.decoding = 'async'
        img.onload = img.onerror = () => {
          done += 1
          if (done >= batch.length) {
            // Wait a frame before starting next batch to avoid blocking the main thread
            requestAnimationFrame(() => preloadNextBatch())
          }
        }
        img.src = src
      }
    }

    // Start background preloading once the initial batch is ready
    const checkAndStart = setInterval(() => {
      if (loadedCount >= totalInitial || cancelled) {
        clearInterval(checkAndStart)
        if (!cancelled) preloadNextBatch()
      }
    }, 200)

    return () => {
      cancelled = true
      clearInterval(checkAndStart)
    }
  }, [])

  // ── Music: start on first user interaction, share the pre-loaded audio element ──
  useEffect(() => {
    const startMusic = () => {
      if (musicStartedRef.current) return
      musicStartedRef.current = true

      const audio = audioRef.current
      if (audio) {
        audio.loop = true
        audio.volume = 0.45
        audio.play().catch(() => { })
      }
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
      audioRef.current?.pause()
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
