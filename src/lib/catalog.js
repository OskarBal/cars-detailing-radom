// Service catalog — Cars Detailing Radom
// Source: ../Cennik_Uslug.md (owner-supplied 2026-05-15).
// All prices are "od X zł" anchors — actual jobs are quoted per car.
// Category slugs match the hash anchors used from Services.jsx on the home page.

export const CATEGORIES = [
  {
    slug: 'powloki-ochronne',
    name: 'Powłoki ochronne',
    lede: 'Trwała ochrona lakieru — od 1 sezonu po 5 lat. Hydrofobowość, blask, odporność na środki chemiczne.',
    services: [
      { id: 'powloka-roczna',            name: 'Roczna powłoka ochronna',         priceFrom: 500 },
      { id: 'ceramika-3lat',             name: '3-letnia powłoka ceramiczna',     priceFrom: 1600, anchor: true },
      { id: 'ceramika-5lat',             name: '5-letnia powłoka ceramiczna',     priceFrom: 2500, anchor: true },
      { id: 'elastomer',                 name: 'Powłoka elastomerowa',            priceFrom: 2200 },
      { id: 'felgi-ceramika',            name: 'Zabezpieczenie felg ceramiką',    priceFrom: 300 },
      { id: 'powloka-szyby',             name: 'Powłoka na szyby',                priceFrom: 150 },
    ],
  },
  {
    slug: 'folie-ppf',
    name: 'Folie PPF',
    lede: 'Niewidoczna folia ochronna — chroni lakier przed kamieniami, otarciami i mikrorysami. Od reflektorów po całe auto.',
    services: [
      { id: 'ppf-reflektory',            name: 'PPF reflektory',                  priceFrom: 300 },
      { id: 'ppf-front',                 name: 'PPF pakiet front',                priceFrom: 4500, anchor: true },
      { id: 'ppf-cale-auto',             name: 'PPF całe auto',                   priceFrom: 15000, anchor: true },
      { id: 'ppf-progi',                 name: 'Zabezpieczenie progów PPF',       priceFrom: 500 },
    ],
  },
  {
    slug: 'korekta-lakieru',
    name: 'Korekta lakieru',
    lede: 'Usunięcie rys, hologramów, śladów po myjniach automatycznych. Maszynowa polerka, krok po kroku.',
    services: [
      { id: 'odswiezenie',               name: 'Odświeżenie lakieru (One Step)',  priceFrom: 800 },
      { id: 'korekta-2etap',             name: 'Dwuetapowa korekta lakieru',      priceFrom: 1500 },
      { id: 'korekta-wieloetap',         name: 'Wieloetapowa korekta lakieru',    quoteOnRequest: true },
      { id: 'polerowanie-reflektorow',   name: 'Polerowanie reflektorów',         priceFrom: 150 },
      { id: 'polerowanie-szyb',          name: 'Polerowanie szyb',                priceFrom: 200 },
      { id: 'hologramy',                 name: 'Usuwanie hologramów i mikrorys',  priceFrom: 700 },
    ],
  },
  {
    slug: 'detailing-wnetrza',
    name: 'Detailing wnętrza · pakiety',
    lede: 'Trzy gotowe pakiety wnętrza — od szybkiego odświeżenia po pełne przygotowanie auta pod sprzedaż.',
    isPackages: true,
    services: [
      {
        id: 'pakiet-podstawowy',
        name: 'Pakiet podstawowy',
        priceFrom: 250,
        includes: ['Odkurzanie wnętrza', 'Czyszczenie plastików', 'Mycie szyb', 'Dressing wnętrza'],
      },
      {
        id: 'pakiet-kompleksowy',
        name: 'Pakiet kompleksowy',
        priceFrom: 500,
        includes: [
          'Dokładne odkurzanie',
          'Czyszczenie plastików',
          'Pranie tapicerki',
          'Czyszczenie podsufitki',
          'Czyszczenie bagażnika',
          'Mycie szyb',
          'Dressing wnętrza',
        ],
      },
      {
        id: 'pakiet-pod-sprzedaz',
        name: 'Pakiet „pod sprzedaż"',
        priceFrom: 800,
        anchor: true,
        includes: [
          'Kompleksowe czyszczenie wnętrza',
          'Odświeżenie lakieru',
          'Dressing opon i plastików',
          'Przygotowanie auta do zdjęć sprzedażowych',
        ],
      },
    ],
  },
  {
    slug: 'pranie-tapicerki',
    name: 'Pranie tapicerki',
    lede: 'Wnętrze jak nowe — siedzenia, sufit, wykładziny. Wyciąganie plam, zapachów, czyszczenie skóry.',
    services: [
      { id: 'pranie-foteli',             name: 'Pranie foteli',                   priceFrom: 200 },
      { id: 'pranie-kanapy',             name: 'Pranie kanapy',                   priceFrom: 150 },
      { id: 'pranie-wnetrza',            name: 'Pranie całego wnętrza',           priceFrom: 400 },
      { id: 'podsufitka',                name: 'Czyszczenie podsufitki',          priceFrom: 150 },
      { id: 'skora-impregnacja',         name: 'Czyszczenie skóry + impregnacja', priceFrom: 300 },
    ],
  },
  {
    slug: 'mycie-zewnetrzne',
    name: 'Mycie i pielęgnacja zewnętrzna',
    lede: 'Mycie ręczne dwuwiaderkowe, dekontaminacja, glinkowanie. Punkty bazowe każdej większej usługi.',
    services: [
      { id: 'mycie-detailingowe',        name: 'Mycie detailingowe',              priceFrom: 80 },
      { id: 'aktywna-piana',             name: 'Aktywna piana + mycie ręczne',    priceFrom: 70 },
      { id: 'dekontaminacja',            name: 'Dekontaminacja lakieru',          priceFrom: 150 },
      { id: 'glinkowanie',               name: 'Glinkowanie lakieru',             priceFrom: 150 },
      { id: 'felgi-opony',               name: 'Czyszczenie felg i opon',         priceFrom: 80 },
      { id: 'dressing',                  name: 'Dressing opon i plastików',       priceFrom: 50 },
      { id: 'komora-silnika',            name: 'Mycie komory silnika',            priceFrom: 120 },
      { id: 'niewidzialna-wycieraczka',  name: 'Niewidzialna wycieraczka',        priceFrom: 100 },
      { id: 'woskowanie',                name: 'Woskowanie lakieru',              priceFrom: 150 },
    ],
  },
  {
    slug: 'uslugi-dodatkowe',
    name: 'Usługi dodatkowe',
    lede: 'Ozonowanie, dezynfekcja klimy, sierść, zapachy — dodatki dopinane do każdej usługi wnętrza.',
    services: [
      { id: 'ozonowanie',                name: 'Ozonowanie wnętrza',              priceFrom: 100 },
      { id: 'klimatyzacja',              name: 'Dezynfekcja klimatyzacji',        priceFrom: 80 },
      { id: 'siersc',                    name: 'Usuwanie sierści zwierząt',       priceFrom: 100 },
      { id: 'zapachy',                   name: 'Usuwanie zapachów',               priceFrom: 150 },
      { id: 'po-zalaniu',                name: 'Czyszczenie po zalaniu',          quoteOnRequest: true },
    ],
  },
  {
    slug: 'logistyka',
    name: 'Door-to-door',
    lede: 'Nie masz czasu zostawić auta? Odbieramy spod Twojego adresu w Radomiu, wykonujemy usługę w studio, odwozimy z powrotem.',
    isLogistics: true,
    services: [
      {
        id: 'door-to-door',
        name: 'Usługa door-to-door',
        body: 'Odbieramy auto spod Twojego adresu w Radomiu, wykonujemy usługę w studio, odwozimy z powrotem.',
        quoteOnRequest: true,
      },
    ],
  },
]

