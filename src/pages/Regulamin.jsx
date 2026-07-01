import LegalLayout from '../components/LegalLayout.jsx'
import { BRAND } from '../lib/nav.js'

export default function Regulamin() {
  return (
    <LegalLayout
      title="Regulamin Studia"
      kicker="Dokumenty"
      updated="1 listopada 2025"
    >
      <p>
        Regulamin określa zasady świadczenia usług detailingowych przez {BRAND.name}, zwane dalej „Studio".
        Oddanie pojazdu do realizacji usługi oznacza akceptację niniejszego regulaminu.
      </p>
      <p>
        Studio świadczy usługi pielęgnacji, czyszczenia oraz zabezpieczania pojazdów zgodnie z aktualną
        wiedzą techniczną i technologią producentów stosowanych preparatów.
      </p>

      <h2>1. Postanowienia ogólne</h2>
      <ol>
        <li>Regulamin określa zasady świadczenia usług detailingowych przez {BRAND.name}, zwane dalej „Studio".</li>
        <li>Oddanie pojazdu do realizacji usługi oznacza akceptację niniejszego regulaminu.</li>
        <li>Studio świadczy usługi pielęgnacji, czyszczenia oraz zabezpieczania pojazdów zgodnie z aktualną wiedzą techniczną i technologią producentów stosowanych preparatów.</li>
      </ol>

      <h2>2. Stan pojazdu przed usługą</h2>
      <p>Klient zobowiązany jest poinformować Studio o:</p>
      <ul>
        <li>wcześniejszych naprawach lakierniczych,</li>
        <li>oklejaniu pojazdu folią,</li>
        <li>uszkodzeniach mechanicznych,</li>
        <li>wadach lakieru,</li>
        <li>niestandardowych modyfikacjach pojazdu.</li>
      </ul>
      <p>Studio nie ponosi odpowiedzialności za:</p>
      <ul>
        <li>wady lakiernicze ujawnione podczas mycia, korekty lub czyszczenia,</li>
        <li>odpryski, mikropęknięcia, łuszczący się lakier,</li>
        <li>elementy wcześniej nieprawidłowo naprawiane lub lakierowane,</li>
        <li>uszkodzenia wynikające ze zużycia eksploatacyjnego pojazdu.</li>
      </ul>
      <p>
        W przypadku lakieru w złym stanie technicznym lub elementów niestabilnych, Studio ma prawo odmówić
        wykonania usługi lub wykonać ją na wyłączną odpowiedzialność klienta.
      </p>

      <h2>3. Zakres odpowiedzialności</h2>
      <p>Studio wykonuje usługi z należytą starannością, jednak nie gwarantuje:</p>
      <ul>
        <li>całkowitego usunięcia wszystkich rys,</li>
        <li>pełnego usunięcia zabrudzeń trwałych,</li>
        <li>identycznego efektu na każdym rodzaju lakieru.</li>
      </ul>
      <p>Studio nie odpowiada za:</p>
      <ul>
        <li>uszkodzenia wynikające z wad fabrycznych pojazdu,</li>
        <li>reakcje chemiczne wynikające z wcześniejszych napraw lub źle dobranych środków używanych wcześniej przez klienta,</li>
        <li>odklejenie się słabo zamocowanych elementów,</li>
        <li>uszkodzenia folii PPF, oklein i emblematów będących w złym stanie.</li>
      </ul>
      <p>
        W przypadku konieczności użycia maszyny polerskiej lub mocniejszej chemii klient akceptuje ryzyko
        ujawnienia wcześniejszych wad lakierniczych.
      </p>
      <p><strong>Studio nie odpowiada za rzeczy pozostawione w pojeździe.</strong></p>

      <h2>4. Odbiór pojazdu i reklamacje</h2>
      <ol>
        <li>Klient zobowiązany jest do sprawdzenia pojazdu przy odbiorze.</li>
        <li>Reklamacje dotyczące wykonanej usługi należy zgłaszać niezwłocznie, nie później niż w terminie <strong>3 dni od odbioru pojazdu</strong>.</li>
        <li>
          Reklamacje dotyczące:
          <ul>
            <li>zabrudzeń eksploatacyjnych,</li>
            <li>ponownego zarysowania pojazdu po odbiorze,</li>
            <li>niewłaściwej pielęgnacji po wykonaniu usługi</li>
          </ul>
          nie będą uwzględniane.
        </li>
        <li>Studio ma prawo w pierwszej kolejności usunąć wadę w ramach reklamacji przed rozpatrywaniem innych roszczeń.</li>
      </ol>

      <h2>5. Płatności i rezerwacje</h2>
      <ol>
        <li>Rezerwacja terminu może wymagać wpłaty zadatku.</li>
        <li>W przypadku odwołania wizyty mniej niż 24 godziny przed terminem zadatek może zostać zatrzymany.</li>
        <li>Pojazd nie zostanie wydany do czasu uregulowania pełnej należności za usługę.</li>
      </ol>

      <h2>6. Pozostawienie pojazdu</h2>
      <ol>
        <li>Klient zobowiązuje się odebrać pojazd w ustalonym terminie.</li>
        <li>Studio może naliczyć opłatę postojową za nieodebranie pojazdu w terminie bez wcześniejszego uzgodnienia.</li>
      </ol>

      <h2>7. Postanowienia końcowe</h2>
      <ol>
        <li>Studio zastrzega sobie prawo do odmowy wykonania usługi.</li>
        <li>Regulamin dostępny jest w siedzibie firmy oraz online.</li>
        <li>W sprawach nieuregulowanych zastosowanie mają przepisy Kodeksu cywilnego.</li>
        <li>Regulamin obowiązuje od dnia <strong>1 listopada 2025</strong>.</li>
      </ol>
    </LegalLayout>
  )
}
