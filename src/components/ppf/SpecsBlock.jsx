const SPECS = [
  { label: 'Gwarancja',        value: '10 lat',                                                  sub: 'na samą folię' },
  { label: 'Samoregeneracja',  value: 'Tak',                                                     sub: 'mikrorysy znikają w cieple' },
  { label: 'Hydrofobowość',    value: 'Top coat',                                                sub: 'woda spływa, kurz nie wnika' },
  // Unit wrapped in normal-case span so CSS `uppercase` on the parent doesn't
  // flip the micro sign (µ) to capital Greek mu (Μ).
  { label: 'Grubość',          value: <>~200&nbsp;<span className="normal-case">µm</span></>,    sub: '4× grubsza niż lakier' },
  { label: 'UV stability',     value: 'No-yellowing',                                            sub: 'nie żółknie pod słońcem' },
  { label: 'Demontaż',         value: 'Bez śladu',                                               sub: 'lakier wraca do stanu wyjściowego' },
]

export default function SpecsBlock() {
  return (
    <section
      aria-label="Specyfikacja folii"
      className="relative bg-noir-surface px-6 md:px-10 py-16 md:py-24 border-b border-hairline"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Specyfikacja
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.6rem)] mb-4">
            Czym się różni<br />nasza folia.
          </h2>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed">
            Premium PPF — nie folia z marketu. Pełna gwarancja, samoregeneracja, hydrofobowy top coat, brak żółknięcia. Markę folii potwierdzimy na rozmowie — pracujemy tylko z marką, której ufamy.
          </p>
        </header>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {SPECS.map((s) => (
            <li
              key={s.label}
              className="bg-noir-deep px-5 md:px-6 py-5 md:py-6"
            >
              <p className="text-[10.5px] uppercase tracking-widest text-noir-faint mb-2">
                {s.label}
              </p>
              <p className="font-impact italic font-black uppercase text-[1.4rem] md:text-[1.7rem] leading-none text-noir-bright">
                {s.value}
              </p>
              <p className="mt-1.5 text-[12.5px] text-noir-muted leading-snug">
                {s.sub}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
