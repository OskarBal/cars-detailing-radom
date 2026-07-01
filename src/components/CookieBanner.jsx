import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent, subscribeConsent, CONSENT_EVENT } from '../lib/consent.js'

export default function CookieBanner() {
  // null = unknown / not mounted, false = no choice yet (show banner), true = chose
  const [hasChoice, setHasChoice] = useState(null)
  const [open, setOpen] = useState(false)        // expanded "Dostosuj" panel
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    setHasChoice(getConsent() !== null)
    return subscribeConsent((detail) => {
      setHasChoice(detail !== null)
    })
  }, [])

  // External trigger from Cookies page ("Zmień zgodę") fires this event with detail=null.
  // It both clears the stored consent AND re-opens the banner.
  useEffect(() => {
    const reopen = () => {
      setHasChoice(false)
      setOpen(false)
      const current = getConsent()
      setAnalytics(current?.analytics ?? false)
    }
    window.addEventListener('cdr:open-cookie-banner', reopen)
    return () => window.removeEventListener('cdr:open-cookie-banner', reopen)
  }, [])

  if (hasChoice !== false) return null

  const acceptAll = () => setConsent({ analytics: true, marketing: false })
  const rejectAll = () => setConsent({ analytics: false, marketing: false })
  const saveCustom = () => setConsent({ analytics, marketing: false })

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:px-6 md:pb-6 md:right-0 md:left-auto md:max-w-[440px] md:bottom-0"
    >
      <div className="bg-noir-surface border border-hairline rounded-md shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {!open ? (
          <div className="p-5 md:p-6">
            <p
              id="cookie-banner-title"
              className="text-[10px] tracking-[0.22em] uppercase font-bold text-accent mb-2"
            >
              Cookies
            </p>
            <p id="cookie-banner-desc" className="text-sm text-noir-muted leading-relaxed mb-4">
              Używamy plików cookies, aby strona działała poprawnie i&nbsp;abyśmy mogli mierzyć ruch.
              Cookies analityczne wymagają Twojej zgody.{' '}
              <Link to="/cookies" className="text-noir-bright underline decoration-hairline-hi underline-offset-2 hover:decoration-accent">
                Szczegóły
              </Link>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hi text-noir-bright text-sm font-semibold uppercase tracking-wider transition-colors"
              >
                Akceptuj wszystkie
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 bg-noir-elevated hover:bg-noir-bright/10 text-noir-bright text-sm font-semibold uppercase tracking-wider transition-colors border border-hairline"
              >
                Tylko niezbędne
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 text-xs text-noir-faint hover:text-noir-bright transition-colors underline decoration-hairline underline-offset-2"
            >
              Dostosuj ustawienia
            </button>
          </div>
        ) : (
          <div className="p-5 md:p-6 max-h-[80vh] overflow-y-auto">
            <p className="text-[10px] tracking-[0.22em] uppercase font-bold text-accent mb-2">
              Ustawienia cookies
            </p>
            <h2 className="font-impact italic uppercase text-2xl text-noir-bright leading-none mb-4">
              Dostosuj zgodę
            </h2>

            <div className="space-y-3 mb-5">
              <label className="flex items-start gap-3 p-3 bg-noir-elevated/60 border border-hairline rounded-sm">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 accent-accent cursor-not-allowed"
                  aria-label="Cookies niezbędne — zawsze włączone"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-noir-bright">Niezbędne</span>
                    <span className="text-[10px] tracking-wider uppercase text-noir-faint">Zawsze aktywne</span>
                  </div>
                  <p className="text-xs text-noir-muted leading-relaxed">
                    Konieczne do działania strony — pamięć wyboru w&nbsp;cenniku i&nbsp;pakietu PPF, zabezpieczenia hostingu.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-noir-elevated/60 border border-hairline rounded-sm cursor-pointer hover:border-hairline-hi transition-colors">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 accent-accent cursor-pointer"
                  aria-label="Cookies analityczne"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-noir-bright block mb-1">Analityczne</span>
                  <p className="text-xs text-noir-muted leading-relaxed">
                    Google Analytics 4 — pomaga zrozumieć jak korzystasz ze strony. Adres IP jest anonimizowany.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={saveCustom}
                className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hi text-noir-bright text-sm font-semibold uppercase tracking-wider transition-colors"
              >
                Zapisz wybór
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 bg-noir-elevated hover:bg-noir-bright/10 text-noir-muted text-sm font-medium uppercase tracking-wider transition-colors border border-hairline"
              >
                Wróć
              </button>
            </div>

            <p className="mt-3 text-xs text-noir-faint">
              Szczegóły:{' '}
              <Link to="/polityka-prywatnosci" className="underline decoration-hairline-hi underline-offset-2 hover:text-noir-bright hover:decoration-accent">
                Polityka prywatności
              </Link>
              {' · '}
              <Link to="/cookies" className="underline decoration-hairline-hi underline-offset-2 hover:text-noir-bright hover:decoration-accent">
                Polityka cookies
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
