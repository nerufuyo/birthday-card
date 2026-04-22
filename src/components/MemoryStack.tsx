import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { MemoryItem } from '../data/memories'
import type { ScrapbookInstance } from '../utils/scrapbook'

type MemoryStackProps = {
  heading: string
  hint: string
  items: MemoryItem[]
  instances: ScrapbookInstance[]
  onOpenLetter: () => void
}

// 7 indices get a subtle breathing highlight animation (pink glow, slight scale)
const HIGHLIGHT_SET = new Set([3, 9, 17, 28, 41, 57, 72])

// Sticky notes scattered around the scene
const STICKY_NOTES = [
  { text: 'you make every day brighter 💛', style: { left: '6%', top: '28%' }, rotate: '-2deg' },
  { text: 'my favorite person 💛', style: { left: '10%', top: '64%' }, rotate: '1.5deg' },
  { text: 'so many little moments with you 💗', style: { right: '4%', top: '20%' }, rotate: '-1deg' },
  { text: 'forever & always 💛', style: { right: '6%', top: '60%' }, rotate: '2deg' },
  { text: 'i love us 🌸', style: { left: '38%', top: '7%' }, rotate: '-3deg' },
]

// Inline flowers scattered at fixed positions inside the scene
const FLOWERS = [
  { symbol: '🌸', left: '22%', top: '16%' },
  { symbol: '🌺', left: '72%', top: '12%' },
  { symbol: '🌷', left: '15%', top: '48%' },
  { symbol: '🌸', left: '82%', top: '44%' },
  { symbol: '🌼', left: '55%', top: '88%' },
]

export function MemoryStack({ heading, hint, instances, onOpenLetter }: MemoryStackProps) {
  const [opened, setOpened] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 50)
    return () => window.clearTimeout(t)
  }, [])

  const handleOpen = () => {
    if (opened) return
    setOpened(true)
    window.setTimeout(onOpenLetter, 700)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#FFF8F2]">
      {/* ── Photo collage layer ── fade in on mount */}
      <div
        className="absolute inset-0"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 600ms ease' }}
      >
        {instances.slice(0, 145).map((instance, index) => {
          const isHighlight = HIGHLIGHT_SET.has(index)
          const hasTape =
            index % 6 === 0 && instance.variant !== 'faded' && instance.variant !== 'mini'

          const sizeClass =
            instance.variant === 'hero'
              ? 'w-32 sm:w-44'
              : instance.variant === 'normal'
                ? 'w-24 sm:w-32'
                : 'w-16 sm:w-24'

          const wrapStyle: React.CSSProperties = {
            left: `${instance.x}%`,
            top: `${instance.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: isHighlight ? instance.zIndex + 10 : instance.zIndex,
          }

          const baseOpacity = instance.opacity ?? 1
          const baseFilter = instance.variant === 'faded' ? 'blur(0.5px)' : 'none'

          return (
            <div key={instance.instanceId} className="absolute" style={wrapStyle}>
              {isHighlight ? (
                <motion.div
                  className={`relative ${sizeClass} rounded-xl border border-[#f0e3d4] bg-white p-[6px] shadow-lg`}
                  style={{
                    rotate: instance.rotate,
                    scale: 1.05,
                    opacity: baseOpacity,
                    boxShadow: '0 10px 30px rgba(255, 183, 197, 0.4)',
                  }}
                  animate={{ scale: [1.05, 1.08, 1.05] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                >
                  {hasTape && (
                    <div className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-[#f0dcc6]/80" />
                  )}
                  <img src={instance.src} alt="" loading="lazy" draggable={false} className="h-20 w-full rounded-lg object-cover sm:h-28" />
                  <span className="absolute -right-1 -top-1 text-[10px] leading-none">✨</span>
                </motion.div>
              ) : (
                <div
                  className={`relative ${sizeClass} rounded-xl border border-[#f0e3d4] bg-white p-[6px] shadow-md`}
                  style={{
                    opacity: baseOpacity,
                    filter: baseFilter,
                    transform: `rotate(${instance.rotate}deg) scale(${instance.scale})`,
                  }}
                >
                  {hasTape && (
                    <div className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-[#f0dcc6]/80" />
                  )}
                  <img src={instance.src} alt="" loading="lazy" draggable={false} className="h-20 w-full rounded-lg object-cover sm:h-28" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Inline flower decorations ── above photos, no animation, no perf cost */}
      {FLOWERS.map((f) => (
        <span
          key={`${f.symbol}-${f.left}`}
          className="pointer-events-none absolute text-2xl opacity-80"
          style={{ left: f.left, top: f.top, zIndex: 95 }}
        >
          {f.symbol}
        </span>
      ))}

      {/* ── Sticky note captions ── */}
      {STICKY_NOTES.map((note) => (
        <div
          key={note.text}
          className="pointer-events-none absolute max-w-[110px] rounded-lg bg-white/90 px-3 py-2 text-xs shadow-sm"
          style={{
            ...note.style,
            zIndex: 96,
            rotate: note.rotate,
            fontFamily: 'var(--font-hand)',
            color: '#7a6259',
            lineHeight: 1.4,
          }}
        >
          {note.text}
        </div>
      ))}

      {/* ── Cake sticker — single motion element, gentle bounce ── */}
      <motion.span
        className="pointer-events-none absolute bottom-10 right-12 text-4xl"
        style={{ zIndex: 97 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        🎂
      </motion.span>

      {/* ── Warm dim overlay — fades in when letter opened ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#f0e6dc]"
        style={{ zIndex: 100 }}
        animate={{ opacity: opened ? 0.5 : 0 }}
        transition={{ duration: 0.45 }}
      />

      {/* ── Top heading text ── */}
      <div className="absolute left-0 right-0 top-7 z-[110] px-4 text-center" style={{ opacity: 0.72 }}>
        <p className="font-hand text-2xl text-[#5e4a40] sm:text-3xl">{heading}</p>
        <p className="mt-1 text-sm text-[#9f8578]">{hint}</p>
      </div>

      {/* ── Center letter card — sole focal animation ── */}
      <div className="absolute inset-0 z-[115] flex items-center justify-center px-5">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, rotate: -1, y: 10 }}
          animate={
            opened
              ? { scale: [1, 1.06, 0.9], opacity: [1, 1, 0], y: [0, -8, -32], rotate: -1 }
              : { scale: 1, opacity: 1, y: 0, rotate: -1 }
          }
          transition={
            opened
              ? { duration: 0.55, ease: 'easeInOut', times: [0, 0.3, 1] }
              : { duration: 0.5, ease: 'easeInOut' }
          }
          whileTap={!opened ? { scale: 1.04 } : {}}
          onClick={handleOpen}
          className="w-full max-w-xs cursor-pointer select-none rounded-2xl border border-[#e4cfb7] bg-[#fff3e8] px-8 py-9 text-center shadow-[0_24px_60px_-28px_rgba(84,62,52,0.6)] sm:max-w-sm"
        >
          <p className="font-hand text-4xl leading-snug text-[#5e4a40] sm:text-5xl">
            soft little moments
            <br />
            that mean everything to me
          </p>
          <p className="mt-5 text-sm font-semibold tracking-wide text-[#9f8578]">
            September 2024 🌸
          </p>
          <p className="mt-4 text-xs tracking-widest text-[#b09b90]">tap anywhere ↓</p>
        </motion.div>
      </div>
    </section>
  )
}
