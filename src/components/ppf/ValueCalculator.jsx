import { useEffect, useMemo, useRef, useState } from 'react'
import { PPF_PACKAGES, PPF_PACKAGE_BY_ID, PPF_DEFAULT_PACKAGE_ID } from '../../lib/ppf-data.js'
import { formatZl } from '../../lib/catalog.js'

// "Ekonomia ochrony" — personalized PPF ROI calculator.
//
// Three integrated layers:
//   1. Inputs: pakiet tabs + 3 sliders/control (wartość, km/rok, trasa, okres)
//   2. Live outputs: zł/dzień hero + próg opłacalności + wartość rezydualna + ryzyko odprysku
//   3. Comparator: 5-year accumulating "Bez PPF" repair cost vs flat PPF amortization
//
// CTA hands off the full car profile to the existing WycenaForm via prefillNote.

const TRASY = [
  { id: 'miasto',     label: 'Miasto',     pierwszyMies: 18, chipRisk: 'niskie'    },
  { id: 'mieszane',   label: 'Mieszane',   pierwszyMies: 12, chipRisk: 'średnie'   },
  { id: 'autostrada', label: 'Autostrada', pierwszyMies: 6,  chipRisk: 'wysokie'   },
]

// Defensible average for a single paint-repair event at a quality PL body shop:
// chip + spot paint (~1200 zł), full panel respray (~2500 zł), bumper paint (~2000 zł).
// 2200 zł as the breakeven anchor.
const AVG_REPAIR_COST = 2200

// 5-year "no PPF" damage roll-up — used by the comparator. Numbers are
// realistic PL mid-tier body shop quotes for premium-segment cars.
const SCENARIO_5Y = [
  { rok: 1, label: 'Pierwszy odprysk na masce',           cost: 2400 },
  { rok: 2, label: 'Rysa głęboka na drzwiach',            cost: 1800 },
  { rok: 3, label: 'Malowanie zderzaka po kamieniach',    cost: 2000 },
  { rok: 4, label: 'Hazing lakieru po polerce',           cost: null, value: '−3% wartości' },
  { rok: 5, label: 'Brak oryginalnego lakieru',           cost: null, value: 'utrata wartości' },
]

