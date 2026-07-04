import { Fragment, useState } from 'react'
import { BRAND } from '../lib/nav.js'

const INTEREST_OPTIONS = [
  { id: 'powloki',      label: 'Powłoki ceramiczne' },
  { id: 'ppf',          label: 'PPF — folia ochronna' },
  { id: 'korekta',      label: 'Korekta lakieru' },
  { id: 'wnetrze',      label: 'Detailing wnętrza' },
  { id: 'tapicerka',    label: 'Pranie tapicerki' },
  { id: 'door-to-door', label: 'Door-to-door' },
  { id: 'inne',         label: 'Inne / wycena' },
]

const TIMING_OPTIONS = [
  { id: 'asap',     label: 'W tym tygodniu' },
  { id: '2tyg',     label: 'W ciągu 2 tygodni' },
  { id: 'elastic', label: 'Elastycznie' },
]

const RODO_HINT =
  'Wysyłając formularz zgadzasz się na kontakt telefoniczny w sprawie wyceny. Twoje dane nie są przekazywane osobom trzecim.'

export default function Kontakt() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    carModel: '',
    interest: '',
    timing: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const toggleChip = (group, id) =>
    setForm((f) => ({ ...f, [group]: f[group] === id ? '' : id }))

  const onSubmit = async (e) => {
    e.preventDefault()
    const company = e.currentTarget?.company?.value || '' // honeypot
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg('Podaj imię i telefon — bez tego nie oddzwonimy.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setErrorMsg('')

    try {
      const interestLabel =
        INTEREST_OPTIONS.find((o) => o.id === form.interest)?.label || ''
      const timingLabel =
        TIMING_OPTIONS.find((o) => o.id === form.timing)?.label || ''

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          company,
          interest: interestLabel,
          timing: timingLabel,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Nie udało się wysłać formularza.')
      }

      setStatus('sent')
    } catch (err) {
      setErrorMsg(err.message || 'Coś poszło nie tak. Zadzwoń bezpośrednio.')
      setStatus('error')
    }
  }

  return (
    <section
      id="kontakt"
      aria-label="Kontakt"
      className="relative bg-noir-surface text-noir-bright py-20 md:py-32 px-6 md:px-10 border-t border-hairline scroll-mt-24"
    >
      <div className="mx-auto max-w-[1200px] grid md:grid-cols-2 gap-12 md:gap-16">

        <div>
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Kontakt
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5.2vw,3.6rem)] mb-6">
            Porozmawiajmy<br />o&nbsp;Twoim&nbsp;aucie.
          </h2>
          <p className="text-noir-muted text-base md:text-lg leading-relaxed mb-8 max-w-prose">
            Zostaw numer, oddzwonimy. Albo zadzwoń bezpośrednio — jesteśmy na&nbsp;telefonie 7&nbsp;dni w&nbsp;tygodniu.
          </p>

          <ul className="space-y-4 text-noir-muted">
            <li className="flex items-start gap-3">
              <Icon name="phone" />
              <div>
                <p className="text-xs uppercase tracking-widest text-noir-faint mb-0.5">Telefon</p>
                <a href={BRAND.phoneHref} className="text-noir-bright hover:text-accent transition-colors font-mono">
                  {BRAND.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="pin" />
              <div>
                <p className="text-xs uppercase tracking-widest text-noir-faint mb-0.5">Studio</p>
                <a href={BRAND.gbpUrl} target="_blank" rel="noopener" className="text-noir-bright hover:text-accent transition-colors">
                  {BRAND.address}
                </a>
              </div>
            </li>
          </ul>
        </div>

        {status === 'sent' ? (
          <SentState onReset={() => {
            setForm({ name: '', phone: '', email: '', carModel: '', interest: '', timing: '', message: '' })
            setStatus('idle')
          }} />
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {/* honeypot — hidden from humans; bots that fill it get silently dropped */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Imię" name="name" value={form.name} onChange={onChange} required autoComplete="given-name" />
              <Field
                label="Telefon"
                name="phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={onChange}
                required
                autoComplete="tel"
                placeholder="+48 ___ ___ ___"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="E-mail (opcjonalnie)"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
              />
              <Field
                label="Samochód (opcjonalnie)"
                name="carModel"
                value={form.carModel}
                onChange={onChange}
                placeholder="np. Audi RS6 2022"
                autoComplete="off"
              />
            </div>

            <InterestSelect
              value={form.interest}
              onChange={onChange}
            />

            <TimingPicker
              selectedId={form.timing}
              onSelect={(id) => toggleChip('timing', id)}
            />

            <Field
              as="textarea"
              label="Wiadomość (opcjonalnie)"
              name="message"
              value={form.message}
              onChange={onChange}
              rows={3}
              placeholder="Opisz krótko czego potrzebujesz, kiedy planujesz…"
            />

            {status === 'error' && (
              <p className="text-sm text-accent-hi font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-6 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Wysyłanie…' : 'Wyślij zgłoszenie'}
            </button>
            <p className="text-[11px] text-noir-faint leading-relaxed">{RODO_HINT}</p>
          </form>
        )}

      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Building blocks                                                            */
/* -------------------------------------------------------------------------- */

function InterestSelect({ value, onChange }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-noir-faint">
        Czego potrzebujesz?
      </span>
      <div className="relative mt-1.5">
        <select
          name="interest"
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-noir-elevated border border-hairline rounded px-4 py-3 pr-11 text-noir-bright font-display focus:outline-none focus:border-accent transition-colors cursor-pointer"
        >
          <option value="">Wybierz usługę…</option>
          {INTEREST_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-noir-faint pointer-events-none"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>
    </label>
  )
}

function TimingPicker({ selectedId, onSelect }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-noir-faint mb-2">
        Kiedy planujesz?
      </p>
      <div role="radiogroup" className="flex flex-nowrap items-center justify-between sm:justify-start gap-x-0.5 sm:gap-x-1">
        {TIMING_OPTIONS.map((opt, i) => {
          const selected = opt.id === selectedId
          return (
            <Fragment key={opt.id}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-noir-faint/40 text-xs sm:text-base font-light select-none px-px sm:px-0.5"
                >
                  /
                </span>
              )}
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelect(opt.id)}
                className={`shrink-0 px-2 sm:px-4 py-1.5 sm:py-2 rounded-sm text-[10px] sm:text-[12.5px] uppercase tracking-[0.04em] sm:tracking-wider font-medium border whitespace-nowrap transition-all ${
                  selected
                    ? 'bg-accent text-noir-deep border-accent'
                    : 'bg-transparent text-noir-muted border-hairline-hi hover:border-accent hover:text-noir-bright'
                }`}
              >
                {opt.label}
              </button>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

function SentState({ onReset }) {
  return (
    <div className="rounded-xl border border-hairline-hi bg-noir-elevated/60 p-8 md:p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-accent/15 grid place-items-center mb-5">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent-hi)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5 9-11" />
        </svg>
      </div>
      <h3 className="font-impact italic font-black uppercase text-2xl mb-2">Dzięki, odebraliśmy.</h3>
      <p className="text-noir-muted leading-relaxed mb-6">
        Oddzwonimy w&nbsp;ciągu <strong className="text-noir-bright">15&nbsp;minut</strong> w&nbsp;godz. 9–19.
        Poza godzinami — pierwsza wolna chwila następnego dnia.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center px-5 py-2.5 rounded text-noir-muted border border-hairline-hi uppercase font-display font-bold text-[11.5px] tracking-[0.12em] hover:border-accent hover:text-noir-bright transition-colors"
      >
        Nowe zgłoszenie
      </button>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', as = 'input', rows, required, placeholder, autoComplete, inputMode }) {
  const Tag = as
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-noir-faint">{label}{required && ' *'}</span>
      <Tag
        name={name}
        type={as === 'input' ? type : undefined}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="mt-1.5 w-full bg-noir-elevated border border-hairline rounded px-4 py-3 text-noir-bright font-display placeholder:text-noir-faint focus:outline-none focus:border-accent transition-colors resize-y"
      />
    </label>
  )
}

function Icon({ name }) {
  const common = {
    width: 20, height: 20, viewBox: '0 0 32 32',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.4,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    className: 'text-accent shrink-0 mt-0.5',
    'aria-hidden': true,
  }
  if (name === 'phone') return (
    <svg {...common}>
      <path d="M7 4l3 1 2 5-3 2c1 4 4 7 8 8l2-3 5 2 1 3c0 2-2 4-4 4C12 26 6 20 6 8c0-2 1-4 3-4z" />
    </svg>
  )
  return (
    <svg {...common}>
      <path d="M16 3a9 9 0 0 1 9 9c0 7-9 17-9 17S7 19 7 12a9 9 0 0 1 9-9z" />
      <circle cx="16" cy="12" r="3" />
    </svg>
  )
}
