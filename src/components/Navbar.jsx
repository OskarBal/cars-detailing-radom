import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS, BRAND } from '../lib/nav.js'

// Home-page sections tracked by the scroll-spy, in document order.
// Must match the section `id="…"` attributes on the home page.
const HOME_SECTIONS = ['hero', 'o-nas', 'uslugi', 'ppf-teaser', 'realizacje', 'kontakt']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('#hero')
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy — track which home section is currently being viewed and expose
  // it as `activeHash`. Off-home pages get an empty activeHash (the path-based
  // active checks in `isActive` take over for /ppf and /cennik). The active
  // line sits at 30% of the viewport from the top — whichever section's top
  // is the most recently passed above that line wins.
  useEffect(() => {
    if (pathname !== '/') {
      setActiveHash('')
      return
    }

    let raf = 0
    const compute = () => {
      raf = 0
      const tracker = window.scrollY + window.innerHeight * 0.3
      let activeId = HOME_SECTIONS[0]
      for (const id of HOME_SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= tracker) {
          activeId = id
        } else {
          // Sections are in document order — anything below the tracker can't be active.
          break
        }
      }
      setActiveHash('#' + activeId)
    }
    const schedule = () => {
      if (raf) return
      raf = window.requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [pathname])

  // iOS-safe scroll lock while drawer open
  useEffect(() => {
    if (!open) return
    const y = window.scrollY
    const body = document.body
    const html = document.documentElement
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    return () => {
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      window.scrollTo(0, y)
    }
  }, [open])

  // Close drawer on route/hash change
  useEffect(() => { setOpen(false) }, [pathname, hash])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isHome = pathname === '/'

  return (
    <>
      {/* Header — z above drawer so logo + hamburger always sit on top */}
      <header
        className={[
          'fixed top-0 inset-x-0 z-[60] transition-colors duration-300',
          (scrolled || open) ? 'bg-noir-deep/90 backdrop-blur-md border-b border-hairline' : 'bg-transparent',
        ].join(' ')}
      >
        <div className="mx-auto max-w-[1600px] flex items-center justify-between gap-6 px-6 md:px-10 py-4 md:py-5">
          {/* Brand */}
          <Link to="/" className="flex items-center shrink-0" aria-label={`${BRAND.name} — strona główna`}>
            <img
              src="/logo.webp"
              alt={BRAND.name}
              width={160} height={100}
              className="h-11 md:h-14 w-auto object-contain mix-blend-screen"
            />
          </Link>

          {/* Desktop menu */}
          <nav className="hidden lg:flex items-center gap-9" aria-label="Główna nawigacja">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} item={item} isHome={isHome} activeHash={activeHash} pathname={pathname} />
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            to="/#kontakt"
            className="hidden lg:inline-flex items-center px-5 py-3 border border-accent text-accent text-[12px] font-bold tracking-[0.16em] uppercase rounded-sm transition-colors duration-300 hover:bg-accent hover:text-noir-deep"
          >
            Umów wizytę
          </Link>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="lg:hidden relative w-10 h-8"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={[
                'absolute left-1 right-1 h-[1.5px] bg-noir-bright rounded transition-all duration-300',
                open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-2.5',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-1 right-1 h-[1.5px] bg-noir-bright rounded transition-all duration-300',
                open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-2.5',
              ].join(' ')}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer — z below header so logo + hamburger remain visible */}
      <div
        id="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={[
          'lg:hidden fixed inset-0 z-50 bg-noir-deep/95 backdrop-blur-2xl',
          'flex flex-col',
          'transition-opacity duration-400',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 88px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
        }}
      >
        {/* Nav links — vertical centered in remaining space */}
        <nav
          className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
          aria-label="Główna nawigacja (mobile)"
        >
          {NAV_ITEMS.map((item, i) => (
            <DrawerLink key={item.label} item={item} index={i} open={open} isHome={isHome} activeHash={activeHash} pathname={pathname} />
          ))}
        </nav>

        {/* Footer block — divider + CTA + phone */}
        <div className="px-6 flex flex-col items-center gap-5">
          <span aria-hidden="true" className="block w-16 h-px bg-hairline" />
          <Link
            to="/#kontakt"
            className={[
              'px-8 py-3.5 border border-accent text-accent text-[13px] font-bold tracking-[0.16em] uppercase rounded-sm',
              'transition-all duration-400 hover:bg-accent hover:text-noir-deep',
              open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
            ].join(' ')}
            style={{ transitionDelay: open ? `${NAV_ITEMS.length * 60 + 100}ms` : '0ms' }}
          >
            Umów wizytę
          </Link>
          <a
            href={BRAND.phoneHref}
            className={[
              'font-mono text-sm text-noir-muted tracking-wider hover:text-accent transition-all duration-400',
              open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
            ].join(' ')}
            style={{ transitionDelay: open ? `${NAV_ITEMS.length * 60 + 180}ms` : '0ms' }}
          >
            {BRAND.phone}
          </a>
        </div>
      </div>
    </>
  )
}

function NavItem({ item, isHome, activeHash, pathname }) {
  const active = isActive(item, isHome, activeHash, pathname)
  const target = item.hash && isHome ? item.hash : item.to + (item.hash || '')
  return (
    <a
      href={target}
      aria-current={active ? 'true' : undefined}
      className={[
        'relative font-display font-semibold text-[13px] tracking-[0.14em] uppercase pb-2 transition-colors duration-300',
        active ? 'text-accent' : 'text-noir-bright hover:text-accent',
      ].join(' ')}
    >
      {item.label}
      <span
        className={[
          'absolute left-0 right-0 bottom-0 h-[2px] bg-accent origin-center transition-transform duration-400',
          active ? 'scale-x-100' : 'scale-x-0',
        ].join(' ')}
        aria-hidden="true"
      />
    </a>
  )
}

function DrawerLink({ item, index, open, isHome, activeHash, pathname }) {
  const active = isActive(item, isHome, activeHash, pathname)
  const target = item.hash && isHome ? item.hash : item.to + (item.hash || '')
  return (
    <a
      href={target}
      aria-current={active ? 'true' : undefined}
      className={[
        'relative font-impact italic font-black uppercase text-2xl md:text-3xl tracking-[0.04em] transition-all duration-400',
        active ? 'text-accent' : 'text-noir-bright hover:text-accent',
        open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
      style={{ transitionDelay: open ? `${index * 60 + 100}ms` : '0ms' }}
    >
      {item.label}
      <span
        className={[
          'absolute left-1/2 -translate-x-1/2 -bottom-1 h-[2px] w-10 bg-accent origin-center transition-transform duration-400',
          active ? 'scale-x-100' : 'scale-x-0',
        ].join(' ')}
        aria-hidden="true"
      />
    </a>
  )
}

function isActive(item, isHome, activeHash, pathname) {
  if (item.to === '/cennik') return pathname.startsWith('/cennik')
  // PPF item: active on the /ppf route OR while the home-page teaser is in view.
  if (item.to === '/ppf') return pathname.startsWith('/ppf') || (isHome && activeHash === '#ppf-teaser')
  if (item.hash && isHome) return item.hash === activeHash
  return false
}
