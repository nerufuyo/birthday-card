import { useEffect, useRef, useState } from 'react'
import { FinalSection } from './components/FinalSection'
import { FloatingNatureDecor } from './components/FloatingNatureDecor'
import { LoveLetter } from './components/LoveLetter'
import { MemoryStack } from './components/MemoryStack'
import { MusicToggle } from './components/MusicToggle'
import { PhotoCarousel } from './components/PhotoCarousel'
import { audioContent } from './data/audio'
import { content } from './data/content'
import { memories, scrapbookInstances } from './data/memories'

const carouselImages = memories.map((m) => m.image)

function App() {
  const [unlockedStep, setUnlockedStep] = useState(0)
  const [musicAutoStartToken, setMusicAutoStartToken] = useState(0)
  const [showCarousel, setShowCarousel] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const hasAutoStartedMusicRef = useRef(false)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])

  const triggerMusicStart = () => {
    if (hasAutoStartedMusicRef.current) return

    hasAutoStartedMusicRef.current = true
    setMusicAutoStartToken((value) => value + 1)
  }

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

  useEffect(() => {
    if (!assetsReady) return

    const onFirstInteraction = () => {
      triggerMusicStart()
      detach()
    }

    const detach = () => {
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
      window.removeEventListener('touchstart', onFirstInteraction)
      window.removeEventListener('wheel', onFirstInteraction)
    }

    window.addEventListener('pointerdown', onFirstInteraction, { passive: true })
    window.addEventListener('keydown', onFirstInteraction)
    window.addEventListener('touchstart', onFirstInteraction, { passive: true })
    window.addEventListener('wheel', onFirstInteraction, { passive: true })

    return detach
  }, [assetsReady])

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

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#fffaf5]">
      {showCarousel && (
        <PhotoCarousel
          images={carouselImages}
          onClose={() => setShowCarousel(false)}
        />
      )}
      <FloatingNatureDecor />
      <MusicToggle
        src={audioContent.source}
        label={audioContent.label}
        helperText={audioContent.helperText}
        autoStartToken={musicAutoStartToken}
      />

      <section ref={(el) => { sectionRefs.current[0] = el }}>
        <MemoryStack
          heading={content.memoryStack.heading}
          hint={content.memoryStack.hint}
          items={memories}
          instances={scrapbookInstances}
          onOpenLetter={() => {
            triggerMusicStart()
            revealStep(1)
          }}
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
