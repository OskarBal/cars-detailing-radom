import { Link } from 'react-router-dom'
import { SERVICE_PAGE_BY_SLUG } from '../lib/service-pages.js'
import { BRAND } from '../lib/nav.js'

export default function ServiceLanding({ slug }) {
  const page = SERVICE_PAGE_BY_SLUG[slug]

  if (!page) return null

  return (
    <article className="bg-noir-deep text-noir-bright">
      <header className="relative overflow-hidden border-b border-hairline px-6 md:px-10 pt-32 md:pt-40 pb-16 md:pb-24">
        <div aria-hidden className="hero-bg absolute inset-0 opacity-30" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-noir-deep/80 via-noir-deep/78 to-noir-deep" />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            {page.eyebrow}
          </p>
          <h1 className="font-impact italic font-black uppercase leading-[0.92] text-[clamp(2.7rem,8vw,6rem)] max-w-5xl mb-6">
            {page.h1}
          </h1>
          <p className="text-noir-muted text-base md:text-lg leading-relaxed max-w-3xl">
            {page.lead}
          </p>
          <div className="flex flex-wrap gap-3 mt-9">
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center px-6 py-3.5 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-colors"
            >
              Zadzwoń i zapytaj
            </a>
            <Link
              to="/cennik"
              className="inline-flex items-center px-6 py-3.5 rounded text-accent border border-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent/10 transition-colors"
            >
              Zobacz cennik
            </Link>
          </div>
        </div>
      </header>

      <section className="px-6 md:px-10 py-14 md:py-20 border-b border-hairline">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-14">
          <div>
            <p className="text-noir-muted text-base md:text-lg leading-relaxed">
              {page.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {page.highlights.map((item) => (
              <div key={item} className="rounded border border-hairline bg-white/[0.035] p-5">
                <span className="block h-1 w-10 bg-accent mb-4" aria-hidden="true" />
                <p className="text-sm md:text-[15px] leading-relaxed text-noir-bright">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-14 md:py-20 border-b border-hairline">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 md:gap-14">
          <div>
            <p className="text-accent font-display font-bold text-[12px] tracking-[0.2em] uppercase mb-3">
              Jak pracujemy
            </p>
            <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.5rem)]">
              Proces bez zgadywania
            </h2>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.process.map((step, i) => (
              <li key={step} className="rounded border border-hairline p-5 bg-noir-surface/30">
                <span className="font-mono text-accent text-sm">0{i + 1}</span>
                <p className="mt-3 text-noir-muted leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 md:px-10 py-14 md:py-20 border-b border-hairline">
        <div className="mx-auto max-w-[1000px]">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.2em] uppercase mb-3">
            FAQ
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.5rem)] mb-8">
            Najczęstsze pytania
          </h2>
          <div className="space-y-4">
            {page.faq.map((item) => (
              <section key={item.q} className="rounded border border-hairline p-5 md:p-6 bg-white/[0.03]">
                <h3 className="font-display font-bold text-base md:text-lg text-noir-bright mb-2">{item.q}</h3>
                <p className="text-noir-muted leading-relaxed">{item.a}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <nav className="px-6 md:px-10 py-12 md:py-16" aria-label="Powiązane strony">
        <div className="mx-auto max-w-[1400px] flex flex-wrap gap-3">
          {page.related.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center px-5 py-3 rounded border border-hairline text-noir-muted hover:border-accent hover:text-accent transition-colors uppercase font-display font-bold text-[12px] tracking-[0.12em]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </article>
  )
}
