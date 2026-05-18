import { useState } from 'react'
import { BRAND } from '../lib/nav.js'

export default function Kontakt() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setStatus('sending')
    // TODO(v2-backend): wire up Vercel function → Resend send-email after Meeting #2
    // For v1 launch, this is a UI-only placeholder.
    await new Promise((r) => setTimeout(r, 600))
    setStatus('sent')
  }

  return (
    <section
      id="kontakt"
      aria-label="Kontakt"
      className="relative bg-noir-surface text-noir-bright py-20 md:py-32 px-6 md:px-10 border-t border-hairline"
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

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Imię" name="name" value={form.name} onChange={onChange} required />
          <Field label="Telefon" name="phone" type="tel" value={form.phone} onChange={onChange} required />
          <Field
            label="Wiadomość (opcjonalnie)"
            name="message"
            as="textarea"
            value={form.message}
            onChange={onChange}
            rows={4}
          />
          <button
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
            className="w-full px-6 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] transition-all duration-400 hover:bg-accent-hi disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Wysyłanie…' :
             status === 'sent'    ? 'Dziękujemy! Oddzwonimy' :
                                    'Wyślij zgłoszenie'}
          </button>
          <p className="text-[11px] text-noir-faint leading-relaxed">
            Wysyłając formularz zgadzasz się na&nbsp;kontakt telefoniczny w&nbsp;sprawie wyceny. Twoje dane nie&nbsp;są przekazywane osobom trzecim.
          </p>
        </form>

      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, type = 'text', as = 'input', rows, required }) {
  const Tag = as
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-noir-faint">{label}{required && ' *'}</span>
      <Tag
        name={name}
        type={type}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
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
