import { motion } from 'framer-motion'
import { HiOutlineMailOpen } from 'react-icons/hi'
import { fadeUp, popIn, staggerContainer } from '../utils/animation'

type IntroHeroProps = {
  title: string
  subtitle: string
  cta: string
  onOpen: () => void
}

export function IntroHero({ title, subtitle, cta, onOpen }: IntroHeroProps) {
  return (
    <motion.section
      className="rounded-[2rem] bg-gradient-to-b from-rose-100 to-[#fff9f7] p-8 shadow-lg shadow-rose-200/40 sm:p-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer}
    >
      <motion.p variants={fadeUp} className="font-hand text-5xl text-rose-600">
        {title}
      </motion.p>
      <motion.p variants={fadeUp} className="mt-2 text-lg text-zinc-700">
        {subtitle}
      </motion.p>
      <motion.div variants={popIn} className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full bg-white px-6 py-4 shadow-md">
        <HiOutlineMailOpen className="text-2xl text-rose-500" aria-hidden />
        <span className="font-hand text-xl text-zinc-800">A sweet message awaits</span>
      </motion.div>
      <motion.button
        variants={popIn}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpen}
        className="mt-8 inline-flex rounded-full bg-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-600/30 transition-colors hover:bg-rose-700"
      >
        {cta}
      </motion.button>
    </motion.section>
  )
}
