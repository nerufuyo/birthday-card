import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FinalSection } from './components/FinalSection'
import { FloatingNatureDecor } from './components/FloatingNatureDecor'
import { LoveLetter } from './components/LoveLetter'
import { MemoryStack } from './components/MemoryStack'
import { MusicToggle } from './components/MusicToggle'
import { audioContent } from './data/audio'
import { content } from './data/content'
import { memories, scrapbookInstances } from './data/memories'

function App() {
  const [unlockedStep, setUnlockedStep] = useState(0)
  const [musicAutoStartToken, setMusicAutoStartToken] = useState(0)
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
  }

  useEffect(() => {
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
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#fffaf5]">
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

      <AnimatePresence>
        {unlockedStep >= 1 && (
          <motion.section
            ref={(el) => { sectionRefs.current[1] = el }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unlockedStep >= 2 && (
          <motion.section
            ref={(el) => { sectionRefs.current[2] = el }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
