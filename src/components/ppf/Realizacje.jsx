const CARS = [
  {
    src: '/ppf/realizacje/01-hood-hex-application.webp',
    alt: 'Aplikacja folii PPF na masce auta — pomiar i wyrównanie pod oświetleniem hex w studio Cars Detailing Radom.',
    ratio: '4 / 3',
    label: 'Maska · pomiar i wyrównanie',
  },
  {
    src: '/ppf/realizacje/02-rear-squeegee.webp',
    alt: 'Aplikacja folii PPF na tylnym błotniku ciemnego auta — wyciąganie pęcherzy pod światłem warsztatowym.',
    ratio: '3 / 4',
    label: 'Tylny błotnik · wyciąganie folii',
  },
  {
    src: '/ppf/realizacje/03-film-overlay.webp',
    alt: 'Naciąganie arkusza folii PPF na granat metaliczny — etap roztworu aktywującego klej.',
    ratio: '3 / 4',
    label: 'Front · naciąganie arkusza',
  },
  {
    src: '/ppf/realizacje/04-bonnet-cut.webp',
    alt: 'Precyzyjne wykończenie krawędzi folii PPF na masce auta — domykanie linii skalpelem.',
    ratio: '3 / 4',
    label: 'Krawędź maski · wykończenie',
  },
]

const BOAT = {
  src: '/ppf/realizacje/05-boat-polish.webp',
  alt: 'Polerowanie kadłuba łodzi motorowej w hali Cars Detailing Radom — przygotowanie pod zabezpieczenie powłoką.',
  ratio: '700 / 1516',
  label: 'Łódź motorowa · polerka kadłuba',
}

export default function Realizacje() {
  return (
    <section
      id="realizacje-ppf"
      aria-label="Realizacje PPF"
      className="relative bg-noir-surface px-6 md:px-10 py-16 md:py-24 border-b border-hairline"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Realizacje PPF
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.6rem)] mb-4">
            Z naszego studio na Opolskiej.
          </h2>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed">
            Kawałek warsztatu — moment, w&nbsp;którym folia ląduje na karoserii.
            Pomiar, naciąganie, wyciąganie pęcherzy, domykanie krawędzi.
          </p>
        </header>

        <RealizacjaCard
          item={CARS[0]}
          eager
          className="mb-5 md:mb-6"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {CARS.slice(1).map((item) => (
            <RealizacjaCard key={item.src} item={item} />
          ))}
        </div>

        <div className="mt-14 md:mt-20 pt-10 md:pt-12 border-t border-hairline">
          <p className="text-accent font-display font-bold text-[11px] tracking-[0.22em] uppercase mb-3">
            Łodzie i sprzęt
          </p>
          <h3 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(1.5rem,3.5vw,2.4rem)] mb-3">
            Nie tylko auta.
          </h3>
          <p className="text-noir-muted text-base md:text-[17px] leading-relaxed mb-8 max-w-2xl">
            Łodzie, motocykle, sprzęt firmowy — wszędzie tam, gdzie powierzchnia musi przetrwać sezon
            w&nbsp;trudniejszych warunkach niż auto na ulicy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,380px)_1fr] gap-6 md:gap-10 items-start">
            <RealizacjaCard item={BOAT} />
            <ul className="text-noir-muted text-[15px] md:text-base leading-relaxed space-y-3 md:pt-2">
              <li>
                <span className="text-noir-bright font-display font-bold uppercase tracking-wide text-[12px] mr-2">Kadłub:</span>
                korekta lakieru + powłoka ochronna pod sezon na wodzie.
              </li>
              <li>
                <span className="text-noir-bright font-display font-bold uppercase tracking-wide text-[12px] mr-2">Pokład:</span>
                przygotowanie powierzchni, antypoślizg, ochrona elementów żelkotu.
              </li>
              <li>
                <span className="text-noir-bright font-display font-bold uppercase tracking-wide text-[12px] mr-2">Wycena:</span>
                indywidualna — długość, stan, zakres pracy. Zadzwoń, ustalimy zakres na miejscu.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function RealizacjaCard({ item, eager = false, className = '' }) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-xl border border-hairline-hi bg-noir-deep ${className}`}
      style={{ aspectRatio: item.ratio }}
    >
      <img
        src={item.src}
        alt={item.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.03]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />
      <figcaption className="absolute left-4 bottom-4 right-4 text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-display font-bold text-white/90">
        {item.label}
      </figcaption>
    </figure>
  )
}
