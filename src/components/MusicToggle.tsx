import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type MusicToggleProps = {
  src: string
  label: string
  helperText?: string
  autoStartToken?: number
}

export function MusicToggle({ src, label, helperText, autoStartToken = 0 }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const handledAutoStartTokenRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorText, setErrorText] = useState('')
  const defaultVolume = 0.45

  const stopFade = useCallback(() => {
    if (fadeIntervalRef.current === null) return

    window.clearInterval(fadeIntervalRef.current)
    fadeIntervalRef.current = null
  }, [])

  const fadeIn = useCallback((audio: HTMLAudioElement, targetVolume: number) => {
    stopFade()
    audio.volume = 0
    fadeIntervalRef.current = window.setInterval(() => {
      const nextVolume = Number((audio.volume + 0.05).toFixed(2))

      if (nextVolume >= targetVolume) {
        audio.volume = targetVolume
        stopFade()
        return
      }

      audio.volume = nextVolume
    }, 140)
  }, [stopFade])

  const playAudio = useCallback(async (withFade = false) => {
    const audio = audioRef.current
    if (!audio) return false

    if (!withFade) {
      stopFade()
      audio.volume = defaultVolume
    }

    try {
      await audio.play()
      if (withFade) {
        fadeIn(audio, defaultVolume)
      }
      return true
    } catch {
      return false
    }
  }, [defaultVolume, fadeIn, stopFade])

  const buttonLabel = useMemo(() => {
    return isPlaying ? 'music on' : label
  }, [isPlaying, label])

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = defaultVolume
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    audioRef.current = audio

    return () => {
      stopFade()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audioRef.current = null
    }
  }, [src, stopFade])

  useEffect(() => {
    if (autoStartToken <= 0 || handledAutoStartTokenRef.current === autoStartToken) return

    handledAutoStartTokenRef.current = autoStartToken
    void playAudio(true)
  }, [autoStartToken, playAudio])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    setErrorText('')

    if (isPlaying) {
      stopFade()
      audio.pause()
      return
    }

    const didPlay = await playAudio()
    if (!didPlay) {
      setErrorText('Add your licensed audio file at /public/audio/our-song.mp3')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 flex max-w-[15rem] flex-col items-end gap-1">
      <motion.button
        onClick={() => {
          void togglePlayback()
        }}
        whileTap={{ scale: 0.96 }}
        animate={isPlaying ? { boxShadow: '0 0 0 0 rgba(183,201,168,0.55)' } : { boxShadow: ['0 0 0 0 rgba(183,201,168,0.45)', '0 0 0 10px rgba(183,201,168,0)', '0 0 0 0 rgba(183,201,168,0)'] }}
        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
        className="rounded-full border-2 border-[#d7c8b8] bg-white/95 px-4 py-2 text-sm font-semibold text-[#5b4b45] shadow-[0_8px_20px_-14px_rgba(91,75,69,0.8)] backdrop-blur"
      >
        {isPlaying ? '⏸ ' : '▶ '} {buttonLabel}
      </motion.button>
      {!errorText && helperText && !isPlaying && <p className="rounded-full bg-white/85 px-3 py-1 text-xs text-[#7b665f]">{helperText}</p>}
      {errorText && <p className="rounded-xl bg-white/95 px-3 py-2 text-xs text-[#8b5f58] shadow-sm">{errorText}</p>}
    </div>
  )
}
