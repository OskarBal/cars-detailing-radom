import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function LegalLayout({ title, kicker, updated, children }) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} · Cars Detailing Radom`
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => { document.title = prev }
  }, [title])

  return (
    <main className="bg-noir-deep text-noir-bright">
      <div className="mx-auto max-w-[820px] px-6 md:px-10 pt-32 md:pt-40 pb-24 md:pb-32">

        <p className="text-[11px] tracking-[0.22em] uppercase font-bold text-accent mb-3">
          {kicker}
        </p>
        <h1 className="font-impact italic text-4xl md:text-6xl uppercase leading-[0.95] tracking-tight mb-4">
          {title}
        </h1>
        {updated && (
          <p className="text-sm text-noir-faint mb-12">Ostatnia aktualizacja: {updated}</p>
        )}

        <article className="legal-prose">
          {children}
        </article>

        <div className="mt-16 pt-8 border-t border-hairline flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/regulamin" className="text-noir-muted hover:text-accent transition-colors">Regulamin</Link>
          <Link to="/polityka-prywatnosci" className="text-noir-muted hover:text-accent transition-colors">Polityka prywatności</Link>
          <Link to="/cookies" className="text-noir-muted hover:text-accent transition-colors">Cookies</Link>
          <Link to="/" className="text-noir-muted hover:text-accent transition-colors ml-auto">← Powrót do strony głównej</Link>
        </div>
      </div>
    </main>
  )
}
