export type MemoryPhoto = {
  id: string
  src: string
  title: string
  caption: string
  note?: string
  date?: string
}

export type ScrapbookVariant = 'hero' | 'normal' | 'mini' | 'crop' | 'faded'

export type ScrapbookInstance = {
  instanceId: string
  photoId: string
  src: string
  x: number
  y: number
  rotate: number
  scale: number
  zIndex: number
  variant: ScrapbookVariant
  crop?: {
    x: number
    y: number
    zoom: number
  }
  opacity?: number
}

type Distribution = Record<ScrapbookVariant, number>

type GenerateScrapbookOptions = {
  totalInstances?: number
  seed?: string
}

const DEFAULT_TOTAL = 200

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const hashSeed = (value: string) => {
  let hash = 1779033703 ^ value.length
  for (let i = 0; i < value.length; i += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(i), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    return (hash ^= hash >>> 16) >>> 0
  }
}

const mulberry32 = (seed: number) => {
  return () => {
    let value = (seed += 0x6d2b79f5)
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

const round2 = (value: number) => Math.round(value * 100) / 100

const getVariantDistribution = (total: number): Distribution => {
  const hero = Math.max(10, Math.round(total * 0.06))
  const normal = Math.round(total * 0.25)
  const mini = Math.round(total * 0.25)
  const crop = Math.round(total * 0.2)
  const faded = total - hero - normal - mini - crop

  return { hero, normal, mini, crop, faded }
}

export function generateScrapbookInstances(
  photos: MemoryPhoto[],
  options: GenerateScrapbookOptions = {},
): ScrapbookInstance[] {
  if (photos.length === 0) return []

  const totalInstances = options.totalInstances ?? DEFAULT_TOTAL
  const seedFactory = hashSeed(options.seed ?? 'scrapbook-default-seed')
  const random = mulberry32(seedFactory())
  const distribution = getVariantDistribution(totalInstances)

  const variants: ScrapbookVariant[] = [
    ...Array.from({ length: distribution.hero }, () => 'hero' as const),
    ...Array.from({ length: distribution.normal }, () => 'normal' as const),
    ...Array.from({ length: distribution.mini }, () => 'mini' as const),
    ...Array.from({ length: distribution.crop }, () => 'crop' as const),
    ...Array.from({ length: distribution.faded }, () => 'faded' as const),
  ]

  for (let i = variants.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[variants[i], variants[j]] = [variants[j], variants[i]]
  }

  return variants.map((variant, index) => {
    const photo = photos[index % photos.length]
    const centeredX = 18 + random() * 64
    const centeredY = 14 + random() * 66
    const spreadX = random() * 94
    const spreadY = random() * 88

    const x = variant === 'hero' ? centeredX : variant === 'faded' ? spreadX : centeredX + (random() * 22 - 11)
    const y = variant === 'hero' ? centeredY : variant === 'faded' ? spreadY : centeredY + (random() * 24 - 12)

    const rotateMap: Record<ScrapbookVariant, number> = {
      hero: random() * 8 - 4,
      normal: random() * 16 - 8,
      mini: random() * 24 - 12,
      crop: random() * 14 - 7,
      faded: random() * 10 - 5,
    }

    const scaleMap: Record<ScrapbookVariant, number> = {
      hero: 1.02 + random() * 0.3,
      normal: 0.86 + random() * 0.26,
      mini: 0.56 + random() * 0.22,
      crop: 0.64 + random() * 0.24,
      faded: 0.78 + random() * 0.2,
    }

    const zBase =
      variant === 'hero'
        ? 80
        : variant === 'normal'
          ? 60
          : variant === 'crop'
            ? 40
            : variant === 'mini'
              ? 30
              : 10

    return {
      instanceId: `${photo.id}-${variant}-${index}`,
      photoId: photo.id,
      src: photo.src,
      x: round2(clamp(x, 2, 95)),
      y: round2(clamp(y, 2, 92)),
      rotate: round2(rotateMap[variant]),
      scale: round2(scaleMap[variant]),
      zIndex: zBase + Math.floor(random() * 18),
      variant,
      crop:
        variant === 'crop'
          ? {
              x: round2(random() * 30),
              y: round2(random() * 30),
              zoom: round2(1.22 + random() * 0.65),
            }
          : undefined,
      opacity:
        variant === 'faded'
          ? round2(0.2 + random() * 0.25)
          : variant === 'mini'
            ? round2(0.7 + random() * 0.2)
            : round2(0.86 + random() * 0.14),
    }
  })
}
