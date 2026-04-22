import { motion } from 'framer-motion'
import { fadeUp, popIn, staggerContainer } from '../utils/animation'

type EmailCardProps = {
  from: string
  to: string
  subject: string
  message: string
  cta: string
  onNext: () => void
}

export function EmailCard({ from, to, subject, message, cta, onNext }: EmailCardProps) {
  return (
    <motion.section
      className="rounded-[2rem] bg-rose-600 p-7 text-left text-rose-50 shadow-xl shadow-rose-900/20 sm:p-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer}
    >
      <motion.h2 variants={fadeUp} className="font-hand text-4xl text-white">
        new message 💌
      </motion.h2>
      <motion.div variants={fadeUp} className="mt-5 space-y-2 text-sm sm:text-base">
        <p><span className="font-semibold">From:</span> {from}</p>
        <p><span className="font-semibold">To:</span> {to}</p>
        <p><span className="font-semibold">Subject:</span> {subject}</p>
      </motion.div>
      <motion.p variants={fadeUp} className="mt-6 rounded-2xl bg-white/15 p-4 text-base leading-relaxed sm:text-lg">
        {message}
      </motion.p>
      <motion.button
        variants={popIn}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className="mt-6 border-b-2 border-transparent font-hand text-2xl text-white transition hover:border-white"
      >
        {cta}
      </motion.button>
    </motion.section>
  )
}
