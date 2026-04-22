import { motion } from 'framer-motion'
import { fadeUp, popIn, staggerContainer } from '../utils/animation'

type FinalSectionProps = {
  title: string
  message: string
  replay: string
  onReplay: () => void
}

export function FinalSection({ title, message, replay, onReplay }: FinalSectionProps) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-[2rem] border border-[#e8d8c6] bg-gradient-to-b from-white to-[#f9f1e8] p-8 shadow-[0_14px_30px_-24px_rgba(91,75,69,0.5)] sm:p-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={staggerContainer}
    >
      <motion.span variants={popIn} className="absolute left-6 top-5 text-xl opacity-85">
        🎂
      </motion.span>
      <motion.span variants={popIn} className="absolute right-6 top-6 text-xl opacity-85">
        🌸
      </motion.span>

      <motion.h2 variants={fadeUp} className="font-hand text-5xl text-[#5b4b45]">
        {title}
      </motion.h2>
      <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[#6b5c56] sm:text-lg">
        {message}
      </motion.p>
      <motion.button
        variants={popIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReplay}
        className="mt-8 rounded-full border border-[#d8cabc] bg-white px-6 py-3 font-semibold text-[#5b4b45]"
      >
        {replay}
      </motion.button>
    </motion.section>
  )
}
