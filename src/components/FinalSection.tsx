type FinalSectionProps = {
  title: string
  message: string
  replay: string
  onReplay: () => void
}

export function FinalSection({ title, message, replay, onReplay }: FinalSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#e8d8c6] bg-gradient-to-b from-white to-[#f9f1e8] p-8 shadow-[0_14px_30px_-24px_rgba(91,75,69,0.5)] sm:p-12">
      <span className="absolute left-6 top-5 text-xl opacity-85">
        🎂
      </span>
      <span className="absolute right-6 top-6 text-xl opacity-85">
        🌸
      </span>

      <h2 className="font-hand text-5xl text-[#5b4b45]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[#6b5c56] sm:text-lg">
        {message}
      </p>
      <button
        onClick={onReplay}
        className="mt-8 rounded-full border border-[#d8cabc] bg-white px-6 py-3 font-semibold text-[#5b4b45] transition-transform hover:scale-105 active:scale-95"
      >
        {replay}
      </button>
    </section>
  )
}