export default function ValueCalculator({ activePackageId = null, onOpenFormWithNote }) {
  // Seed pakiet from the configurator's active selection, fall back to bestseller front.
  const seedPakietId =
    activePackageId && PPF_PACKAGE_BY_ID[activePackageId]
      ? activePackageId
      : PPF_DEFAULT_PACKAGE_ID

  const [pakietId, setPakietId] = useState(seedPakietId)
  const [carValue, setCarValue] = useState(250000)
  const [kmRok, setKmRok] = useState(20000)
  const [trasaId, setTrasaId] = useState('mieszane')
  const [lata, setLata] = useState(5)

  // Re-sync pakiet when the user changes it via the main configurator above.
  useEffect(() => {
    if (activePackageId && PPF_PACKAGE_BY_ID[activePackageId]) {
      setPakietId(activePackageId)
    }
  }, [activePackageId])

  const pakiet = PPF_PACKAGE_BY_ID[pakietId] || PPF_PACKAGE_BY_ID[PPF_DEFAULT_PACKAGE_ID]
  const trasa = TRASY.find((t) => t.id === trasaId) || TRASY[1]

  const out = useMemo(() => {
    const price = pakiet.priceFrom
    const pricePerDay = price / (lata * 365)
    const pricePct = (price / carValue) * 100

    // Premium body shops + premium paint codes cost more. Linear ramp anchored
    // at 200k (×1.0) → 1M (×2.0), capped at 2.5 for hyper-premium so the math
    // doesn't drift into fantasy. Applied to per-repair cost (próg) and to
    // the comparator's 5-year suma.
    const bodyShopMul = Math.min(2.5, Math.max(1, 1 + (carValue - 200000) / 800000))
    const progRepairCost = AVG_REPAIR_COST * bodyShopMul
    const prog = Math.max(1, Math.ceil(price / progRepairCost))

    // km/rok scales linearly off the 20k baseline.
    const kmFactor = Math.min(4, Math.max(0.25, 20000 / Math.max(kmRok, 1)))
    const pierwszyMies = Math.min(36, Math.max(2, Math.round(trasa.pierwszyMies * kmFactor)))

    // Damage scenario multiplier: km × trasa × bodyShop.
    const kmCostFactor = Math.min(4, Math.max(0.25, kmRok / 20000))
    const trasaCostMul = trasa.id === 'autostrada' ? 1.4 : trasa.id === 'miasto' ? 0.7 : 1.0
    const scenarioMultiplier = Math.min(4, Math.max(0.4, kmCostFactor * trasaCostMul * bodyShopMul))

    // Wartość rezydualna — premium-segment original-paint + documented PPF
    // removal typically holds ~3–5% more on resale. Anchor at 4% and surface
    // as a hard zł amount; the percentage is decoration, the zł lands.
    const rezydualna = Math.round((carValue * 0.04) / 100) * 100

    // PPF cost expressed as days of the car's own natural depreciation.
    // Premium cars lose ~15%/rok in early years. Round to nearest day.
    const dziennaDeprecjacja = (carValue * 0.15) / 365
    const dniDeprecjacji = Math.max(1, Math.round(price / Math.max(dziennaDeprecjacja, 1)))

    return {
      price, pricePerDay, pricePct, prog, pierwszyMies, scenarioMultiplier,
      bodyShopMul, rezydualna, dniDeprecjacji,
    }
  }, [pakiet, lata, carValue, kmRok, trasa])

  const onCta = () => {
    if (!onOpenFormWithNote) return
    const note = [
      `Wartość auta: ${formatZl(carValue)}`,
      `Roczny przebieg: ${kmRok.toLocaleString('pl-PL')} km`,
      `Trasa: ${trasa.label}`,
      `Planowany okres posiadania: ${lata} lat`,
      `Pakiet z konfiguratora: ${pakiet.name}`,
    ].join('\n')
    onOpenFormWithNote(note, pakiet.id)
  }

  return (
    <section
      aria-label="Ekonomia ochrony — kalkulator wartości PPF"
      className="relative bg-noir-deep px-6 md:px-10 py-16 md:py-24 border-b border-hairline"
    >
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Ekonomia ochrony
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.6rem)] mb-4">
            Lakier wraca do<br />stanu fabrycznego.
          </h2>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed">
            Dopasuj kalkulator do swojego auta. Zobaczysz, ile dziennie kosztuje
            ochrona i kiedy folia zwróci się w&nbsp;napra­wach, których nie&nbsp;musisz robić.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-6 md:gap-8">
          <InputsCard
            pakiet={pakiet}
            onPakiet={setPakietId}
            carValue={carValue}
            onCarValue={setCarValue}
            kmRok={kmRok}
            onKmRok={setKmRok}
            trasaId={trasaId}
            onTrasa={setTrasaId}
            lata={lata}
            onLata={setLata}
          />
          <OutputPanel out={out} pakiet={pakiet} trasa={trasa} />
        </div>

        <Comparator
          pakiet={pakiet}
          pricePerDay={out.pricePerDay}
          scenarioMultiplier={out.scenarioMultiplier}
          profilCaption={`${formatZl(carValue)} · ${kmRok.toLocaleString('pl-PL')} km/rok · ${trasa.label}`}
        />

        <div className="mt-12 md:mt-14 flex flex-col items-start gap-4">
          <button
            type="button"
            onClick={onCta}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-colors"
          >
            Zarezerwuj wycenę dla Twojego auta
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
          <p className="text-[11.5px] text-noir-faint leading-relaxed max-w-md">
            Twoje dane z&nbsp;kalkulatora trafią do&nbsp;formularza —
            oddzwonimy w&nbsp;ciągu 15&nbsp;minut z&nbsp;dokładną wyceną.
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Inputs                                                                     */
/* -------------------------------------------------------------------------- */

