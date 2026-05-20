// Single source of truth for nav items. Order = display order.
// `to` is a full path; `hash` is an in-page anchor for the home page only.

export const NAV_ITEMS = [
  { label: 'Strona główna', to: '/',       hash: '#hero'       },
  { label: 'O nas',         to: '/',       hash: '#o-nas'      },
  { label: 'Usługi',        to: '/',       hash: '#uslugi'     },
  { label: 'PPF',           to: '/ppf',    hash: null          },
  { label: 'Realizacje',    to: '/',       hash: '#realizacje' },
  { label: 'Cennik',        to: '/cennik', hash: null          },
  { label: 'Kontakt',       to: '/',       hash: '#kontakt'    },
]

export const BRAND = {
  name:    'Cars Detailing Radom',
  phone:   '+48 690 426 050',
  phoneHref: 'tel:+48690426050',
  address: 'ul. Opolska 46A, 26-606 Radom',
  email:   null,         // filled at Meeting #2
  hours:   null,         // filled at Meeting #2
  gbpUrl:  'https://www.google.com/maps/place/Cars+Detailing+RADOM',
  tiktok:  'https://www.tiktok.com/@carsdetailingradom',
  instagram: null,
}
