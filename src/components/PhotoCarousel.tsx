import { useCallback, useEffect, useRef, useState } from 'react'

type PhotoCarouselProps = {
  images: string[]
  onClose: () => void
}

const INTERVAL_MS = 4000
const FADE_MS = 350

export function PhotoCarousel({ images, onClose }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fadingRef = useRef(false)
  const indexRef = useRef(0)
  const total = images.length

  const goToIndex = useCallback(
    (next: number) => {
      if (fadingRef.current) return
      fadingRef.current = true
      setVisible(false)
      setTimeout(() => {
        indexRef.current = next
        setIndex(next)
        setVisible(true)
        fadingRef.current = false
      }, FADE_MS)
    },
    [],
  )

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % total
      goToIndex(next)
    }, INTERVAL_MS)
  }, [total, goToIndex])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const handlePrev = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    goToIndex((indexRef.current - 1 + total) % total)
    startTimer()
  }

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    goToIndex((indexRef.current + 1) % total)
    startTimer()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
      style={{ contain: 'strict', paddingTop: 'max(0.75rem, env(safe-area-inset-top))', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
        aria-label="close carousel"
      >
        ✕
      </button>

      {/* counter */}
      <p className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-white/60" style={{ top: 'max(0.9rem, env(safe-area-inset-top))' }}>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>

      {/* image */}
      <div className="relative flex h-full w-full items-center justify-center px-4 pt-12 sm:px-14">
        <img
          src={images[index]}
          alt={`memory ${index + 1}`}
          loading="eager"
          decoding="async"
          className="max-h-[76vh] max-w-full rounded-2xl object-contain shadow-2xl sm:max-h-[82vh]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.97)',
            transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
            willChange: 'opacity, transform',
          }}
        />

        {/* preload next image off-screen */}
        <img
          src={images[(index + 1) % total]}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="pointer-events-none absolute opacity-0"
          style={{ width: 1, height: 1 }}
        />
      </div>

      {/* nav */}
      <div
        className="absolute left-1/2 flex w-[min(94vw,32rem)] -translate-x-1/2 items-center justify-between gap-2 rounded-full bg-white/10 px-2 py-2 backdrop-blur sm:gap-4 sm:px-3"
        style={{ bottom: 'max(0.75rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}
      >
        <button
          onClick={handlePrev}
          className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 sm:px-5"
        >
          ← prev
        </button>

        {/* progress bar */}
        <div className="h-1 w-20 overflow-hidden rounded-full bg-white/20 sm:w-52">
          <div
            className="h-full rounded-full bg-white/80"
            style={{
              width: `${((index + 1) / total) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <button
          onClick={handleNext}
          className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 sm:px-5"
        >
          next →
        </button>
      </div>
    </div>
  )
}
