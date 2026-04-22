import { motion } from 'framer-motion'
import { fadeUp, popIn, staggerContainer } from '../utils/animation'

type IntroSectionProps = {
  title: string
  subtitle: string
  cta: string
  onOpen: () => void
}

export function IntroSection({ title, subtitle, cta, onOpen }: IntroSectionProps) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-[2.2rem] border border-[#e9d9c8] bg-gradient-to-b from-[#fffaf5] to-[#f6eee4] p-8 shadow-[0_16px_38px_-24px_rgba(91,75,69,0.55)] sm:p-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer}
    >
      <motion.span
        variants={popIn}
        className="absolute left-5 top-4 rotate-[-8deg] rounded-lg bg-[#f9d7da] px-3 py-1 text-xs font-semibold tracking-wide text-[#6a4f4b] shadow-sm"
      >
        birthday scrapbook
      </motion.span>

      <motion.span variants={popIn} className="absolute right-5 top-5 text-2xl sm:text-3xl">
        🎂🌸
      </motion.span>

      <motion.p variants={fadeUp} className="mt-4 font-hand text-5xl text-[#5b4b45] sm:text-6xl">
        {title}
      </motion.p>
      <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-base text-[#6a5851] sm:text-lg">
        {subtitle}
      </motion.p>

      <motion.div
        variants={popIn}
        className="mx-auto mt-8 w-fit rounded-2xl border border-[#e8d8c6] bg-white/95 px-5 py-3 text-[#7b665f] shadow-[0_8px_18px_-14px_rgba(91,75,69,0.8)]"
      >
        🌸🍃💌🧁
      </motion.div>

      <motion.button
        variants={popIn}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onOpen}
        className="mt-8 inline-flex rounded-full border border-[#94a87f] bg-[#b7c9a8] px-6 py-3 font-semibold text-[#3f3a36] shadow-sm transition-colors hover:bg-[#a9be98]"
      >
        {cta}
      </motion.button>

      <motion.span variants={fadeUp} className="absolute bottom-5 left-6 rotate-[-6deg] text-xl opacity-80">
        🎀
      </motion.span>
    </motion.section>
  )
}
