export default function About() {
  return (
    <section
      id="o-nas"
      aria-label="O nas"
      className="relative bg-noir-deep text-noir-bright pt-10 md:pt-16 pb-20 md:pb-32 px-6 md:px-10"
    >
      <div className="mx-auto max-w-[1100px] grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16 items-center">

        <div>
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            O&nbsp;nas
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5.2vw,3.6rem)] mb-6">
            Detailing,<br />nie&nbsp;mycie.
          </h2>
          <div className="space-y-4 text-noir-muted leading-relaxed text-[15px] md:text-base max-w-prose">
            <p>
              Cars Detailing Radom to studio detailingu prowadzone z&nbsp;pasją do&nbsp;samochodów.
              Pracujemy precyzyjnie, bez&nbsp;skrótów — w&nbsp;tempie, jakiego wymaga prawdziwa pielęgnacja lakieru.
            </p>
            <p>
              Każdy projekt traktujemy indywidualnie. Premium kosmetyki, sprawdzone procedury,
              uczciwa wycena. Jeśli&nbsp;szukasz miejsca, w&nbsp;którym Twoje&nbsp;auto dostanie pełną uwagę
              — jesteś&nbsp;w&nbsp;dobrym&nbsp;miejscu.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <Stat value="100%" label="Pasja" />
            <Stat value="7"    label="Dni w tygodniu" />
            <Stat value={<InfinityGlyph />} label="Cierpliwości" />
          </dl>
        </div>

        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-hairline bg-noir-surface">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-bg.webp')" }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-deep/60 to-transparent" aria-hidden />
        </div>

      </div>
    </section>
  )
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col">
      <dt className="font-impact italic font-black uppercase text-3xl text-noir-bright leading-none">{value}</dt>
      <dd className="mt-1 font-display text-[11px] tracking-[0.14em] uppercase text-noir-faint">{label}</dd>
    </div>
  )
}

function InfinityGlyph() {
  return (
    <svg
      viewBox="0 0 40 22"
      width="44"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="∞"
      style={{ display: 'block' }}
    >
      <path d="M6 11 C 6 4, 16 4, 20 11 C 24 18, 34 18, 34 11 C 34 4, 24 4, 20 11 C 16 18, 6 18, 6 11" />
    </svg>
  )
}
