import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section
      aria-label="Strona nie znaleziona"
      className="relative min-h-svh bg-noir-deep text-noir-bright pt-32 pb-20 px-6 grid place-items-center"
    >
      <div className="max-w-md text-center">
        <p className="font-impact italic font-black uppercase leading-none text-[clamp(5rem,18vw,11rem)] text-accent">404</p>
        <h1 className="font-display font-bold text-xl tracking-wider uppercase mb-3 mt-4">Nie znaleźliśmy tej strony</h1>
        <p className="text-noir-muted mb-8">Spróbuj jeszcze raz albo wróć na&nbsp;stronę główną.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3.5 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-colors"
        >
          Strona główna
        </Link>
      </div>
    </section>
  )
}
