import { motion } from 'framer-motion'
import { fadeUp, popIn, staggerContainer } from '../utils/animation'

type AttachmentRevealProps = {
  title: string
  subtitle: string
  cta: string
  onNext: () => void
}

const stickers = ['🎂', '⭐', '🎉', '🎈', '💖']

export function AttachmentReveal({ title, subtitle, cta, onNext }: AttachmentRevealProps) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-600 via-red-600 to-rose-500 p-8 text-white shadow-xl sm:p-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer}
    >
      <motion.h2 variants={fadeUp} className="font-hand text-4xl sm:text-5xl">
        {title}
      </motion.h2>
      <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-rose-50/95 sm:text-lg">
        {subtitle}
      </motion.p>

      <motion.div variants={popIn} className="mx-auto mt-8 w-full max-w-sm rounded-3xl bg-white p-3 shadow-2xl sm:max-w-md">
        <img
          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80"
          alt="Birthday collage style portrait"
          loading="lazy"
          className="h-72 w-full rounded-2xl object-cover"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        {stickers.map((sticker, index) => (
          <motion.span
            key={sticker}
            className="absolute text-3xl"
            style={{ left: `${12 + index * 18}%`, top: `${12 + (index % 2) * 70}%` }}
            initial={{ opacity: 0, scale: 0.2, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 + index * 0.08, stiffness: 230, damping: 15 }}
          >
            {sticker}
          </motion.span>
        ))}
      </div>

      <motion.button
        variants={popIn}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-rose-600"
      >
        {cta}
      </motion.button>
    </motion.section>
  )
}
