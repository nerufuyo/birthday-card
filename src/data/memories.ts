import { generateScrapbookInstances, type MemoryPhoto } from '../utils/scrapbook'

export type MemoryItem = {
  id: string
  image: string
  title: string
  caption: string
  note?: string
  date?: string
}

export const memories: MemoryItem[] = [
  {
    id: 'm-001',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    title: 'one of my favorite days',
    caption: 'That smile still fixes my whole day.',
    note: 'my favorite smile',
    date: 'May 2023',
  },
  {
    id: 'm-002',
    image:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    title: 'our cozy adventure',
    caption: 'This day felt soft, easy, and full of warmth.',
    note: 'thank you for being part of my life',
    date: 'August 2023',
  },
  {
    id: 'm-003',
    image:
      'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?auto=format&fit=crop&w=800&q=80',
    title: 'tiny happy moments',
    caption: 'You looked so cute here. I love this laugh.',
    note: 'this memory still makes me smile',
    date: 'January 2024',
  },
  {
    id: 'm-004',
    image:
      'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=800&q=80',
    title: 'my peaceful place',
    caption: 'My peaceful place is always with you.',
    note: 'one of my forever favorites',
    date: 'September 2024',
  },
]

export const memoryPhotos: MemoryPhoto[] = memories.map((item) => ({
  id: item.id,
  src: item.image,
  title: item.title,
  caption: item.caption,
  note: item.note,
  date: item.date,
}))

export const scrapbookInstances = generateScrapbookInstances(memoryPhotos, {
  totalInstances: 200,
  seed: 'birthday-scrapbook-2026',
})
