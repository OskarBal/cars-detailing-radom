export default function RealizacjePlaceholder() {
  return (
    <section
      aria-label="Realizacje PPF"
      className="relative bg-noir-surface px-6 md:px-10 py-16 md:py-24 border-b border-hairline"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Realizacje PPF
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.6rem)] mb-4">
            Auta, które zapakowaliśmy.
          </h2>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed">
            Pełne realizacje PPF z naszego studio na Opolskiej.
            Galeria w&nbsp;przygotowaniu — pierwszy przegląd po Meeting&nbsp;#2.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PlaceholderCard label="Audi RS6 · PPF pakiet front" />
          <PlaceholderCard label="Mercedes G-Brabus · PPF całe auto" />
        </div>
      </div>
    </section>
  )
}

function PlaceholderCard({ label }) {
  return (
    <div className="relative aspect-[4/3] rounded-xl border border-hairline-hi bg-noir-deep overflow-hidden grid place-items-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent 0 10px, rgba(184,33,25,0.05) 10px 11px)',
        }}
      />
      <div className="relative text-center px-6">
        <p className="text-[11px] uppercase tracking-widest text-noir-faint mb-2">
          Wkrótce
        </p>
        <p className="font-impact italic font-black uppercase text-[1.4rem] leading-tight text-noir-muted">
          {label}
        </p>
      </div>
    </div>
  )
}
