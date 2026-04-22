const decor = [
  { symbol: '🌸', left: '8%', top: '10%', duration: 7 },
  { symbol: '🍃', left: '88%', top: '14%', duration: 8 },
  { symbol: '☁️', left: '16%', top: '78%', duration: 10 },
  { symbol: '✨', left: '84%', top: '72%', duration: 9 },
  { symbol: '🌼', left: '48%', top: '86%', duration: 8.5 },
]

export function FloatingNatureDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {decor.map((item) => (
        <span
          key={`${item.symbol}-${item.left}`}
          className="absolute text-xl opacity-55"
          style={{ left: item.left, top: item.top }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  )
}
