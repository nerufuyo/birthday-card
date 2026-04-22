import { useCallback, useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'

type PhotoCarouselProps = {
    images: string[]
    onClose: () => void
}

const INTERVAL_MS = 4000
const FADE_MS = 300

export function PhotoCarousel({ images, onClose }: PhotoCarouselProps) {
    const [index, setIndex] = useState(0)
    const [visible, setVisible] = useState(true)
    const [imgLoaded, setImgLoaded] = useState(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const fadingRef = useRef(false)
    const indexRef = useRef(0)
    const touchStartXRef = useRef<number | null>(null)
    const total = images.length

    const goToIndex = useCallback(
        (next: number) => {
            if (fadingRef.current) return
            fadingRef.current = true
            setVisible(false)
            setTimeout(() => {
                indexRef.current = next
                setIndex(next)
                setImgLoaded(false)
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
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [startTimer])

    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev }
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

    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        touchStartXRef.current = e.changedTouches[0].clientX
    }

    const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (touchStartXRef.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartXRef.current
        touchStartXRef.current = null
        if (delta > 45) handlePrev()
        else if (delta < -45) handleNext()
    }

    // Preload the next 2 images via JS (no extra DOM nodes needed)
    useEffect(() => {
        const next1 = (index + 1) % total
        const next2 = (index + 2) % total
        const img1 = new Image()
        img1.src = images[next1]
        const img2 = new Image()
        img2.src = images[next2]
    }, [index, images, total])

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col bg-[#1a1410]"
            style={{
                paddingTop: 'max(3rem, env(safe-area-inset-top))',
                paddingBottom: 'max(4.5rem, env(safe-area-inset-bottom))',
                contain: 'layout style paint',
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* top bar */}
            <div className="flex shrink-0 items-center justify-between px-4 pb-2">
                <p className="text-xs font-semibold text-white/50">
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </p>
                <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-white active:bg-white/20"
                    aria-label="close"
                >
                    ✕
                </button>
            </div>

            {/* image area */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3">
                {/* per-image loading spinner */}
                {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                    </div>
                )}

                <img
                    key={index}
                    src={images[index]}
                    alt={`memory ${index + 1}`}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setImgLoaded(true)}
                    className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                    style={{
                        opacity: visible && imgLoaded ? 1 : 0,
                        transform: visible && imgLoaded ? 'scale(1)' : 'scale(0.97)',
                        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
                        willChange: 'opacity, transform',
                    }}
                />
            </div>

            {/* bottom controls */}
            <div className="flex shrink-0 items-center justify-between gap-2 px-4 pt-2">
                <button
                    onClick={handlePrev}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white active:bg-white/20"
                >
                    ← prev
                </button>

                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                    <div
                        className="h-full rounded-full bg-white/70"
                        style={{ width: `${((index + 1) / total) * 100}%`, transition: 'width 0.3s ease' }}
                    />
                </div>

                <button
                    onClick={handleNext}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white active:bg-white/20"
                >
                    next →
                </button>
            </div>
        </div>
    )
}
