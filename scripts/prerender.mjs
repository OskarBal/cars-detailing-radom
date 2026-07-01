// Static prerender for the 6 public routes. Runs after `vite build` (client)
// and `vite build --ssr src/entry-server.jsx --outDir dist-ssr` (server).
//
// For each route:
//   - import server bundle, call render(url) → React HTML string
//   - swap <!--ssr-outlet--> in the client template with the rendered HTML
//   - swap the <!--ssr-head-->…<!--/ssr-head--> block with per-route head tags
//   - write to dist/<route>/index.html (root → dist/index.html)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SERVICE_PAGES } from '../src/lib/service-pages.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const ssrEntry = path.join(projectRoot, 'dist-ssr', 'entry-server.js')

const SITE_ORIGIN = 'https://carsdetailingradom.pl'
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`

const serviceRoutes = SERVICE_PAGES.map((page) => ({
  url: page.path,
  out: `${page.slug}/index.html`,
  title: page.title,
  description: page.description,
  preloadImage: '/hero-bg.webp',
  schemas: [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_ORIGIN}${page.path}#service`,
      name: page.h1,
      description: page.description,
      areaServed: [
        { '@type': 'City', name: 'Radom' },
        { '@type': 'AdministrativeArea', name: 'powiat radomski' },
      ],
      provider: { '@id': `${SITE_ORIGIN}/#business` },
      url: `${SITE_ORIGIN}${page.path}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${SITE_ORIGIN}${page.path}#faq`,
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${SITE_ORIGIN}${page.path}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Cars Detailing Radom',
          item: `${SITE_ORIGIN}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.h1,
          item: `${SITE_ORIGIN}${page.path}`,
        },
      ],
    },
  ],
}))

// Per-route SEO surface — single source of truth.
const routes = [
  {
    url: '/',
    out: 'index.html',
    title: 'Auto detailing Radom | Cars Detailing Radom',
    description:
      'Profesjonalna pielęgnacja samochodu w Radomiu. Ceramika, PPF, korekta lakieru, pranie tapicerki, door-to-door. Studio przy ul. Opolskiej 46A.',
    preloadImage: '/hero-bg.webp',
  },
  {
    url: '/cennik',
    out: 'cennik/index.html',
    title: 'Cennik detailingu Radom | Cars Detailing Radom',
    description:
      'Cennik detailingu w Radomiu: powłoki ceramiczne, PPF, korekta lakieru, pranie tapicerki, detailing wnętrza i wycena online.',
  },
  {
    url: '/ppf',
    out: 'ppf/index.html',
    title: 'Folia PPF Radom | Cars Detailing Radom',
    description:
      'Folia ochronna PPF w Radomiu: reflektory, progi, pakiet front i całe auto. Samoregenerująca ochrona lakieru z wyceną online.',
  },
  ...serviceRoutes,
  {
    url: '/regulamin',
    out: 'regulamin/index.html',
    title: 'Regulamin | Cars Detailing Radom',
    description: 'Regulamin świadczenia usług Cars Detailing Radom — PUH Agat Tomasz Gorczyca.',
    noindex: true,
  },
  {
    url: '/polityka-prywatnosci',
    out: 'polityka-prywatnosci/index.html',
    title: 'Polityka prywatności | Cars Detailing Radom',
    description: 'Polityka prywatności i przetwarzania danych osobowych Cars Detailing Radom.',
    noindex: true,
  },
  {
    url: '/cookies',
    out: 'cookies/index.html',
    title: 'Polityka cookies | Cars Detailing Radom',
    description: 'Informacja o plikach cookies używanych na carsdetailingradom.pl.',
    noindex: true,
  },
  {
    url: '/404',
    out: '404.html',
    title: '404 — strona nie znaleziona | Cars Detailing Radom',
    description: 'Nie znaleziono strony Cars Detailing Radom.',
    noindex: true,
  },
]

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function headBlock(route) {
  const canonical = `${SITE_ORIGIN}${route.url === '/' ? '/' : route.url}`
  const tags = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    route.preloadImage ? `<link rel="preload" as="image" href="${route.preloadImage}" fetchpriority="high" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Cars Detailing Radom" />`,
    `<meta property="og:locale" content="pl_PL" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Cars Detailing Radom" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
  ].filter(Boolean)
  if (route.noindex) {
    tags.push(`<meta name="robots" content="noindex,follow" />`)
  }
  if (route.schemas) {
    for (const schema of route.schemas) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    }
  }
  return tags.join('\n    ')
}

async function main() {
  if (!fs.existsSync(ssrEntry)) {
    console.error(`✗ SSR bundle missing at ${ssrEntry}`)
    console.error(`  Did you run "vite build --ssr src/entry-server.jsx --outDir dist-ssr"?`)
    process.exit(1)
  }

  const templatePath = path.join(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error(`✗ Client template missing at ${templatePath}`)
    console.error(`  Did you run "vite build"?`)
    process.exit(1)
  }

  const template = fs.readFileSync(templatePath, 'utf-8')
  const { render } = await import(pathToFileURL(ssrEntry).href)

  const headRegex = /<!--ssr-head-->[\s\S]*?<!--\/ssr-head-->/

  for (const route of routes) {
    let html
    try {
      html = render(route.url)
    } catch (err) {
      console.error(`✗ render failed for ${route.url}:`, err)
      process.exit(1)
    }

    let out = template
      .replace(headRegex, headBlock(route))
      .replace('<!--ssr-outlet-->', html)

    const outPath = path.join(distDir, route.out)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, out)

    const bytes = Buffer.byteLength(out)
    console.log(`✓ ${route.url.padEnd(28)} → ${path.relative(projectRoot, outPath)}  (${bytes.toLocaleString()} bytes)`)
  }

  // Clean up server bundle — it's not needed in the deployed dist/.
  fs.rmSync(path.join(projectRoot, 'dist-ssr'), { recursive: true, force: true })
}

main()
