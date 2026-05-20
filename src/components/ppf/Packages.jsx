import { PPF_PACKAGES } from '../../lib/ppf-data.js'
import { formatZl } from '../../lib/catalog.js'

// Package picker. Always sets (never toggles off) — one package must
// always be selected. Bestseller pill renders on packages with the flag.
export default function Packages({ activePackageId, onApplyPackage }) {
  return (
    <div id="pakiety" className="rounded-xl border border-hairline bg-noir-surface p-5">
      <p className="text-[11px] uppercase tracking-widest text-noir-faint mb-1">
        Gotowe pakiety
      </p>
      <h2 className="font-impact italic font-black uppercase text-[1.6rem] leading-tight mb-4">
        Wybierz pakiet
      </h2>
      <ul className="space-y-2.5">
        {PPF_PACKAGES.map((pkg) => {
          const active = activePackageId === pkg.id
          return (
            <li key={pkg.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onApplyPackage(pkg.id)}
                className={`group w-full text-left rounded-lg p-3.5 border transition-all duration-300 ${
                  active
                    ? 'border-accent bg-accent/[0.08]'
                    : 'border-hairline hover:border-hairline-hi hover:bg-noir-elevated/60'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className={`font-impact italic font-black uppercase text-[1.05rem] leading-none ${active ? 'text-accent' : 'text-noir-bright'}`}>
                    {pkg.name}
                    {pkg.bestseller && (
                      <span className="ml-2.5 align-middle inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-display tracking-widest text-accent border border-accent/60 rounded-sm not-italic">
                        Bestseller
                      </span>
                    )}
                  </span>
                  <span className={`font-mono text-[12px] tabular-nums whitespace-nowrap ${active ? 'text-accent' : 'text-noir-muted group-hover:text-noir-bright'}`}>
                    od {formatZl(pkg.priceFrom)}
                  </span>
                </div>
                <p className="text-[12.5px] text-noir-muted leading-snug">
                  {pkg.blurb}
                </p>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
