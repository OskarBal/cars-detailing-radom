import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PPF_PACKAGE_BY_ID, PPF_VIEWS } from '../../lib/ppf-data.js'

// Home-page PPF teaser. Auto-cycles through 4 escalating-coverage photo
// states — base → reflektory → pakiet front → całe auto. Pure image
// crossfade via opacity (no SVG overlay), pre-mounted for instant swap.
const BASE_FRONT = PPF_VIEWS.find((v) => v.id === 'front').baseImage

const CYCLE = [
  { id: 'base',         image: BASE_FRONT, label: 'Bez folii' },
  { id: 'reflektory',   image: PPF_PACKAGE_BY_ID['pkg-reflektory'].images.front, label: 'PPF reflektory' },
  { id: 'pakiet-front', image: PPF_PACKAGE_BY_ID['pkg-front'].images.front,       label: 'PPF pakiet front' },
  { id: 'cale-auto',    image: PPF_PACKAGE_BY_ID['pkg-cale-auto'].images.front,   label: 'PPF całe auto' },
]
const CYCLE_INTERVAL_MS = 2400 // each step holds for ~2.4s

export default function PpfTeaser() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = sectionRef.current
    if (!el) return
    if (reducedMotion.current) {
      setInView(true)
      setStepIdx(CYCLE.length - 1) // park on PPF całe auto, no cycle
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion.current) return
    const interval = window.setInterval(() => {
      setStepIdx((i) => (i + 1) % CYCLE.length)
    }, CYCLE_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [inView])

  return (
    <section
      ref={sectionRef}
      id="ppf-teaser"
      aria-label="PPF — folia ochronna"
      className="relative bg-noir-surface text-noir-bright py-20 md:py-28 px-6 md:px-10 border-t border-hairline overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

        {/* Left: photoreal teaser, crossfading through coverage states */}
        <div className="relative rounded-2xl overflow-hidden border border-hairline-hi bg-noir-deep shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
          {CYCLE.map((step, i) => (
            <img
              key={step.id}
              src={step.image}
              alt={i === 0 ? 'Mercedes G-Class — pakiet ochrony PPF' : ''}
              aria-hidden={i === 0 ? undefined : 'true'}
              width={2000}
              height={1493}
              loading="lazy"
              draggable={false}
              className={`${
                i === 0 ? 'block w-full h-auto relative' : 'absolute inset-0 w-full h-full'
              } select-none pointer-events-none transition-opacity duration-700 motion-reduce:transition-none ${
                stepIdx === i ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionTimingFunction: 'var(--ease-apple)' }}
            />
          ))}

          {/* Step ticker — corner indicator */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5" aria-hidden="true">
            {CYCLE.map((c, i) => (
              <span
                key={c.id}
                className={`block h-1 rounded-full transition-all duration-500 ${
                  i === stepIdx ? 'w-6 bg-accent' : 'w-2 bg-hairline-hi'
                }`}
              />
            ))}
          </div>

          {/* Current step label — bottom-right */}
          <p className="absolute bottom-3 right-4 text-[10.5px] uppercase tracking-widest text-noir-bright/90 font-display font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pointer-events-none">
            {CYCLE[stepIdx]?.label}
          </p>
        </div>

        {/* Right: copy + CTAs */}
        <div>
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Ochrona · PPF
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.6rem)] mb-5">
            Folia, której nie&nbsp;widać.<br />Tarcza, która chroni 10&nbsp;lat.
          </h2>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed mb-8 max-w-prose">
            Cztery pakiety ochrony — od samych reflektorów po całe auto.
            Wybierasz pakiet, widzisz dokładnie co obejmuje,
            wysyłasz konfigurację jednym kliknięciem.
          </p>

          <ul className="grid grid-cols-3 gap-3 mb-8 max-w-md">
            <li className="rounded-lg border border-hairline bg-noir-deep/60 px-3 py-3 text-center">
              <p className="font-impact italic font-black text-[1.4rem] leading-none text-noir-bright">10</p>
              <p className="text-[10.5px] uppercase tracking-widest text-noir-faint mt-1">lat gwarancji</p>
            </li>
            <li className="rounded-lg border border-hairline bg-noir-deep/60 px-3 py-3 text-center">
              <p className="font-impact italic font-black text-[1.4rem] leading-none text-noir-bright">~200µm</p>
              <p className="text-[10.5px] uppercase tracking-widest text-noir-faint mt-1">grubość</p>
            </li>
            <li className="rounded-lg border border-hairline bg-noir-deep/60 px-3 py-3 text-center">
              <p className="font-impact italic font-black text-[1.4rem] leading-none text-accent">∞</p>
              <p className="text-[10.5px] uppercase tracking-widest text-noir-faint mt-1">samoregeneracja</p>
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/ppf"
              className="cta-magic inline-flex items-center gap-2.5 px-7 py-4 rounded uppercase font-display font-bold text-[13px] tracking-[0.12em] transition-all border bg-transparent text-accent border-accent hover:text-accent-hi"
            >
              <span className="relative z-[1]">Zaplanuj moją folię</span>
              <svg className="relative z-[1]" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              to="/ppf#pakiety"
              className="inline-flex items-center gap-2 px-6 py-4 rounded uppercase font-display font-bold text-[12.5px] tracking-[0.12em] text-noir-bright border border-hairline-hi hover:border-accent hover:text-accent transition-colors"
            >
              <span>Zobacz pakiety</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
