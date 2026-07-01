import { useEffect, useState } from 'react'
import LegalLayout from '../components/LegalLayout.jsx'
import { BRAND } from '../lib/nav.js'
import { getConsent, clearConsent, subscribeConsent } from '../lib/consent.js'

function ConsentStatus() {
  const [consent, setConsentState] = useState(null)

  useEffect(() => {
    setConsentState(getConsent())
    return subscribeConsent(setConsentState)
  }, [])

  const reopen = () => {
    clearConsent()
    window.dispatchEvent(new CustomEvent('cdr:open-cookie-banner'))
  }

  return (
    <div className="not-prose my-8 p-5 md:p-6 bg-noir-elevated border border-hairline rounded-md">
      <p className="text-[10px] tracking-[0.22em] uppercase font-bold text-accent mb-2">
        Twoje ustawienia
      </p>
      {consent ? (
        <>
          <p className="text-sm text-noir-muted mb-3">
            Aktualnie zaakceptowane:{' '}
            <span className="text-noir-bright font-semibold">Niezbędne</span>
            {consent.analytics && <span className="text-noir-bright font-semibold"> · Analityczne</span>}
          </p>
          <p className="text-xs text-noir-faint mb-4">
            Zapisano: {new Date(consent.timestamp).toLocaleString('pl-PL')}
          </p>
        </>
      ) : (
        <p className="text-sm text-noir-muted mb-4">
          Nie zapisałeś jeszcze preferencji — przy najbliższej wizycie pokażemy baner.
        </p>
      )}
      <button
        type="button"
        onClick={reopen}
        className="px-4 py-2.5 bg-accent hover:bg-accent-hi text-noir-bright text-sm font-semibold uppercase tracking-wider transition-colors"
      >
        Zmień ustawienia cookies
      </button>
    </div>
  )
}

export default function Cookies() {
  return (
    <LegalLayout
      title="Polityka cookies"
      kicker="Dokumenty"
      updated="21 maja 2026"
    >
      <ConsentStatus />
      <p>
        Strona <a href="https://carsdetailingradom.pl">carsdetailingradom.pl</a> korzysta z plików cookies oraz
        zbliżonych technologii (local storage, session storage) w celach opisanych poniżej. Dokument stanowi
        uzupełnienie <a href="/polityka-prywatnosci">Polityki prywatności</a>.
      </p>

      <h2>1. Czym są pliki cookies</h2>
      <p>
        Cookies to niewielkie pliki tekstowe zapisywane na Państwa urządzeniu przez przeglądarkę internetową
        podczas odwiedzin strony. Pozwalają stronie „rozpoznać" urządzenie przy kolejnych wizytach
        i przechowywać ustawienia użytkownika.
      </p>

      <h2>2. Rodzaje cookies używane na stronie</h2>

      <h3>2.1. Cookies niezbędne (techniczne)</h3>
      <p>
        Umożliwiają poprawne działanie strony. Nie wymagają zgody, ponieważ są konieczne do świadczenia usługi
        żądanej przez użytkownika.
      </p>
      <ul>
        <li>
          <strong>cdr.cennik.selection.v1</strong> oraz <strong>cdr.ppf.selection.v1</strong> (local storage) —
          zapamiętują wybór usług w cenniku i pakietu PPF między wizytami, aby nie tracić zaznaczenia po
          przeładowaniu strony.
        </li>
        <li>
          Cookies sesyjne dostawcy hostingu (Vercel) — utrzymują stabilność połączenia i zabezpieczenia
          przed atakami (np. cookies związane z ochroną DDoS).
        </li>
      </ul>

      <h3>2.2. Cookies analityczne</h3>
      <p>
        Pomagają zrozumieć, w jaki sposób użytkownicy korzystają ze strony — które sekcje są najczęściej
        odwiedzane, skąd pochodzą wizyty, ile osób kończy proces wyceny. Wymagają Państwa zgody.
      </p>
      <ul>
        <li>
          <strong>Google Analytics 4</strong> (dostawca: Google Ireland Ltd.) — cookies <code>_ga</code>,
          <code> _ga_*</code>. Przechowywane do 13 miesięcy. Adresy IP są anonimizowane przed zapisaniem.
        </li>
      </ul>

      <h2>3. Zarządzanie zgodą</h2>
      <p>
        Przy pierwszej wizycie wyświetlamy baner z prośbą o zgodę na cookies inne niż niezbędne. Mogą Państwo:
      </p>
      <ul>
        <li><strong>Zaakceptować wszystkie</strong> — zgoda na cookies niezbędne oraz analityczne.</li>
        <li><strong>Odrzucić opcjonalne</strong> — załadowane zostaną wyłącznie cookies niezbędne.</li>
        <li><strong>Zmienić wybór</strong> — w dowolnym momencie poprzez wyczyszczenie cookies w przeglądarce.
          Przy kolejnej wizycie baner pojawi się ponownie.</li>
      </ul>

      <h2>4. Wyłączenie cookies w przeglądarce</h2>
      <p>
        Mogą Państwo samodzielnie zarządzać cookies w ustawieniach przeglądarki — zablokować je w całości,
        usunąć już zapisane lub otrzymywać powiadomienie przed każdym ich zapisaniem. Wyłączenie cookies
        niezbędnych może spowodować nieprawidłowe działanie niektórych funkcji strony (np. utrata wyboru
        w cenniku).
      </p>
      <p>Instrukcje dla popularnych przeglądarek:</p>
      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</a>
        </li>
        <li>
          <a href="https://support.mozilla.org/pl/kb/W%C5%82%C4%85czanie%20i%20wy%C5%82%C4%85czanie%20obs%C5%82ugi%20ciasteczek" target="_blank" rel="noopener">Mozilla Firefox</a>
        </li>
        <li>
          <a href="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Apple Safari</a>
        </li>
        <li>
          <a href="https://support.microsoft.com/pl-pl/microsoft-edge" target="_blank" rel="noopener">Microsoft Edge</a>
        </li>
      </ul>

      <h2>5. Cookies podmiotów trzecich</h2>
      <p>
        Niektóre treści osadzone na stronie (filmy z TikTok w sekcji Realizacje, mapy Google) mogą
        instalować własne cookies. Zasady ich działania regulują polityki prywatności odpowiednich
        dostawców. Cookies te aktywują się wyłącznie po otwarciu danej treści lub wczytaniu odpowiedniego
        zewnętrznego komponentu.
      </p>

      <h2>6. Kontakt</h2>
      <p>
        Pytania dotyczące cookies prosimy kierować na adres <a href="mailto:kontakt@carsdetailingradom.pl">kontakt@carsdetailingradom.pl</a>
        lub telefonicznie pod numer <a href={BRAND.phoneHref}>{BRAND.phone}</a>.
      </p>
    </LegalLayout>
  )
}
