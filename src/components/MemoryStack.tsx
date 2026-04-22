import { useState } from 'react'
import type { MemoryItem } from '../data/memories'

type MemoryStackProps = {
  heading: string
  hint: string
  items: MemoryItem[]
  onOpenLetter: () => void
}

// Sticky notes with Sugarplum & Cupcake nicknames
const STICKY_NOTES = [
  { text: 'sugarplum loves cupcake 💛', style: { left: '3%', top: '18%' } as React.CSSProperties, rotate: '-2deg' },
  { text: 'cupcake is sugarplum\'s fav 🍰', style: { left: '5%', bottom: '12%' } as React.CSSProperties, rotate: '1.5deg' },
  { text: 'sugarplum🍭 × cupcake🍰 💗', style: { right: '3%', top: '14%' } as React.CSSProperties, rotate: '-1deg' },
  { text: 'forever & always 💛', style: { right: '4%', bottom: '14%' } as React.CSSProperties, rotate: '2deg' },
]

/**
 * Full-screen photo mosaic with 40 images filling the viewport.
 * Uses a CSS grid with varying row-span sizes for visual variety.
 * The center card overlays everything as a CTA.
 */
export function MemoryStack({ heading, hint, items, onOpenLetter }: MemoryStackProps) {
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    if (opened) return
    setOpened(true)
    window.setTimeout(onOpenLetter, 700)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#FFF8F2]">
      {/* ── Photo mosaic grid ── */}
      <div
        className="absolute inset-0 grid gap-[3px]"
        style={{
          contain: 'layout style paint',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridAutoRows: 'calc(100vh / 10)',
        }}
      >
        {items.map((item, i) => {
          // Determine span: every 5th photo gets a larger tile for visual variety
          const isBig = i % 5 === 0
          const isWide = i % 7 === 3

          const colSpan = isBig ? 2 : isWide ? 2 : 1
          const rowSpan = isBig ? 2 : i % 3 === 0 ? 2 : 1

          // Slight random rotation per tile for scrapbook feel
          const rotations = [-1.5, 0.8, -0.5, 1.2, 0, -0.8, 0.6, -1, 1.5, 0.3]
          const rotate = rotations[i % rotations.length]

          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-md border border-[#f0e3d4] bg-white p-[2px] shadow-sm"
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                transform: `rotate(${rotate}deg)`,
                contain: 'layout paint',
              }}
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full rounded-[5px] object-cover"
              />
            </div>
          )
        })}
      </div>

      {/* ── Soft vignette overlay so the center card pops ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 90,
          background: 'radial-gradient(ellipse at center, rgba(255,248,242,0.45) 0%, rgba(255,248,242,0.85) 60%, rgba(240,230,220,0.95) 100%)',
        }}
      />

      {/* ── Sticky note captions ── */}
      {STICKY_NOTES.map((note) => (
        <div
          key={note.text}
          className="pointer-events-none absolute max-w-[120px] rounded-lg bg-white/90 px-3 py-2 text-xs shadow-sm"
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

      {/* ── Dim overlay when opened ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#f0e6dc]"
        style={{ zIndex: 100, opacity: opened ? 0.5 : 0, transition: 'opacity 220ms ease-out' }}
      />

      {/* ── Top heading text ── */}
      <div className="absolute left-0 right-0 top-7 z-[110] px-4 text-center">
        <p className="font-hand text-2xl text-[#5e4a40] sm:text-3xl" style={{ textShadow: '0 1px 8px rgba(255,248,242,0.9)' }}>{heading}</p>
        <p className="mt-1 text-sm text-[#9f8578]" style={{ textShadow: '0 1px 6px rgba(255,248,242,0.9)' }}>{hint}</p>
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
            that mean everything
          </p>
          <p className="mt-5 text-sm font-semibold tracking-wide text-[#9f8578]">
            sugarplum🍭 × cupcake🍰
          </p>
          <p className="mt-1 text-xs text-[#b09b90]">23 April 2001 🌸</p>
          <p className="mt-4 text-xs tracking-widest text-[#b09b90]">tap anywhere ↓</p>
        </div>
      </div>
    </section>
  )
}
