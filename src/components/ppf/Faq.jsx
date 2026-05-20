const FAQ = [
  {
    q: 'Ile lat trzyma folia PPF?',
    a: 'Producent daje 10 lat gwarancji na samą folię. Realnie — zdejmujesz ją, kiedy zmieniasz auto. Lakier pod spodem wraca do stanu fabrycznego, bez śladu po klejeniu.',
  },
  {
    q: 'Ile czasu zajmuje aplikacja?',
    a: 'PPF reflektory / progi — 1 dzień. PPF pakiet front — 2 dni. PPF całe auto — 5–7 dni. Pełen termin dostajesz po wycenie, planujemy z wyprzedzeniem żebyś nie musiał oddawać auta na ostatnią chwilę.',
  },
  {
    q: 'Czy mogę normalnie jeździć po aplikacji?',
    a: 'Tak. Folia jest gotowa do jazdy od razu — pierwsze 48&nbsp;godzin omijaj tylko myjnię automatyczną i chemię. Po tygodniu pełna twardość, jeździsz bez ograniczeń.',
  },
  {
    q: 'Można folię zdjąć?',
    a: 'Tak, bez śladu, bez uszkodzenia lakieru. Dlatego PPF kupują ludzie szykujący auto pod sprzedaż lub leasing — folia chroni przez kilka lat, a oddajesz auto z lakierem jak nowy.',
  },
  {
    q: 'Czy można nałożyć na używane auto?',
    a: 'Tak, ale lakier musi być czysty i bez głębszych rys. Robimy zawsze korektę lakieru przed PPF — folia konserwuje stan, w którym auto wychodzi z naszego studio.',
  },
  {
    q: 'Jaką markę folii stosujecie?',
    a: 'Pracujemy z marką potwierdzoną na rozmowie. Każda nasza folia ma 10-letnią gwarancję producenta, samoregenerację, hydrofobowy top coat i certyfikat niezżółknięcia.',
  },
]

export default function Faq() {
  return (
    <section
      aria-label="FAQ — PPF"
      className="relative bg-noir-deep px-6 md:px-10 py-16 md:py-24 border-b border-hairline"
    >
      <div className="mx-auto max-w-[860px]">
        <header className="mb-10 md:mb-12 text-center">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            FAQ
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5vw,3.4rem)]">
            Pytania, które padają najczęściej.
          </h2>
        </header>
        <ul className="border-t border-hairline">
          {FAQ.map((item) => (
            <li key={item.q} className="border-b border-hairline">
              <details className="group">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none">
                  <span className="font-impact italic font-black uppercase text-[1.05rem] md:text-[1.2rem] leading-tight">
                    {item.q}
                  </span>
                  <span aria-hidden="true" className="shrink-0 w-7 h-7 grid place-items-center rounded-full border border-hairline-hi text-noir-muted group-open:rotate-45 group-open:text-accent transition-all duration-300">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </summary>
                <p
                  className="pb-5 pr-10 text-[14.5px] text-noir-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
