import { Link } from 'react-router-dom'

const SERVICES = [
  {
    title: 'Powłoki ceramiczne',
    body: 'Trwała ochrona lakieru, efekt głębi i hydrofobowość na lata.',
    icon: 'sparkle',
  },
  {
    title: 'PPF — folia ochronna',
    body: 'Niewidoczna powłoka chroniąca lakier przed kamieniami i otarciami.',
    icon: 'shield',
  },
  {
    title: 'Korekta lakieru',
    body: 'Usunięcie rys, hologramów, śladów po myjniach automatycznych.',
    icon: 'polish',
  },
  {
    title: 'Pranie tapicerki',
    body: 'Wnętrze jak nowe — siedzenia, sufit, wykładziny, plamy i zapachy.',
    icon: 'seat',
  },
  {
    title: 'Door-to-door',
    body: 'Odbieramy i&nbsp;odwozimy auto pod wskazany adres w&nbsp;Radomiu.',
    icon: 'truck',
  },
  {
    title: 'Mobilny serwis',
    body: 'Przyjedziemy do&nbsp;Ciebie i&nbsp;wykonamy usługę na&nbsp;miejscu.',
    icon: 'pin',
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

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((s) => (
            <li
              key={s.title}
              className="group relative p-6 md:p-7 rounded-2xl border border-hairline bg-noir-elevated transition-all duration-400 hover:border-accent/40 hover:-translate-y-0.5"
            >
              <div className="text-accent mb-5">
                <ServiceIcon name={s.icon} />
              </div>
              <h3 className="font-display font-bold text-base md:text-lg mb-2 text-noir-bright">{s.title}</h3>
              <p className="text-sm md:text-[15px] text-noir-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />
            </li>
          ))}
        </ul>

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

function ServiceIcon({ name }) {
  const common = {
    width: 36, height: 36, viewBox: '0 0 32 32',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.4,
    strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
  }
  switch (name) {
    case 'sparkle': return (
      <svg {...common}>
        <path d="M16 4l2.5 7L26 13l-7.5 2L16 22l-2.5-7L6 13l7.5-2z" />
        <path d="M24 22l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </svg>
    )
    case 'shield': return (
      <svg {...common}>
        <path d="M16 3l11 4v8c0 7-5 12-11 14-6-2-11-7-11-14V7z" />
      </svg>
    )
    case 'polish': return (
      <svg {...common}>
        <circle cx="16" cy="16" r="11" />
        <circle cx="16" cy="16" r="5" />
        <path d="M16 5v3M16 24v3M5 16h3M24 16h3" />
      </svg>
    )
    case 'seat': return (
      <svg {...common}>
        <path d="M8 4h6a4 4 0 0 1 4 4v8H8z" />
        <path d="M8 16h14v5a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" />
        <path d="M11 23v4M19 23v4" />
      </svg>
    )
    case 'truck': return (
      <svg {...common}>
        <path d="M3 8h13v12H3z" />
        <path d="M16 12h6l4 4v4h-10z" />
        <circle cx="8" cy="22" r="2" />
        <circle cx="22" cy="22" r="2" />
      </svg>
    )
    case 'pin': return (
      <svg {...common}>
        <path d="M16 3a9 9 0 0 1 9 9c0 7-9 17-9 17S7 19 7 12a9 9 0 0 1 9-9z" />
        <circle cx="16" cy="12" r="3" />
      </svg>
    )
    default: return null
  }
}
