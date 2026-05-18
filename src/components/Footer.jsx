import { Link } from 'react-router-dom'
import { BRAND, NAV_ITEMS } from '../lib/nav.js'

export default function Footer() {
  return (
    <footer className="bg-noir-surface border-t border-hairline">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-12 md:py-16 grid gap-10 md:grid-cols-3">

        <div>
          <img src="/logo.webp" alt={BRAND.name} className="h-12 w-auto mix-blend-screen mb-4" />
          <p className="text-sm text-noir-muted leading-relaxed max-w-xs">
            Studio detailingu premium w&nbsp;Radomiu. Ceramika, PPF, korekta lakieru, pranie tapicerki, door-to-door.
          </p>
        </div>

        <nav aria-label="Stopka — nawigacja" className="flex flex-col gap-3">
          <h3 className="font-impact italic text-xl tracking-wide uppercase text-noir-bright">Nawigacja</h3>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.to + (item.hash || '')}
                  className="text-sm text-noir-muted hover:text-accent transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="font-impact italic text-xl tracking-wide uppercase text-noir-bright">Kontakt</h3>
          <a href={BRAND.phoneHref} className="text-sm text-noir-muted hover:text-accent transition-colors font-mono">
            {BRAND.phone}
          </a>
          <a
            href={BRAND.gbpUrl}
            target="_blank" rel="noopener"
            className="text-sm text-noir-muted hover:text-accent transition-colors"
          >
            {BRAND.address}
          </a>
        </div>

      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-noir-faint">
            © {new Date().getFullYear()} {BRAND.name}. Wszystkie prawa zastrzeżone.
          </p>
          <Link to="/regulamin" className="text-xs text-noir-faint hover:text-accent transition-colors">
            Regulamin
          </Link>
        </div>
      </div>
    </footer>
  )
}
