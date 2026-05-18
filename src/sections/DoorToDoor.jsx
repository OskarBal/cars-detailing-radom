import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const STEPS = [
  {
    num: '01',
    label: 'Zgłoszenie',
    body: 'Telefon lub formularz. Ustalamy datę i adres odbioru.',
    icon: PhoneIcon,
  },
  {
    num: '02',
    label: 'Odbiór',
    body: 'Przyjeżdżamy spod Twojego adresu w Radomiu o ustalonej godzinie.',
    icon: KeyIcon,
  },
  {
    num: '03',
    label: 'Powrót',
    body: 'Odwozimy auto pod drzwi, gotowe do jazdy.',
    icon: SparkleIcon,
  },
]

export default function DoorToDoor() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="door-to-door"
      aria-label="Door-to-door"
      className="relative bg-noir-deep text-noir-bright py-16 md:py-24 px-6 md:px-10 border-t border-hairline overflow-hidden"
    >
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-12 md:mb-16 max-w-2xl">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Door-to-door
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(1.9rem,4.6vw,3.1rem)] mb-4">
            Zostań w&nbsp;domu.<br />My&nbsp;przyjedziemy.
          </h2>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed">
            Odbieramy auto spod Twojego adresu, wykonujemy usługę u&nbsp;nas, odwozimy z&nbsp;powrotem. Cały dzień zostaje Tobie.
          </p>
        </header>

        <div className="relative">
          {/* Desktop connector line + travelling dot, hidden on mobile (stacked layout) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-[16.66%] right-[16.66%] top-[44px] h-px pointer-events-none"
          >
            <svg
              className="absolute inset-0 w-full overflow-visible"
              style={{ height: '1px' }}
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="0.5"
                x2="100%"
                y2="0.5"
                stroke="rgba(184,33,25,0.55)"
                strokeWidth="1.25"
                strokeDasharray="4 5"
                strokeDashoffset={inView ? 0 : 400}
                style={{
                  transition: 'stroke-dashoffset 1400ms cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              />
            </svg>
            {inView && (
              <span
                className="d2d-dot absolute top-1/2 w-2 h-2 rounded-full bg-accent"
                style={{
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 14px rgba(184,33,25,0.9), 0 0 4px rgba(255,255,255,0.6)',
                }}
              />
            )}
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-6 relative">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <li
                  key={s.num}
                  className={`flex md:flex-col items-start gap-5 md:gap-0 md:text-center transition-all duration-[700ms] ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                  style={{
                    transitionDelay: inView ? `${280 + i * 180}ms` : '0ms',
                    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  <div className="relative shrink-0 md:mx-auto grid place-items-center w-[88px] h-[88px] rounded-full bg-noir-surface border border-hairline-hi">
                    <Icon />
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold tabular-nums tracking-widest text-noir-deep bg-accent rounded-sm font-display">
                      {s.num}
                    </span>
                  </div>
                  <div className="md:mt-5 md:max-w-[26ch] md:mx-auto">
                    <p className="font-impact italic font-black uppercase text-[clamp(1.05rem,2.2vw,1.35rem)] leading-tight mb-1.5">
                      {s.label}
                    </p>
                    <p className="text-[13.5px] md:text-[14px] text-noir-muted leading-relaxed max-w-[30ch] md:max-w-none">
                      {s.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="mt-10 md:mt-14 flex flex-wrap items-center gap-4">
          <Link
            to="/cennik#wycena"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-all"
          >
            <span>Zamów odbiór</span>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <span className="text-sm text-noir-faint">
            Radom &amp;&nbsp;okolice · Wycena indywidualna
          </span>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function PhoneIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <path d="M7 4l3 1 2 5-3 2c1 4 4 7 8 8l2-3 5 2 1 3c0 2-2 4-4 4C12 26 6 20 6 8c0-2 1-4 3-4z" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <circle cx="11" cy="16" r="5" />
      <path d="M15 16h12" />
      <path d="M22 16v4" />
      <path d="M26 16v3" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <circle cx="16" cy="16" r="11" />
      <path d="M11 17l3 3 7-8" />
    </svg>
  )
}
