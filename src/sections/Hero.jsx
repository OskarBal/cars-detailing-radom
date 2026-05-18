import { useEffect, useState } from 'react'

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <section
      id="hero"
      aria-label="Cars Detailing Radom — premium auto detailing"
      className="relative isolate overflow-hidden bg-noir-deep min-h-svh md:h-dvh md:min-h-dvh grid grid-rows-[1fr_auto] gap-6 px-6 md:px-10 pt-24 md:pt-28 pb-7 md:pb-12"
    >
      {/* BG image */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-[position:62%_center]"
        style={{ backgroundImage: "url('/hero-bg.webp')" }}
      />

      {/* Content stack */}
      <div className="relative flex flex-col h-full justify-between max-w-full md:max-w-[42vw] lg:max-w-[38vw] gap-5 md:gap-7">

        <div className="space-y-5 md:space-y-7">
          <p
            className="text-accent font-display font-bold text-[11.5px] md:text-[13px] tracking-[0.22em] md:tracking-[0.28em] uppercase"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,.7), 0 4px 14px rgba(0,0,0,.6)' }}
          >
            Detailing &amp; Car Care
          </p>

          <h1 className="font-impact italic font-black uppercase leading-[0.92] tracking-[-0.012em] text-[clamp(2.8rem,12vw,6.4rem)] md:text-[clamp(3rem,8.4vw,7rem)]">
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(118deg, #FAFAFC 0%, #E0E1E4 14%, #8A8C90 32%, #BCBEC2 44%, #5E6064 54%, #C5C7CB 70%, #EAECEE 88%, #FAFAFC 100%)',
                filter: 'drop-shadow(0 2px 0 rgba(0,0,0,.5)) drop-shadow(0 12px 28px rgba(0,0,0,.65))',
              }}
            >
              PERFEKCJA
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(180deg, #E04035 0%, #C42018 22%, #A2170F 48%, #6E120D 78%, #3F0807 100%)',
                filter: 'drop-shadow(0 2px 0 rgba(0,0,0,.5)) drop-shadow(0 12px 28px rgba(184,33,25,.22))',
              }}
            >
              W&nbsp;KAŻDYM DETALU
            </span>
          </h1>

          <p
            className="text-noir-bright md:text-noir-muted text-base md:text-[clamp(0.98rem,1.15vw,1.12rem)] leading-relaxed max-w-[36ch]"
            style={isMobile ? { textShadow: '0 1px 2px rgba(0,0,0,.8), 0 4px 14px rgba(0,0,0,.6)' } : {}}
          >
            Profesjonalna pielęgnacja samochodu.<br />
            Z pasją. Z precyzją. Z gwarancją efektu.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 md:gap-3.5 w-full">
          {isMobile ? <MobileCTAs /> : <DesktopCTAs />}
        </div>
      </div>

      {/* Feature panels */}
      <FeaturePanels />
    </section>
  )
}

function DesktopCTAs() {
  return (
    <>
      <a
        href="/cennik"
        className="hero-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded text-noir-deep bg-accent border border-accent uppercase font-display font-bold text-[12.5px] tracking-[0.12em] transition-all duration-400 hover:bg-accent-hi hover:border-accent-hi"
      >
        <span>Zobacz usługi</span>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/25">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </a>
      <a
        href="/#realizacje"
        className="inline-flex items-center px-6 py-3.5 rounded text-accent border border-accent uppercase font-display font-bold text-[12.5px] tracking-[0.12em] transition-all duration-400 hover:bg-accent/10 hover:text-accent-hi hover:border-accent-hi"
      >
        Nasze realizacje
      </a>
    </>
  )
}

function MobileCTAs() {
  return (
    <>
      <a
        href="tel:+48690426050"
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded text-noir-deep bg-accent border border-accent uppercase font-display font-bold text-[13px] tracking-[0.10em] min-h-12"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 2.8c.3-.3.8-.4 1.2-.2l1.5.8c.5.3.7.9.4 1.4l-.6 1.2c.5 1 1.2 1.7 2.2 2.2l1.2-.6c.5-.3 1.1-.1 1.4.4l.8 1.5c.2.4.1.9-.2 1.2l-.4.4c-.7.7-1.7.9-2.6.5-2.5-1.2-4.6-3.3-5.8-5.8-.4-.9-.2-1.9.5-2.6l-.4-.4z" />
        </svg>
        <span>Zadzwoń teraz</span>
      </a>
      <a
        href="/cennik#wycena"
        className="flex-1 inline-flex items-center justify-center px-4 py-3.5 rounded text-accent border border-accent uppercase font-display font-bold text-[13px] tracking-[0.10em] min-h-12"
      >
        Umów wizytę
      </a>
    </>
  )
}

function FeaturePanels() {
  const FEATURES = [
    { title: 'Profesjonalne kosmetyki', body: 'Pracujemy tylko na sprawdzonych, premium produktach.', icon: 'spray' },
    { title: 'Najwyższa jakość',        body: 'Dbałość o każdy detal i perfekcyjne wykończenie.',     icon: 'diamond' },
    { title: 'Ochrona i trwałość',      body: 'Zabezpieczamy lakier, wnętrze i felgi na długi czas.', icon: 'shield' },
    { title: 'Umów się wygodnie',       body: 'Elastyczne terminy i szybka realizacja usług.',         icon: 'clock' },
  ]

  return (
    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-3 w-full max-w-[1600px] mx-auto">
      {FEATURES.map((f) => (
        <article
          key={f.title}
          className="flex items-start gap-3 p-3 md:p-4 rounded-xl border border-hairline backdrop-blur-xl bg-noir-deep/45 md:bg-white/[0.04] transition-all duration-400 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.06]"
          style={{
            backgroundImage: 'linear-gradient(140deg, rgba(246,246,247,.07) 0%, rgba(246,246,247,.015) 55%, rgba(246,246,247,.04) 100%)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,.10), inset 0 -1px 0 0 rgba(0,0,0,.18), 0 18px 44px -20px rgba(0,0,0,.55)',
          }}
        >
          <FeatureIcon name={f.icon} />
          <div className="min-w-0">
            <h3 className="font-display font-bold text-[10.5px] md:text-[11.5px] tracking-[0.13em] uppercase text-noir-bright mb-1">{f.title}</h3>
            <p className="text-[11.5px] md:text-[12.5px] leading-snug text-noir-muted">{f.body}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function FeatureIcon({ name }) {
  const common = {
    width: 28, height: 28,
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    className: 'shrink-0 text-accent md:w-9 md:h-9',
    style: { filter: 'drop-shadow(0 0 14px rgba(184,33,25,.28))' },
  }
  switch (name) {
    case 'spray': return (
      <svg {...common}>
        <path d="M13 4h6v3h-6z" />
        <path d="M14 7h4v3h-4z" />
        <path d="M11 10h10v2l-1 2v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V14l-1-2z" />
        <path d="M19 7h5l3 3v3h-8" />
      </svg>
    )
    case 'diamond': return (
      <svg {...common}>
        <path d="M16 4l8 8-8 16-8-16z" /><path d="M8 12h16" />
        <path d="M12 12l4-8 4 8" /><path d="M12 12l4 16 4-16" />
      </svg>
    )
    case 'shield': return (
      <svg {...common}>
        <path d="M16 3l11 4v8c0 7-5 12-11 14-6-2-11-7-11-14V7z" />
        <path d="M11 16l3.5 3.5L21 13" />
      </svg>
    )
    case 'clock': return (
      <svg {...common}>
        <circle cx="16" cy="16" r="12" /><path d="M16 8v8l5 3" />
      </svg>
    )
    default: return null
  }
}
