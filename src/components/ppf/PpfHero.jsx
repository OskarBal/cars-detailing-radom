// Page hero. Copy is package-led — "wybierz pakiet" instead of "klikaj strefy",
// matching the new photo-crossfade UX.
export default function PpfHero() {
  return (
    <section
      aria-label="PPF — folia ochronna"
      className="relative bg-noir-deep text-noir-bright pt-32 md:pt-40 pb-12 md:pb-16 px-6 md:px-10 border-b border-hairline overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
          Folia ochronna · PPF
        </p>
        <h1 className="font-impact italic font-black uppercase leading-[0.92] text-[clamp(2.6rem,8vw,5.6rem)] mb-6 max-w-5xl">
          Folia, której nie&nbsp;widać.<br />Tarcza, która chroni 10&nbsp;lat.
        </h1>
        <p className="text-noir-muted text-base md:text-lg leading-relaxed max-w-2xl">
          Wybierz pakiet ochrony — widzisz dokładnie, które elementy
          obejmuje folia. Wysyłasz konfigurację jednym kliknięciem.
          Oddzwonimy z&nbsp;dokładną wyceną w&nbsp;15&nbsp;minut.
        </p>
      </div>
    </section>
  )
}