function InputsCard({
  pakiet,
  onPakiet,
  carValue,
  onCarValue,
  kmRok,
  onKmRok,
  trasaId,
  onTrasa,
  lata,
  onLata,
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-noir-surface p-6 md:p-7 space-y-7">
      <div>
        <Kicker>Pakiet</Kicker>
        <div role="radiogroup" aria-label="Pakiet PPF" className="grid grid-cols-2 gap-2">
          {PPF_PACKAGES.map((p) => {
            const active = p.id === pakiet.id
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onPakiet(p.id)}
                className={`rounded-lg border px-3 py-2.5 text-left transition-all duration-300 ${
                  active
                    ? 'border-accent bg-accent/[0.08]'
                    : 'border-hairline hover:border-hairline-hi hover:bg-noir-elevated/60'
                }`}
              >
                <span className={`block font-impact italic font-black uppercase text-[0.95rem] leading-none ${active ? 'text-accent' : 'text-noir-bright'}`}>
                  {shortPakietName(p.name)}
                </span>
                <span className={`block mt-1.5 font-mono text-[11px] tabular-nums whitespace-nowrap ${active ? 'text-accent' : 'text-noir-muted'}`}>
                  od {formatZl(p.priceFrom)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <SliderRow
        kicker="Wartość auta"
        value={carValue}
        min={50000}
        max={1500000}
        step={10000}
        onChange={onCarValue}
        displayValue={formatZl(carValue)}
      />

      <SliderRow
        kicker="Roczny przebieg"
        value={kmRok}
        min={5000}
        max={80000}
        step={5000}
        onChange={onKmRok}
        displayValue={`${kmRok.toLocaleString('pl-PL')} km`}
      />

      <div>
        <Kicker>Trasa dominująca</Kicker>
        <div role="radiogroup" aria-label="Trasa dominująca" className="grid grid-cols-3 gap-2">
          {TRASY.map((t) => {
            const active = t.id === trasaId
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onTrasa(t.id)}
                className={`rounded-lg border px-3 py-2.5 transition-all duration-300 font-display font-bold uppercase text-[11px] tracking-[0.12em] ${
                  active
                    ? 'border-accent bg-accent/[0.08] text-accent'
                    : 'border-hairline text-noir-muted hover:border-hairline-hi hover:text-noir-bright'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <SliderRow
        kicker="Planowany okres posiadania"
        value={lata}
        min={1}
        max={10}
        step={1}
        onChange={onLata}
        displayValue={`${lata} ${lata === 1 ? 'rok' : lata < 5 ? 'lata' : 'lat'}`}
      />
    </div>
  )
}

function SliderRow({ kicker, value, min, max, step, onChange, displayValue }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <Kicker className="mb-0">{kicker}</Kicker>
        <span className="font-impact italic font-black uppercase text-[1.15rem] leading-none tabular-nums text-noir-bright">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
        aria-label={kicker}
      />
    </label>
  )
}

function Kicker({ children, className = '' }) {
  return (
    <p className={`text-[10.5px] uppercase tracking-widest text-noir-faint mb-2.5 ${className}`}>
      {children}
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* Live output panel                                                          */
/* -------------------------------------------------------------------------- */

function OutputPanel({ out, pakiet, trasa }) {
  const pricePerDayStr = out.pricePerDay >= 10
    ? out.pricePerDay.toFixed(1).replace('.', ',')
    : out.pricePerDay.toFixed(2).replace('.', ',')

  return (
    <div className="relative rounded-2xl overflow-hidden border border-hairline-hi bg-gradient-to-br from-noir-elevated to-noir-surface p-6 md:p-8">
      {/* Ambient accent halo top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 60%)' }}
      />

      <div className="relative">
        <Kicker className="mb-3">Koszt dziennej ochrony</Kicker>
        <div
          key={pricePerDayStr}
          className="flex items-baseline gap-3 mb-1 vc-hero-pulse"
        >
          <span className="font-impact italic font-black uppercase text-[clamp(3rem,9vw,5.5rem)] leading-[0.85] tabular-nums text-noir-bright">
            {pricePerDayStr}
          </span>
          <span className="font-impact italic font-black uppercase text-[1.5rem] leading-none text-accent">
            zł
          </span>
        </div>
        <p className="text-noir-muted text-[13px] leading-snug">
          / dzień · {pakiet.name} amortyzowane na okres&nbsp;posiadania
        </p>

        <div className="mt-7 pt-6 border-t border-hairline grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-4">
          <StatRow
            kicker="Próg opłacalności"
            value={out.prog === 1 ? '1 naprawa' : `${out.prog} naprawy`}
            sub="lakieru — wtedy folia się zwraca"
          />
          <StatRow
            kicker="Wartość rezydualna"
            value={`+${formatZl(out.rezydualna)}`}
            sub="przy sprzedaży · oryg. lakier"
          />
          <StatRow
            kicker="Tyle co"
            value={`${out.dniDeprecjacji} dni`}
            sub="naturalnej deprecjacji auta"
          />
          <StatRow
            kicker="Pierwszy odprysk"
            value={`~${out.pierwszyMies} mies.`}
            sub={`bez folii · ryzyko ${trasa.chipRisk}`}
          />
        </div>

        <p className="mt-6 pt-5 border-t border-hairline text-[11.5px] text-noir-faint leading-relaxed">
          Folia to{' '}
          <span className="text-noir-muted">
            {out.pricePct.toFixed(2).replace('.', ',')}%
          </span>{' '}
          wartości Twojego auta. Kalkulator zakłada przeciętny koszt jednej naprawy
          lakieru ≈ {formatZl(AVG_REPAIR_COST)} (rynek PL, warsztat blacharsko-lakier­niczy).
        </p>
      </div>
    </div>
  )
}

function StatRow({ kicker, value, sub }) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-widest text-noir-faint mb-1.5">
        {kicker}
      </p>
      <p className="font-impact italic font-black uppercase text-[1.35rem] leading-none text-accent mb-1.5 tabular-nums">
        {value}
      </p>
      <p className="text-[12px] text-noir-muted leading-snug">{sub}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Comparator — Bez PPF vs Z PPF (5-year horizon)                             */
/* -------------------------------------------------------------------------- */

function Comparator({ pakiet, pricePerDay, scenarioMultiplier = 1, profilCaption = '' }) {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  // Scale the fixed 5-year scenario to the user's km/rok + trasa profile.
  // Same events, more/fewer of them → cost rounded to nearest 100 zł.
  const scaledRows = SCENARIO_5Y.map((r) => ({
    ...r,
    cost: r.cost ? Math.round((r.cost * scenarioMultiplier) / 100) * 100 : null,
  }))
  const scaledTotal = scaledRows.reduce((s, r) => s + (r.cost || 0), 0)
  const multiplierLabel = scenarioMultiplier
    .toFixed(scenarioMultiplier >= 10 ? 0 : 1)
    .replace('.', ',')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const pricePerDayStr = pricePerDay >= 10
    ? pricePerDay.toFixed(1).replace('.', ',')
    : pricePerDay.toFixed(2).replace('.', ',')

  return (
    <div
      ref={ref}
      data-in-view={inView ? 'true' : 'false'}
      className="vc-compare mt-10 md:mt-14 rounded-2xl border border-hairline bg-noir-surface overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* LEFT — Bez PPF, accumulating */}
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-hairline">
          <p className="text-noir-faint font-display font-bold text-[11px] tracking-[0.22em] uppercase mb-3">
            Bez folii · 5 lat
          </p>
          <h3 className="font-impact italic font-black uppercase text-[1.6rem] md:text-[1.9rem] leading-[0.95] text-noir-bright mb-3">
            Co się dzieje<br />z&nbsp;lakierem.
          </h3>
          {profilCaption && (
            <p className="text-[11.5px] text-noir-faint mb-5">
              Skala dla profilu&nbsp;<span className="text-noir-muted">{profilCaption}</span> · &times;&nbsp;<span className="text-accent tabular-nums">{multiplierLabel}</span>
            </p>
          )}
          <ul className="space-y-2.5">
            {scaledRows.map((row, i) => (
              <li
                key={row.rok}
                className="vc-compare-row flex items-baseline justify-between gap-4 py-2 border-b border-hairline last:border-b-0"
                style={{ '--vc-delay': `${0.15 + i * 0.18}s` }}
              >
                <span className="flex items-baseline gap-3 min-w-0">
                  <span className="font-mono text-[11px] tabular-nums text-noir-faint shrink-0">
                    Rok&nbsp;{row.rok}
                  </span>
                  <span className="text-[13.5px] text-noir-muted leading-snug">
                    {row.label}
                  </span>
                </span>
                <span className="font-mono text-[12.5px] tabular-nums text-accent-hi whitespace-nowrap">
                  {row.cost ? formatZl(row.cost) : row.value}
                </span>
              </li>
            ))}
          </ul>
          <div
            className="vc-compare-row mt-5 pt-4 border-t border-hairline-hi flex items-baseline justify-between"
            style={{ '--vc-delay': `${0.15 + scaledRows.length * 0.18}s` }}
          >
            <span className="font-display font-bold text-[11px] uppercase tracking-[0.22em] text-noir-faint">
              Suma w&nbsp;5 lat
            </span>
            <span className="font-impact italic font-black uppercase text-[1.4rem] leading-none text-noir-bright tabular-nums">
              {formatZl(scaledTotal)}<span className="text-accent">+</span>
            </span>
          </div>
          <p className="mt-3 text-[11.5px] text-noir-faint leading-relaxed">
            +&nbsp;utrata oryginalnego lakieru. Po jakimkolwiek przemalowaniu
            auto zwykle traci kolejne kilka procent wartości przy sprzedaży.
          </p>
        </div>

        {/* RIGHT — Z PPF, flat */}
        <div className="p-6 md:p-8 bg-noir-deep">
          <p className="text-accent font-display font-bold text-[11px] tracking-[0.22em] uppercase mb-3">
            Z folią PPF · 10 lat
          </p>
          <h3 className="font-impact italic font-black uppercase text-[1.6rem] md:text-[1.9rem] leading-[0.95] text-noir-bright mb-5">
            Jeden koszt.<br />Zero śladów.
          </h3>
          <div className="space-y-3">
            <FlatRow kicker="Pakiet" value={pakiet.name} mono={false} />
            <FlatRow kicker="Koszt jednorazowy" value={`od ${formatZl(pakiet.priceFrom)}`} />
            <FlatRow kicker="Amortyzacja" value="10 lat gwarancji" mono={false} />
            <FlatRow kicker="Dziennie" value={`${pricePerDayStr} zł`} accent />
          </div>
          <div className="mt-6 pt-5 border-t border-hairline space-y-2">
            <Bullet>Lakier zostaje fabryczny — zero śladów po demontażu</Bullet>
            <Bullet>Mikrorysy znikają w&nbsp;cieple (samoregeneracja)</Bullet>
            <Bullet>Wyższa wartość odsprzedaży przy oryginalnym lakierze</Bullet>
          </div>
        </div>
      </div>
    </div>
  )
}

function FlatRow({ kicker, value, mono = true, accent = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-hairline last:border-b-0">
      <span className="text-[10.5px] uppercase tracking-widest text-noir-faint">
        {kicker}
      </span>
      <span
        className={`${mono ? 'font-mono tabular-nums' : 'font-display font-bold'} text-[13px] ${accent ? 'text-accent font-impact italic font-black uppercase text-[1.25rem] leading-none' : 'text-noir-bright'} whitespace-nowrap`}
      >
        {value}
      </span>
    </div>
  )
}

function Bullet({ children }) {
  return (
    <p className="flex items-start gap-2 text-[12.5px] text-noir-muted leading-snug">
      <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0" aria-hidden="true">
        <path d="M3 8l4 4 6-8" />
      </svg>
      <span>{children}</span>
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function shortPakietName(name) {
  // Compact display names for the 2×2 pakiet tabs grid.
  return name
    .replace('PPF reflektory', 'Reflektory')
    .replace('PPF pakiet front', 'Pakiet front')
    .replace('PPF całe auto', 'Całe auto')
    .replace('Zabezpieczenie progów PPF', 'Progi')
}
