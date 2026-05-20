import { formatZl } from '../../lib/catalog.js'

// Replaces the old SubtotalCard + SelectionChips. With a single package
// always selected, the summary is the package itself: name, price, and
// the human-readable "Co obejmuje" coverage list pulled from pkg.covers.
export default function PackageSummary({ activePackage, onOpenForm }) {
  if (!activePackage) return null
  return (
    <div className="rounded-xl border border-hairline-hi bg-noir-elevated/60 p-5">
      <p className="text-[11px] uppercase tracking-widest text-noir-faint">
        Twój wybór
      </p>
      <div className="flex items-baseline gap-2 mt-2">
        <h3 className="font-impact italic font-black uppercase text-[1.4rem] leading-tight text-noir-bright">
          {activePackage.name}
        </h3>
        {activePackage.bestseller && (
          <span className="inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-display tracking-widest text-accent border border-accent/60 rounded-sm not-italic uppercase">
            Bestseller
          </span>
        )}
      </div>
      <p className="font-impact italic font-black uppercase text-[2.2rem] leading-none tabular-nums mt-3 mb-5 text-accent">
        od&nbsp;{formatZl(activePackage.priceFrom)}
      </p>

      <p className="text-[11px] uppercase tracking-widest text-noir-faint mb-2">
        Co obejmuje
      </p>
      <ul className="space-y-1.5 mb-6">
        {activePackage.covers.map((c) => (
          <li
            key={c}
            className="flex items-start gap-2 text-[13px] text-noir-muted leading-snug"
          >
            <span aria-hidden="true" className="shrink-0 text-accent mt-1">
              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6.5l2.5 2.5L10 3.5" />
              </svg>
            </span>
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onOpenForm}
        className="cta-magic w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded uppercase font-display font-bold text-[13px] tracking-[0.12em] transition-all border bg-transparent text-accent border-accent hover:text-accent-hi"
      >
        <span className="relative z-[1]">Wyceń ten pakiet</span>
        <svg className="relative z-[1]" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </button>
      <p className="mt-3 text-[11.5px] text-noir-faint leading-snug">
        Oddzwonimy w&nbsp;ciągu 15&nbsp;minut w&nbsp;godz. 9–19.
      </p>
    </div>
  )
}
