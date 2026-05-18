import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CATEGORIES, SERVICE_BY_ID, TOTAL_SERVICES_COUNT, CATEGORY_COUNT, formatZl } from '../lib/catalog.js'
import WycenaForm from '../components/WycenaForm.jsx'

// Local-storage key for persisting selection across reloads
const STORAGE_KEY = 'cdr.cennik.selection.v1'

function loadSelection() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.filter((id) => SERVICE_BY_ID[id]) : []
  } catch {
    return []
  }
}

function saveSelection(ids) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* quota / private mode — fail silently */
  }
}

export default function Cennik() {
  const location = useLocation()
  const navigate = useNavigate()

  const [selectedIds, setSelectedIds] = useState(() => loadSelection())
  const [formOpen, setFormOpen] = useState(false)

  // Persist whenever selection changes
  useEffect(() => {
    saveSelection(selectedIds)
  }, [selectedIds])

  // Hash deep-links:
  //   #wycena                → open the form
  //   #<category-slug>       → scroll to category
  //   #<service-id>          → scroll to category that contains this service (and we could pre-select, but keep clicks intentional)
  useEffect(() => {
    const hash = (location.hash || '').replace('#', '')
    if (!hash) return

    if (hash === 'wycena') {
      // Wait one frame so layout settles before opening
      const id = window.requestAnimationFrame(() => setFormOpen(true))
      return () => window.cancelAnimationFrame(id)
    }

    // Find target — category slug first, then service id (jump to its category)
    const targetCategory =
      CATEGORIES.find((c) => c.slug === hash) ||
      CATEGORIES.find((c) => c.services.some((s) => s.id === hash))

    if (targetCategory) {
      const id = window.requestAnimationFrame(() => {
        const el = document.getElementById(`cat-${targetCategory.slug}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
      return () => window.cancelAnimationFrame(id)
    }
  }, [location.hash])

  const toggle = useCallback((id) => {
    setSelectedIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    )
  }, [])

  const clearAll = useCallback(() => setSelectedIds([]), [])

  const openForm = useCallback(() => {
    setFormOpen(true)
    // Reflect in URL so a hard refresh / share-link can re-open it
    if (location.hash !== '#wycena') {
      navigate('/cennik#wycena', { replace: true })
    }
  }, [location.hash, navigate])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    if (location.hash === '#wycena') {
      navigate('/cennik', { replace: true })
    }
  }, [location.hash, navigate])

  // Subtotal across all selected priced services; quote-on-request marked separately
  const { subtotal, hasQuoteOnRequest } = useMemo(() => {
    let sum = 0
    let qor = false
    for (const id of selectedIds) {
      const svc = SERVICE_BY_ID[id]
      if (!svc) continue
      if (svc.quoteOnRequest) qor = true
      else sum += svc.priceFrom || 0
    }
    return { subtotal: sum, hasQuoteOnRequest: qor }
  }, [selectedIds])

  return (
    <>
      <CennikHero
        selectedCount={selectedIds.length}
        subtotal={subtotal}
        hasQuoteOnRequest={hasQuoteOnRequest}
        onOpenForm={openForm}
      />

      <CategoryNav />

      <main className="relative bg-noir-deep text-noir-bright pb-32 md:pb-40">
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.slug}
            category={cat}
            selectedIds={selectedIds}
            onToggle={toggle}
          />
        ))}

        <FinalCta onOpenForm={openForm} selectedCount={selectedIds.length} />
      </main>

      {/* Sticky bottom bar — visible whenever something is selected on mobile + always on desktop */}
      <StickyBar
        selectedCount={selectedIds.length}
        subtotal={subtotal}
        hasQuoteOnRequest={hasQuoteOnRequest}
        onOpenForm={openForm}
        onClearAll={clearAll}
      />

      <WycenaForm
        open={formOpen}
        onClose={closeForm}
        selectedIds={selectedIds}
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function CennikHero({ selectedCount, subtotal, hasQuoteOnRequest, onOpenForm }) {
  return (
    <section
      aria-label="Cennik"
      className="relative bg-noir-deep text-noir-bright pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-10 border-b border-hairline"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
          Cennik · {TOTAL_SERVICES_COUNT} usług w&nbsp;{CATEGORY_COUNT} kategoriach
        </p>
        <h1 className="font-impact italic font-black uppercase leading-[0.92] text-[clamp(2.6rem,8vw,5.6rem)] mb-6 max-w-5xl">
          Każda&nbsp;usługa,<br />jasna&nbsp;cena.
        </h1>
        <p className="text-noir-muted text-base md:text-lg leading-relaxed max-w-2xl mb-10">
          Ceny od&nbsp;jakich startujemy — finalna kwota zawsze zależy od&nbsp;stanu auta.
          Zaznacz, co&nbsp;Cię interesuje, a&nbsp;oddzwonimy z&nbsp;dokładną wyceną w&nbsp;ciągu 15&nbsp;minut.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onOpenForm}
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-all"
          >
            <span>Szczegółowa wycena · 15 minut</span>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>

          {selectedCount > 0 && (
            <div className="flex items-baseline gap-3 text-noir-faint text-sm">
              <span className="tabular-nums">
                Zaznaczone: <strong className="text-noir-bright">{selectedCount}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                od&nbsp;<strong className="text-accent">{formatZl(subtotal)}</strong>
                {hasQuoteOnRequest ? ' +' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Category jump nav                                                          */
/* -------------------------------------------------------------------------- */

function CategoryNav() {
  return (
    <nav
      aria-label="Kategorie usług"
      className="sticky top-16 z-20 bg-noir-deep/85 backdrop-blur-md border-b border-hairline"
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-10 overflow-x-auto no-scrollbar">
        <ul className="flex gap-1 md:gap-2 py-3 whitespace-nowrap">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <a
                href={`#cat-${cat.slug}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] md:text-[12.5px] uppercase tracking-wider font-medium text-noir-muted border border-hairline hover:border-accent hover:text-noir-bright transition-colors"
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/* Category section + rows                                                    */
/* -------------------------------------------------------------------------- */

function CategorySection({ category, selectedIds, onToggle }) {
  return (
    <section
      id={`cat-${category.slug}`}
      aria-labelledby={`cat-${category.slug}-title`}
      className="relative py-16 md:py-24 px-6 md:px-10 border-b border-hairline scroll-mt-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8 md:mb-12 max-w-3xl">
          <h2
            id={`cat-${category.slug}-title`}
            className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(1.7rem,4.4vw,3rem)] mb-3"
          >
            {category.name}
          </h2>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed">
            {category.lede}
          </p>
        </header>

        {category.isPackages ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {category.services.map((svc) => (
              <PackageCard
                key={svc.id}
                service={svc}
                selected={selectedIds.includes(svc.id)}
                onToggle={() => onToggle(svc.id)}
              />
            ))}
          </div>
        ) : category.isLogistics ? (
          <div
            className={`grid gap-4 md:gap-6 ${
              category.services.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl'
            }`}
          >
            {category.services.map((svc) => (
              <LogisticsCard
                key={svc.id}
                service={svc}
                selected={selectedIds.includes(svc.id)}
                onToggle={() => onToggle(svc.id)}
              />
            ))}
          </div>
        ) : (
          <ol className="border-t border-hairline">
            {category.services.map((svc) => (
              <ServiceRow
                key={svc.id}
                service={svc}
                selected={selectedIds.includes(svc.id)}
                onToggle={() => onToggle(svc.id)}
              />
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

function ServiceRow({ service, selected, onToggle }) {
  return (
    <li className="border-b border-hairline">
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        onClick={onToggle}
        className={`group w-full text-left py-5 md:py-6 transition-colors duration-300 ${
          selected ? 'bg-accent/[0.06]' : 'hover:bg-noir-elevated/30'
        }`}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <CheckBox selected={selected} />

          <div className="flex-1 min-w-0 flex items-baseline justify-between gap-3 md:gap-8">
            <h3
              className={`font-display font-medium text-[15.5px] md:text-lg leading-snug transition-colors ${
                selected ? 'text-noir-bright' : 'text-noir-bright group-hover:text-noir-bright'
              }`}
            >
              {service.name}
              {service.anchor && (
                <span className="ml-2.5 align-middle inline-flex items-center px-1.5 py-0.5 text-[9.5px] uppercase tracking-widest text-accent border border-accent/60 rounded-sm">
                  Bestseller
                </span>
              )}
            </h3>

            <span
              className={`shrink-0 font-mono text-[12.5px] md:text-[13.5px] tabular-nums tracking-tight transition-colors ${
                selected ? 'text-accent' : 'text-noir-muted group-hover:text-noir-bright'
              }`}
            >
              {service.quoteOnRequest
                ? 'wycena indyw.'
                : `od ${formatZl(service.priceFrom)}`}
            </span>
          </div>
        </div>
      </button>
    </li>
  )
}

function PackageCard({ service, selected, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={`group text-left rounded-xl p-5 md:p-6 border transition-all duration-300 ${
        selected
          ? 'border-accent bg-accent/[0.08]'
          : 'border-hairline bg-noir-surface hover:border-hairline-hi hover:bg-noir-elevated/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-impact italic font-black uppercase text-[clamp(1.15rem,2.8vw,1.5rem)] leading-tight">
          {service.name}
        </h3>
        <CheckBox selected={selected} />
      </div>

      <p
        className={`font-mono text-[13px] mb-5 tabular-nums tracking-tight ${
          selected ? 'text-accent' : 'text-noir-muted'
        }`}
      >
        od {formatZl(service.priceFrom)}
      </p>

      <ul className="space-y-2 text-[13.5px] text-noir-muted">
        {service.includes.map((line) => (
          <li key={line} className="flex items-baseline gap-2">
            <span className="text-accent/80 shrink-0">·</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {service.anchor && (
        <p className="mt-4 inline-flex items-center px-2 py-1 text-[9.5px] uppercase tracking-widest text-accent border border-accent/60 rounded-sm">
          Najlepiej sprzedające się
        </p>
      )}
    </button>
  )
}

function LogisticsCard({ service, selected, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={`group text-left rounded-xl p-5 md:p-6 border transition-all duration-300 ${
        selected
          ? 'border-accent bg-accent/[0.08]'
          : 'border-hairline bg-noir-surface hover:border-hairline-hi hover:bg-noir-elevated/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-impact italic font-black uppercase text-[clamp(1.15rem,2.6vw,1.4rem)] leading-tight">
          {service.name}
        </h3>
        <CheckBox selected={selected} />
      </div>
      <p className="font-mono text-[12.5px] text-noir-faint tabular-nums mb-3">
        wycena indywidualna
      </p>
      <p className="text-[14px] text-noir-muted leading-relaxed">
        {service.body}
      </p>
    </button>
  )
}

function CheckBox({ selected }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 w-6 h-6 md:w-7 md:h-7 rounded grid place-items-center border transition-all duration-200 ${
        selected
          ? 'bg-accent border-accent text-noir-deep'
          : 'bg-transparent border-hairline-hi text-transparent group-hover:border-accent/70'
      }`}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8.5l3 3 7-8" />
      </svg>
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Sticky bottom bar (mobile-prominent, desktop too)                          */
/* -------------------------------------------------------------------------- */

function StickyBar({ selectedCount, subtotal, hasQuoteOnRequest, onOpenForm, onClearAll }) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-noir-surface/95 backdrop-blur-md border-t border-hairline-hi">
      <div className="mx-auto max-w-[1400px] px-4 md:px-10 py-3 md:py-4 flex items-center gap-3 md:gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-noir-faint leading-tight">
            Zaznaczone ({selectedCount})
          </p>
          <p className="font-impact italic font-black uppercase text-[clamp(1.1rem,3vw,1.5rem)] leading-none tabular-nums mt-1">
            od&nbsp;{formatZl(subtotal)}{hasQuoteOnRequest ? ' +' : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="hidden md:inline-flex items-center px-4 py-2.5 text-xs uppercase tracking-widest text-noir-faint hover:text-noir-bright transition-colors"
        >
          Wyczyść
        </button>

        <button
          type="button"
          onClick={onOpenForm}
          className="inline-flex items-center gap-2 px-5 md:px-7 py-3.5 md:py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[12.5px] md:text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-all"
        >
          <span>Szczegółowa wycena · 15 min</span>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Final CTA section                                                          */
/* -------------------------------------------------------------------------- */

function FinalCta({ onOpenForm, selectedCount }) {
  return (
    <section
      aria-label="Wycena"
      className="relative py-20 md:py-32 px-6 md:px-10 bg-noir-surface"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
          Szczegółowa wycena · 15 minut
        </p>
        <h2 className="font-impact italic font-black uppercase leading-[0.92] text-[clamp(2rem,6vw,4.2rem)] mb-6">
          Powiedz, czego potrzebujesz.
        </h2>
        <p className="text-noir-muted text-base md:text-lg leading-relaxed mb-8 max-w-prose mx-auto">
          {selectedCount > 0
            ? 'Mamy już Twoją listę usług. Brakuje tylko numeru telefonu i marki auta.'
            : 'Zostaw kontakt i krótki opis auta. Oddzwonimy z wyceną w ciągu 15 minut w godz. 9–19.'}
        </p>
        <button
          type="button"
          onClick={onOpenForm}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13.5px] tracking-[0.12em] hover:bg-accent-hi transition-all"
        >
          <span>Otwórz formularz</span>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </section>
  )
}
