import { useMemo, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { MemoryItem } from '../data/memories'
import { fadeUp, popIn, staggerContainer } from '../utils/animation'

type MemorySlideshowProps = {
  heading: string
  subheading: string
  cta: string
  memories: MemoryItem[]
  startPhotoId?: string
  onNext: () => void
}

export function MemorySlideshow({ heading, subheading, cta, memories, startPhotoId, onNext }: MemorySlideshowProps) {
  const initialIndex = startPhotoId ? Math.max(0, memories.findIndex((item) => item.id === startPhotoId)) : 0
  const [index, setIndex] = useState(initialIndex)
  const touchStartX = useRef<number | null>(null)

  const total = memories.length
  const activeMemory = memories[index]

  const pageLabel = useMemo(() => {
    const left = String(index + 1).padStart(2, '0')
    const right = String(total).padStart(2, '0')
    return `${left} / ${right}`
  }, [index, total])

  const next = () => setIndex((value) => (value + 1) % total)
  const prev = () => setIndex((value) => (value - 1 + total) % total)

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0].clientX
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return

    const delta = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null

    if (delta > 45) prev()
    if (delta < -45) next()
  }

  return (
    <motion.section
      className="rounded-[2rem] border border-[#e8d8c6] bg-[#fffaf5] p-6 text-left shadow-[0_14px_30px_-24px_rgba(91,75,69,0.5)] sm:p-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.h2 variants={fadeUp} className="font-hand text-4xl text-[#5b4b45] sm:text-5xl">
        {heading}
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-2 text-sm text-[#7b665f] sm:text-base">
        {subheading}
      </motion.p>

      <div className="mt-6" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="wait">
          <motion.figure
            key={activeMemory.id}
            initial={{ opacity: 0, x: 26, scale: 0.98, rotate: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -26, scale: 0.98, rotate: -0.8 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="relative rounded-3xl border border-[#efdfcd] bg-white p-3 shadow-md"
          >
            <span className="absolute left-4 top-3 -rotate-6 rounded-md bg-[#f3dfca] px-3 py-1 text-[11px] font-semibold text-[#735b52]">
              {activeMemory.date ?? 'our memory'}
            </span>
            <span className="absolute right-4 top-4 text-xl">🌸</span>

            <img
              src={activeMemory.image}
              alt={activeMemory.caption}
              loading="lazy"
              className="h-72 w-full rounded-2xl object-cover sm:h-[24rem]"
            />
            <figcaption className="space-y-2 px-2 pb-2 pt-4">
              <p className="font-hand text-3xl text-[#5b4b45]">{activeMemory.title}</p>
              <p className="text-sm text-[#6b5c56] sm:text-base">{activeMemory.caption}</p>
              {activeMemory.note && (
                <p className="inline-flex rounded-full bg-[#f9d7da] px-3 py-1 text-xs text-[#6a4f4b]">
                  {activeMemory.note}
                </p>
              )}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button onClick={prev} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5b4b45] shadow-sm">
          ← prev
        </button>
        <p className="text-sm font-semibold text-[#7b665f]">{pageLabel}</p>
        <button onClick={next} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5b4b45] shadow-sm">
          next →
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {memories.map((memory, memoryIndex) => (
          <button
            key={memory.id}
            onClick={() => setIndex(memoryIndex)}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition ${
              memoryIndex === index ? 'border-[#b7c9a8]' : 'border-transparent opacity-80'
            }`}
          >
            <img src={memory.image} alt={memory.title} loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <motion.button
        variants={popIn}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="mt-7 rounded-full bg-[#b7c9a8] px-6 py-3 font-semibold text-[#3f3a36]"
      >
        {cta}
      </motion.button>
    </motion.section>
  )
}
