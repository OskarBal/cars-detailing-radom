import { useEffect, useRef, useState } from 'react'

const TIKTOK_URL = 'https://www.tiktok.com/@carsdetailingradom'

const STATS = [
  { key: 'google', value: 5.0,  format: 'decimal', label: ['Ocena', 'Google'],         duration: 1400, stars: true },
  { key: 'reach',  value: 23.4, format: 'k',       label: ['Zasięg na', 'TikToku'],    duration: 1800, prefix: '+', highlight: true },
  { key: 'video',  value: 91,   format: 'int',     label: ['Realizacji', 'na video'],  duration: 1600, effect: 'blur' },
  { key: 'time',   value: 12,   format: 'plus',    label: ['Miesięcy', 'w grze'],      duration: 1500 },
]

function format({ format, prefix }, n) {
  let out
  switch (format) {
    case 'decimal': out = n.toFixed(1); break
    case 'k':       out = `${n.toFixed(1)}K`; break
    case 'int':     out = Math.round(n).toString(); break
    case 'plus':    out = Math.round(n).toString(); break
    default:        out = String(n)
  }
  return prefix ? `${prefix}${out}` : out
}

function useCountUp(target, duration, start) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3) // ease-out cubic
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return value
}

export default function TrustStrip() {
  const ref = useRef(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true)
          obs.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <a
      ref={ref}
      href={TIKTOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Zobacz nasz profil na TikToku — @carsdetailingradom"
      className="block bg-noir-deep px-4 md:px-10 pt-3 md:pt-4 pb-5 md:pb-6 transition-colors duration-400 hover:bg-noir-elevated/40"
    >
      <ul className="mx-auto max-w-[1400px] grid grid-cols-4 gap-x-2 md:gap-x-10 items-start">
        {STATS.map((s) => (
          <StatItem key={s.key} stat={s} start={start} />
        ))}
      </ul>
    </a>
  )
}

function StatItem({ stat, start }) {
  const animated = useCountUp(stat.value, stat.duration, start)
  const progress = stat.value === 0 ? 0 : animated / stat.value
  const done = progress >= 0.99

  const numberStyle = {}
  const containerStyle = {
    opacity: start ? 1 : 0,
    transition: 'opacity 400ms ease',
  }

  if (stat.effect === 'blur') {
    const blur = Math.max(0, (1 - progress) * 5)
    numberStyle.filter = `blur(${blur}px)`
  }
  if (stat.highlight) {
    numberStyle.color = '#34E89E'
    numberStyle.textShadow = done
      ? '0 0 18px rgba(52,232,158,.55), 0 0 32px rgba(52,232,158,.22)'
      : '0 0 0 transparent'
    numberStyle.transition = 'text-shadow 600ms ease'
  }

  return (
    <li
      className="flex flex-col items-center text-center min-w-0"
      style={containerStyle}
    >
      <span
        className={`font-impact italic font-black leading-none whitespace-nowrap text-[1.4rem] md:text-[1.95rem] ${stat.highlight ? '' : 'text-noir-bright'}`}
        style={numberStyle}
      >
        {format(stat, animated)}
        {stat.format === 'plus' && (
          <span
            className="inline-block ease-out"
            style={{
              transform: done ? 'scale(1)' : 'scale(0)',
              opacity: done ? 1 : 0,
              transition: 'transform 380ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease',
            }}
          >
            +
          </span>
        )}
      </span>

      {stat.stars && <Stars start={start} />}

      <span className="font-display font-medium text-[9px] md:text-[11px] tracking-[0.14em] uppercase text-noir-faint mt-2 md:mt-1.5 leading-[1.35]">
        {stat.label[0]}<br className="md:hidden" /> <span className="hidden md:inline"> </span>{stat.label[1]}
      </span>
    </li>
  )
}

function Stars({ start }) {
  return (
    <span className="flex gap-[1px] mt-1.5 text-[9px] md:text-[12px]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="text-accent"
          style={{
            opacity: start ? 1 : 0,
            transform: start ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 280ms ease, transform 280ms ease',
            transitionDelay: start ? `${280 + i * 120}ms` : '0ms',
          }}
        >
          ★
        </span>
      ))}
    </span>
  )
}
