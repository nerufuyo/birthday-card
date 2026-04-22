import { useState } from 'react'
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

  const handleOpen = () => {
    if (opened) return
    setOpened(true)
    window.setTimeout(onOpenLetter, 700)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#FFF8F2]">
      <div className="absolute inset-0">
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
              <div
                className={`relative ${sizeClass} rounded-xl border border-[#f0e3d4] bg-white p-[6px] ${isHighlight ? 'shadow-lg' : 'shadow-md'}`}
                style={{
                  opacity: baseOpacity,
                  filter: baseFilter,
                  boxShadow: isHighlight ? '0 10px 30px rgba(255, 183, 197, 0.3)' : undefined,
                  transform: `rotate(${instance.rotate}deg) scale(${isHighlight ? 1.05 : instance.scale})`,
                }}
              >
                {hasTape && (
                  <div className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-[#f0dcc6]/80" />
                )}
                <img src={instance.src} alt="" loading="lazy" draggable={false} className="h-20 w-full rounded-lg object-cover sm:h-28" />
                {isHighlight && <span className="absolute -right-1 -top-1 text-[10px] leading-none">✨</span>}
              </div>
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

      <span className="pointer-events-none absolute bottom-10 right-12 text-4xl" style={{ zIndex: 97 }}>
        🎂
      </span>

      <div
        className="pointer-events-none absolute inset-0 bg-[#f0e6dc]"
        style={{ zIndex: 100, opacity: opened ? 0.5 : 0, transition: 'opacity 220ms ease-out' }}
      />

      {/* ── Top heading text ── */}
      <div className="absolute left-0 right-0 top-7 z-[110] px-4 text-center" style={{ opacity: 0.72 }}>
        <p className="font-hand text-2xl text-[#5e4a40] sm:text-3xl">{heading}</p>
        <p className="mt-1 text-sm text-[#9f8578]">{hint}</p>
      </div>

      {/* ── Center letter card — sole focal animation ── */}
      <div className="absolute inset-0 z-[115] flex items-center justify-center px-5">
        <div
          onClick={handleOpen}
          className={`w-full max-w-xs cursor-pointer select-none rounded-2xl border border-[#e4cfb7] bg-[#fff3e8] px-8 py-9 text-center shadow-[0_24px_60px_-28px_rgba(84,62,52,0.6)] transition-all duration-300 sm:max-w-sm ${opened ? 'translate-y-[-16px] scale-95 opacity-0' : 'scale-100 opacity-100 active:scale-[1.02]'}`}
          style={{ rotate: '-1deg' }}
        >
          <p className="font-hand text-4xl leading-snug text-[#5e4a40] sm:text-5xl">
            soft little moments
            <br />
            that mean everything to me
          </p>
          <p className="mt-5 text-sm font-semibold tracking-wide text-[#9f8578]">
            23 April 2001 🌸
          </p>
          <p className="mt-4 text-xs tracking-widest text-[#b09b90]">tap anywhere ↓</p>
        </div>
      </div>
    </section>
  )
}
