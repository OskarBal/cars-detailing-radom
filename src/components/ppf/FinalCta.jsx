import { Link } from 'react-router-dom'

// Final CTA — always has a package selected, so copy is single-state.
export default function FinalCta({ onOpenForm, activePackage }) {
  return (
    <section
      aria-label="Wycena PPF"
      className="relative bg-noir-surface px-6 md:px-10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
          Konfiguracja → wycena
        </p>
        <h2 className="font-impact italic font-black uppercase leading-[0.92] text-[clamp(2rem,6vw,4rem)] mb-6">
          Wyślij wybrany pakiet.
        </h2>
        <p className="text-noir-muted text-base md:text-lg leading-relaxed mb-8 max-w-prose mx-auto">
          {activePackage
            ? `Wybrałeś ${activePackage.name}. Zostaw kontakt i markę auta — oddzwonimy w 15 minut z dokładną wyceną i terminem.`
            : 'Wybierz pakiet powyżej, zostaw kontakt i markę auta — oddzwonimy w 15 minut z dokładną wyceną i terminem.'}
        </p>
        <button
          type="button"
          onClick={onOpenForm}
          className="cta-magic inline-flex items-center gap-2.5 px-8 py-4 rounded uppercase font-display font-bold text-[13.5px] tracking-[0.12em] transition-all border bg-transparent text-accent border-accent hover:text-accent-hi"
        >
          <span className="relative z-[1]">Wyślij konfigurację</span>
          <svg className="relative z-[1]" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
        <p className="mt-6 text-sm text-noir-faint">
          Albo zadzwoń:{' '}
          <a href="tel:+48690426050" className="text-noir-bright hover:text-accent transition-colors font-mono">
            +48 690 426 050
          </a>
          {' · '}
          <Link to="/cennik" className="hover:text-accent transition-colors">
            zobacz pełen cennik
          </Link>
        </p>
      </div>
    </section>
  )
}
