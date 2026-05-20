import { formatZl } from '../../lib/catalog.js'

// Mobile-only sticky bar. With single-package selection, this is just a
// compact reminder of the current pick + a one-tap CTA into the form.
// No clear button — there's always a package selected.
export default function PpfStickyBar({ activePackage, onOpenForm }) {
  if (!activePackage) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-noir-surface/95 backdrop-blur-md border-t border-hairline-hi lg:hidden">
      <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10.5px] uppercase tracking-widest text-noir-faint leading-tight truncate">
            Pakiet · {activePackage.name}
          </p>
          <p className="font-impact italic font-black uppercase text-[1.25rem] leading-none tabular-nums mt-1">
            od&nbsp;{formatZl(activePackage.priceFrom)}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenForm}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[12.5px] tracking-[0.12em] hover:bg-accent-hi transition-all"
        >
          <span>Wyceń</span>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  )
}
