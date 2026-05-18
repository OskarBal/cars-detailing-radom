// Cennik configurator — to be ported from legacy site (cennik.js + Cennik_Uslug.md).
// v1: placeholder so the route resolves and CTAs don't 404.

import { Link } from 'react-router-dom'

export default function Cennik() {
  return (
    <section
      aria-label="Cennik"
      className="relative min-h-svh bg-noir-deep text-noir-bright pt-32 pb-20 px-6 md:px-10 grid place-items-center"
    >
      <div className="max-w-2xl text-center">
        <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
          Cennik
        </p>
        <h1 className="font-impact italic font-black uppercase leading-[0.92] text-[clamp(2.4rem,7vw,4.4rem)] mb-6">
          Wkrótce.<br />Pełen&nbsp;konfigurator&nbsp;usług.
        </h1>
        <p className="text-noir-muted text-base md:text-lg leading-relaxed mb-8">
          Tutaj zamieszkają wszystkie 41 usług w&nbsp;8&nbsp;kategoriach z&nbsp;interaktywnym kalkulatorem
          i&nbsp;formularzem szczegółowej wyceny.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="tel:+48690426050"
            className="inline-flex items-center px-6 py-3.5 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-colors"
          >
            Zadzwoń po wycenę
          </a>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3.5 rounded text-accent border border-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent/10 transition-colors"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </section>
  )
}
