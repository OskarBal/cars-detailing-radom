import { PROMO_OF_THE_MONTH, formatZl } from '../lib/catalog.js'

export default function PromoOfMonth() {
  const p = PROMO_OF_THE_MONTH
  if (!p?.active) return null

  return (
    <section
      id="pakiet-miesiaca"
      className="relative bg-noir-surface text-noir-bright py-8 md:py-12 px-6 md:px-10 border-t border-b border-hairline overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">

        {/* Row 1 — eyebrow ↔ scarcity caption */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-5 md:mb-6">
          <p className="flex items-center gap-2.5 text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase">
            <span className="promo-dot inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            {p.eyebrow} · {p.monthLabel}
          </p>
          {p.scarcity && (
            <span className="text-noir-faint font-display font-bold text-[11px] md:text-[12px] tracking-[0.16em] uppercase">
              {p.scarcity}
            </span>
          )}
        </div>

        {/* Row 2 — title + subtitle (left)  ↔  price + CTA (right) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-6 md:gap-10 items-end">

          {/* LEFT — title with accent bar + subtitle */}
          <div className="relative pl-5 md:pl-6">
            <span aria-hidden="true" className="absolute left-0 top-1 bottom-2 w-[3px] bg-accent" />
            <h2 className="font-display font-black italic text-noir-bright leading-[0.95] text-[clamp(1.9rem,4.2vw,2.8rem)] uppercase tracking-tight mb-2.5">
              <span className="glitch-title" data-text={p.title}>{p.title}</span>
            </h2>
            <p className="text-noir-muted text-[14.5px] md:text-[15.5px] leading-snug max-w-md">
              {p.subtitle}
            </p>
          </div>

          {/* RIGHT — price block + CTA + savings chip */}
          <div className="flex flex-col items-start md:items-end gap-3.5">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold tabular-nums text-noir-bright text-[clamp(1.5rem,3vw,2rem)] tracking-tight leading-none">
                od {formatZl(p.priceFrom)}
              </span>
              {p.priceCompare && (
                <span className="text-noir-faint tabular-nums text-[13px] md:text-[14px] line-through decoration-noir-faint/60">
                  zamiast {formatZl(p.priceCompare)}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={p.cta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[12.5px] tracking-[0.12em] hover:bg-accent-hi transition-all"
              >
                {p.cta.label}
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              {p.priceCompare && (
                <span className="px-2.5 py-1 rounded-sm border border-accent/40 text-accent text-[11px] font-display font-bold tracking-[0.14em] uppercase tabular-nums">
                  −{formatZl(p.priceCompare - p.priceFrom)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Row 3 — inline "what's in the package" */}
        <ul className="mt-6 md:mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-noir-bright text-[13.5px] md:text-[14.5px]">
          <li className="text-noir-faint font-display font-bold text-[11px] tracking-[0.22em] uppercase mr-1">
            W pakiecie
          </li>
          {p.includes.map((line, i) => (
            <li key={i} className="flex items-center gap-2">
              <span aria-hidden="true" className="w-1.5 h-1.5 rotate-45 bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
