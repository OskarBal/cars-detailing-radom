import LegalLayout from '../components/LegalLayout.jsx'
import { BRAND } from '../lib/nav.js'

export default function PolitykaPrywatnosci() {
  return (
    <LegalLayout
      title="Polityka prywatności"
      kicker="Dokumenty"
      updated="21 maja 2026"
    >
      <p>
        Niniejsza Polityka prywatności opisuje, jakie dane osobowe zbieramy w związku z korzystaniem
        ze strony <a href="https://carsdetailingradom.pl">carsdetailingradom.pl</a> oraz świadczeniem usług
        detailingowych, w jakim celu są przetwarzane i jakie prawa przysługują osobom, których dane dotyczą.
      </p>
      <p>
        Dokument przygotowano zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679
        z dnia 27 kwietnia 2016 r. (<strong>RODO</strong>) oraz ustawą z dnia 10 maja 2018 r. o ochronie danych osobowych.
      </p>

      <h2>1. Administrator danych</h2>
      <p>
        Administratorem Państwa danych osobowych jest <strong>Tomasz Gorczyca</strong>, prowadzący działalność gospodarczą pod firmą <strong>PUH Agat Tomasz Gorczyca</strong> (marka handlowa: {BRAND.name}), z siedzibą przy {BRAND.address}.
      </p>
      <ul>
        <li>NIP: <strong>948-248-06-05</strong></li>
        <li>Kontakt: <a href={BRAND.phoneHref}>{BRAND.phone}</a></li>
        <li>E-mail: <a href="mailto:kontakt@carsdetailingradom.pl">kontakt@carsdetailingradom.pl</a></li>
      </ul>

      <h2>2. Jakie dane zbieramy</h2>
      <p>W zależności od formy kontaktu zbieramy następujące dane:</p>
      <h3>2.1. Formularz wyceny lub kontaktowy</h3>
      <ul>
        <li>imię i nazwisko,</li>
        <li>numer telefonu,</li>
        <li>adres e-mail (opcjonalnie),</li>
        <li>marka i model pojazdu (opcjonalnie),</li>
        <li>adres odbioru pojazdu — wyłącznie przy zamówieniu usługi door-to-door,</li>
        <li>zdjęcia pojazdu — wyłącznie jeśli zostaną dobrowolnie załączone do wyceny,</li>
        <li>treść wiadomości i wybrane usługi z cennika.</li>
      </ul>
      <h3>2.2. Kontakt telefoniczny lub osobisty</h3>
      <ul>
        <li>imię i nazwisko,</li>
        <li>numer telefonu,</li>
        <li>dane pojazdu niezbędne do realizacji usługi.</li>
      </ul>
      <h3>2.3. Dane techniczne strony</h3>
      <p>
        Serwer hostujący stronę (Vercel Inc., USA) oraz narzędzia analityczne mogą automatycznie zapisywać
        adres IP, typ przeglądarki, system operacyjny, źródło wejścia i czas wizyty. Szczegóły dotyczące
        plików cookies opisaliśmy w odrębnej <a href="/cookies">Polityce cookies</a>.
      </p>

      <h2>3. Cel i podstawa prawna przetwarzania</h2>
      <ul>
        <li>
          <strong>Wycena i realizacja usługi</strong> — art. 6 ust. 1 lit. b RODO (umowa lub działania podejmowane
          przed jej zawarciem).
        </li>
        <li>
          <strong>Kontakt zwrotny w odpowiedzi na zapytanie</strong> — art. 6 ust. 1 lit. f RODO (prawnie uzasadniony
          interes administratora w postaci obsługi korespondencji).
        </li>
        <li>
          <strong>Rozliczenia podatkowe i księgowe</strong> — art. 6 ust. 1 lit. c RODO (obowiązek prawny ciążący na
          administratorze).
        </li>
        <li>
          <strong>Dochodzenie roszczeń i obrona przed roszczeniami</strong> — art. 6 ust. 1 lit. f RODO.
        </li>
        <li>
          <strong>Analityka i pomiar ruchu na stronie</strong> — art. 6 ust. 1 lit. a RODO (zgoda wyrażona przez
          ustawienie odpowiednich preferencji w banerze cookies).
        </li>
      </ul>

      <h2>4. Okres przechowywania danych</h2>
      <ul>
        <li>Dane z formularza wyceny: do czasu zakończenia obsługi zapytania oraz przez okres przedawnienia
          potencjalnych roszczeń (do 3 lat).</li>
        <li>Dane z realizacji usługi: przez okres wymagany przepisami podatkowymi (5 lat od końca roku, w którym
          wystawiono dokument księgowy).</li>
        <li>Dane analityczne: zgodnie z konfiguracją narzędzia (Google Analytics 4 — do 14 miesięcy).</li>
        <li>Dane przekazane w korespondencji niezakończonej zleceniem: do 12 miesięcy.</li>
      </ul>

      <h2>5. Odbiorcy danych</h2>
      <p>Dane mogą być przekazywane następującym kategoriom odbiorców:</p>
      <ul>
        <li><strong>Vercel Inc.</strong> — dostawca hostingu strony oraz funkcji serverless (siedziba: USA,
          przetwarzanie na podstawie standardowych klauzul umownych UE).</li>
        <li><strong>Resend, Inc.</strong> — dostawca usługi wysyłki wiadomości e-mail z formularzy
          (siedziba: USA, standardowe klauzule umowne UE).</li>
        <li><strong>Google Ireland Ltd.</strong> — dostawca narzędzi analitycznych (Google Analytics 4) oraz
          Google Search Console, jeśli wyrazili Państwo zgodę w banerze cookies.</li>
        <li>Biuro księgowe obsługujące rozliczenia podatkowe administratora.</li>
        <li>Organy państwowe — wyłącznie w zakresie wynikającym z obowiązków prawnych.</li>
      </ul>

      <h2>6. Prawa osoby, której dane dotyczą</h2>
      <p>Mają Państwo prawo do:</p>
      <ul>
        <li>dostępu do swoich danych oraz otrzymania ich kopii,</li>
        <li>sprostowania (poprawiania) danych,</li>
        <li>usunięcia danych („prawo do bycia zapomnianym"),</li>
        <li>ograniczenia przetwarzania,</li>
        <li>przenoszenia danych,</li>
        <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
        <li>wycofania zgody w dowolnym momencie (nie wpływa to na zgodność z prawem przetwarzania, którego
          dokonano przed jej wycofaniem),</li>
        <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych
          (<a href="https://uodo.gov.pl" target="_blank" rel="noopener">uodo.gov.pl</a>).</li>
      </ul>
      <p>
        W celu realizacji powyższych praw prosimy o kontakt: <a href={BRAND.phoneHref}>{BRAND.phone}</a> lub
        e-mail <a href="mailto:kontakt@carsdetailingradom.pl">kontakt@carsdetailingradom.pl</a>.
      </p>

      <h2>7. Dobrowolność podania danych</h2>
      <p>
        Podanie danych jest dobrowolne, ale niezbędne do skorzystania z formularza wyceny lub kontaktu
        zwrotnego. Brak podania danych uniemożliwia obsługę zapytania.
      </p>

      <h2>8. Bezpieczeństwo danych</h2>
      <p>
        Strona <a href="https://carsdetailingradom.pl">carsdetailingradom.pl</a> obsługuje wyłącznie połączenia
        szyfrowane (HTTPS / TLS). Dane przesyłane formularzem są szyfrowane w transporcie. Dostęp do skrzynki,
        na którą trafiają zapytania, mają wyłącznie osoby upoważnione przez administratora.
      </p>

      <h2>9. Zmiany Polityki prywatności</h2>
      <p>
        Administrator zastrzega sobie prawo do zmiany niniejszej Polityki prywatności w przypadku zmiany przepisów,
        zakresu świadczonych usług lub wykorzystywanych narzędzi. Aktualna wersja jest zawsze dostępna pod adresem
        <a href="https://carsdetailingradom.pl/polityka-prywatnosci"> /polityka-prywatnosci</a> z widoczną datą
        ostatniej aktualizacji.
      </p>
    </LegalLayout>
  )
}
