import { motion, useReducedMotion } from 'framer-motion'

const deco = [
  { symbol: '💗', left: '10%', top: '8%', duration: 4.5 },
  { symbol: '🌸', left: '80%', top: '14%', duration: 6 },
  { symbol: '🍃', left: '18%', top: '72%', duration: 5.5 },
  { symbol: '✨', left: '87%', top: '65%', duration: 7 },
  { symbol: '💌', left: '48%', top: '84%', duration: 6.5 },
]

export function FloatingDecor() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {deco.map((item) => (
        <motion.span
          key={`${item.symbol}-${item.left}`}
          className="absolute text-xl opacity-60"
          style={{ left: item.left, top: item.top }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -10, 0],
                  rotate: [0, -5, 5, 0],
                }
          }
          transition={{
            duration: item.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          {item.symbol}
        </motion.span>
      ))}
    </div>
  )
}
