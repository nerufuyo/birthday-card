# Birthday Mail for My Love 💌

Peaceful scrapbook-style birthday microsite built with:

- Vite + React + TypeScript
- Tailwind CSS (v4)
- Framer Motion

## Experience flow

1. Soft intro greeting
2. Collapsed memory stack (tap to open)
3. Animated memory slideshow (swipe/next/prev)
4. Gentle love letter
5. Warm final closing + replay
6. Floating music toggle (persistent)

## Run locally

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
npm run lint
```

## Personalize content

### Main copy

Edit `src/data/content.ts`:

- girlfriend name
- intro text
- slideshow labels
- love letter paragraphs
- final message

### Memory slides

Edit `src/data/memories.ts`:

- image URLs
- title/caption/note/date per memory

Recommended image size: around 800–1200px wide, compressed JPG/WebP.

### Music

Edit `src/data/audio.ts` for label/source and add your licensed audio file to:

- `public/audio/our-song.mp3`

If the file is missing, the UI shows a helpful prompt.

## Project structure

```txt
src/
  components/
    IntroSection.tsx
    MemoryStack.tsx
    MemorySlideshow.tsx
    LoveLetter.tsx
    FinalSection.tsx
    MusicToggle.tsx
    FloatingNatureDecor.tsx
  data/
    content.ts
    memories.ts
    audio.ts
  utils/
    animation.ts
```

## Notes

- Palette is tuned for cream/blush/peach/sage calm mood.
- Motion respects reduced-motion settings for decorative float effects.
- Mobile swipe is supported in slideshow transitions.
