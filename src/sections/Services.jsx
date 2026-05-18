import { Link } from 'react-router-dom'

const SERVICES = [
  {
    num: '01',
    title: 'Powłoki ceramiczne',
    body: 'Trwała ochrona lakieru, efekt głębi i&nbsp;hydrofobowość na&nbsp;lata.',
    price: 'OD 1 600 ZŁ',
    href: '/cennik#powloki-ochronne',
  },
  {
    num: '02',
    title: 'PPF — folia ochronna',
    body: 'Niewidoczna powłoka chroniąca lakier przed kamieniami i&nbsp;otarciami.',
    price: 'OD 4 500 ZŁ',
    href: '/cennik#folie-ppf',
  },
  {
    num: '03',
    title: 'Korekta lakieru',
    body: 'Usunięcie rys, hologramów i&nbsp;śladów po myjniach automatycznych.',
    price: 'OD 800 ZŁ',
    href: '/cennik#korekta-lakieru',
  },
  {
    num: '04',
    title: 'Detailing wnętrza',
    body: 'Kompleksowe odświeżenie wnętrza — plastiki, szyby, podsufitka, dressing.',
    price: 'OD 250 ZŁ',
    href: '/cennik#detailing-wnetrza',
  },
  {
    num: '05',
    title: 'Pranie tapicerki',
    body: 'Wnętrze jak nowe — siedzenia, sufit, wykładziny, plamy i&nbsp;zapachy.',
    price: 'OD 400 ZŁ',
    href: '/cennik#pranie-tapicerki',
  },
  {
    num: '06',
    title: 'Pakiety',
    body: '3 gotowe pakiety, największa wartość za&nbsp;cenę.',
    price: 'OD 250 ZŁ',
    href: '/cennik#detailing-wnetrza',
    featured: true,
  },
  {
    num: '07',
    title: 'Door-to-door',
    body: 'Odbieramy i&nbsp;odwozimy auto pod wskazany adres w&nbsp;Radomiu.',
    price: 'Wycena indyw.',
    href: '/cennik#logistyka',
  },
]

export default function Services() {
  return (
    <section
      id="uslugi"
      aria-label="Usługi"
      className="relative bg-noir-surface text-noir-bright py-20 md:py-32 px-6 md:px-10 border-t border-hairline"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-12 md:mb-16 max-w-2xl">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Usługi
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5.2vw,3.6rem)] mb-4">
            Pełna pielęgnacja,<br />jedno&nbsp;studio.
          </h2>
          <p className="text-noir-muted text-base md:text-lg leading-relaxed">
            Od&nbsp;szybkiego odświeżenia po pełną korektę lakieru i&nbsp;ceramikę.
            Każda usługa wykonywana ręcznie, z&nbsp;dbałością o&nbsp;szczegóły.
          </p>
        </header>

        <ol className="border-t border-hairline">
          {SERVICES.map((s) => (
            <li key={s.num} className="border-b border-hairline">
              <Link
                to={s.href}
                className={`group block py-6 md:py-9 transition-colors duration-300 ${
                  s.featured
                    ? 'bg-accent/[0.05] hover:bg-accent/[0.10]'
                    : 'hover:bg-noir-elevated/30'
                }`}
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span
                    className={`shrink-0 w-12 md:w-24 font-impact italic font-black transition-colors duration-300 leading-none tabular-nums ${
                      s.featured
                        ? 'text-accent'
                        : 'text-noir-faint group-hover:text-accent'
                    }`}
                    style={{ fontSize: 'clamp(2.4rem, 6vw, 4.25rem)' }}
                  >
                    {s.num}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 md:gap-8">
                      <h3
                        className={`font-impact italic font-black uppercase transition-colors duration-300 leading-[1.04] min-w-0 ${
                          s.featured
                            ? 'text-accent group-hover:text-accent-hi'
                            : 'text-noir-bright group-hover:text-accent-hi'
                        }`}
                        style={{ fontSize: 'clamp(1.3rem, 3.6vw, 2.5rem)' }}
                      >
                        {s.title}
                      </h3>
                      <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <span
                          className={`font-display font-bold text-[10px] md:text-[11.5px] tracking-[0.14em] uppercase px-2.5 py-1.5 border rounded whitespace-nowrap transition-colors duration-300 ${
                            s.featured
                              ? 'text-accent border-accent group-hover:text-accent-hi group-hover:border-accent-hi'
                              : 'text-noir-bright border-hairline group-hover:border-accent group-hover:text-accent'
                          }`}
                        >
                          {s.price}
                        </span>
                        <span className="text-accent transition-transform duration-400 group-hover:translate-x-1.5 shrink-0">
                          <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <p
                      className={`mt-2 md:mt-3 text-[13.5px] md:text-[15px] leading-relaxed max-w-[60ch] transition-colors duration-300 ${
                        s.featured ? 'text-accent group-hover:text-accent-hi' : 'text-noir-muted'
                      }`}
                      dangerouslySetInnerHTML={{ __html: s.body }}
                    />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12 md:mt-14 flex flex-wrap items-center gap-4">
          <Link
            to="/cennik"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] transition-all duration-400 hover:bg-accent-hi"
          >
            <span>Zobacz pełny cennik</span>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <span className="text-sm text-noir-faint">41 usług w&nbsp;8&nbsp;kategoriach</span>
        </div>
      </div>
    </section>
  )
}
