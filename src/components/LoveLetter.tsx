import { memories } from '../data/memories'

type LoveLetterProps = {
  heading: string
  paragraphs: readonly string[]
  signature: string
  cta: string
  onNext: () => void
}

export function LoveLetter({ heading, paragraphs, signature, cta, onNext }: LoveLetterProps) {
  return (
    <section className="relative mx-auto max-w-2xl">
      {/* Notebook paper — ruled lines via CSS background */}
      <div
        className="relative rounded-[1.6rem] p-8 sm:p-12"
        style={{
          background:
            'linear-gradient(#FFF8F2 0, #FFF8F2 calc(2rem - 1px), #e8d8c6 calc(2rem), #FFF8F2 2rem)',
          backgroundSize: '100% 2rem',
          backgroundOrigin: 'content-box',
          boxShadow: '0 12px 40px -20px rgba(91,75,69,0.35)',
        }}
      >
        {/* Notebook holes — decorative left margin */}
        <div className="absolute left-7 top-0 flex h-full flex-col items-center justify-evenly py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-4 rounded-full border border-[#e0cfc0] bg-[#FFF8F2] shadow-inner"
            />
          ))}
        </div>

        {/* Pink tape strip at top */}
        <div className="absolute -top-2 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-1deg] rounded-sm bg-[#F7C6C7]/70" />

        {/* Side polaroid */}
        <div className="absolute -right-6 top-10 hidden rotate-[3deg] sm:block">
          <div className="w-20 rounded-lg border border-[#f0e3d4] bg-white p-[5px] shadow-md">
            <img
              src={memories[0].image}
              alt="our memory"
              className="h-16 w-full rounded-md object-cover"
            />
            <p className="mt-1 text-center font-['Caveat'] text-[9px] text-[#9f8578]">sugarplum + cupcake ♡</p>
          </div>
        </div>

        <div className="ml-8 sm:ml-10">
          <h2 className="text-4xl text-[#5b4b45] sm:text-5xl" style={{ fontFamily: 'var(--font-hand2)' }}>
            {heading}
          </h2>

          <div className="mt-6 space-y-4 text-left text-base leading-loose text-[#6b5b53] sm:text-lg">
            {paragraphs.map((line) => (
              <p key={line}>
                {line}
              </p>
            ))}
          </div>

          <p className="mt-8 whitespace-pre-line text-[#8b5f58] sm:text-xl" style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem' }}>
            {signature}
          </p>

          <button
            onClick={onNext}
            className="mt-8 rounded-full bg-[#b7c9a8] px-6 py-3 font-semibold text-[#3f3a36] transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            {cta}
          </button>
        </div>
      </div>
    </section>
  )
}