// Quick lookup map
export const SERVICE_BY_ID = (() => {
  const m = {}
  for (const cat of CATEGORIES) {
    for (const svc of cat.services) {
      m[svc.id] = { ...svc, categorySlug: cat.slug, categoryName: cat.name }
    }
  }
  return m
})()

export const TOTAL_SERVICES_COUNT = CATEGORIES.reduce(
  (n, c) => n + c.services.length,
  0,
)

export const CATEGORY_COUNT = CATEGORIES.length

// Polish number formatting (1 600 zł, 15 000 zł)
export function formatZl(n) {
  return new Intl.NumberFormat('pl-PL').format(n) + ' zł'
}

/* ──────────────────────────────────────────────────────────────────────
   Pakiet miesiąca — editorial "featured offer" slot rendered between
   TrustStrip and About on the home page.
   `active: false` → section returns null. Monthly update = edit this object.
   Avoid "Promocja" wording: premium-positioned site uses bundle / scarcity
   / bonus framing, never % off.
   ────────────────────────────────────────────────────────────────────── */
export const PROMO_OF_THE_MONTH = {
  active: true,
  monthLabel: 'Maj 2026',
  eyebrow: 'Pakiet maja',
  title: 'Wiosenne odświeżenie',
  subtitle: 'Pełen detailing + ceramika powłok 9H w jednej cenie sezonowej.',
  includes: [
    'Pełen detailing zewnętrzny',
    'Pełen detailing wnętrza',
    'Ceramika powłok 9H',
  ],
  priceFrom: 1500,
  priceCompare: 1900, // null = no compare price shown
  scarcity: 'Limit 8 aut · do 31 maja',
  cta: { label: 'Zamów pakiet', href: '/cennik#detailing-wnetrza' },
}
