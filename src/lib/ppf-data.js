// PPF configurator data — the 4 cennik packages, each with two photoreal
// renders (front 3/4 + rear 3/4) showing the actual PPF coverage on the car.
//
// The visualizer is a pure photo crossfade — no SVG, no zones, no polygons.
// Each render is a Higgsfield image-to-image generation off the base car
// photo, with the model instructed to "wrap" the package's panels in
// glossy PPF. Source materials live in `assets-src/ppf/`; the shipped
// webps live in `public/ppf/`. See `assets-src/ppf/README.md` for the
// regen pipeline.

export const PPF_VIEWS = [
  { id: 'front', label: 'Przód', baseImage: '/ppf/base/front.webp' },
  { id: 'rear',  label: 'Tył',   baseImage: '/ppf/base/rear.webp'  },
]

export const PPF_PACKAGES = [
  {
    id: 'pkg-reflektory',
    slug: 'reflektory',
    name: 'PPF reflektory',
    priceFrom: 300,
    blurb: 'Folia tylko na klosze reflektorów — ochrona przed kamykami i piaskiem.',
    covers: ['Klosze obu reflektorów przednich'],
    images: {
      front: '/ppf/packages/reflektory/front.webp',
      rear:  '/ppf/packages/reflektory/rear.webp',
    },
  },
  {
    id: 'pkg-progi',
    slug: 'progi',
    name: 'Zabezpieczenie progów PPF',
    priceFrom: 500,
    blurb: 'Progi zewnętrzne i próg bagażnika — strefy najczęściej obijane butem i bagażem.',
    covers: [
      'Progi zewnętrzne (pod drzwiami)',
      'Próg bagażnika (krawędź załadunku)',
      'Próg wewnętrzny (po otwarciu drzwi)',
    ],
    images: {
      front: '/ppf/packages/progi/front.webp',
      rear:  '/ppf/packages/progi/rear.webp',
    },
  },
  {
    id: 'pkg-front',
    slug: 'pakiet-front',
    name: 'PPF pakiet front',
    priceFrom: 4500,
    bestseller: true,
    blurb: 'Przód auta — od zderzaka po podszybie.',
    // List matches what the v2.2 shipped front + rear renders actually
    // visually cover. Items previously overpromised (A-pillars, czoło dachu,
    // górna krawędź szyby, klamki drzwi, próg bagażnika) were dropped — they
    // are not in the locked render spec (`assets-src/ppf/prompts.md` § v2.2
    // pakiet-front row). Door surface stays bare in the rear-view render.
    covers: [
      'Maska',
      'Oba błotniki przednie',
      'Podszybie (panel pod szybą)',
      'Zderzak przedni z dolnym spojlerem',
      'Oba reflektory',
      'Lusterka boczne (obudowy)',
    ],
    images: {
      front: '/ppf/packages/pakiet-front/front.webp',
      rear:  '/ppf/packages/pakiet-front/rear.webp',
    },
  },
  {
    id: 'pkg-cale-auto',
    slug: 'cale-auto',
    name: 'PPF całe auto',
    priceFrom: 15000,
    bestseller: true,
    blurb: 'Wszystkie zewnętrzne elementy lakierowane — pełna tarcza dookoła.',
    covers: [
      'Cały front (maska, błotniki, zderzak, reflektory, lusterka)',
      'Wszystkie drzwi i klamki',
      'Słupki A, B i C',
      'Czoło dachu i krawędź tylna',
      'Zderzak tylny',
      'Tylne błotniki',
      'Klapa bagażnika',
      'Wszystkie progi',
    ],
    images: {
      front: '/ppf/packages/cale-auto/front.webp',
      rear:  '/ppf/packages/cale-auto/rear.webp',
    },
  },
]

export const PPF_PACKAGE_BY_ID = (() => {
  const m = {}
  for (const p of PPF_PACKAGES) m[p.id] = p
  return m
})()

export const PPF_PACKAGE_BY_SLUG = (() => {
  const m = {}
  for (const p of PPF_PACKAGES) m[p.slug] = p
  return m
})()

// Bestseller package — pre-selected on first visit so users land on a
// visual hook + the headline price point, not a bare-paint base photo.
export const PPF_DEFAULT_PACKAGE_ID = 'pkg-front'
