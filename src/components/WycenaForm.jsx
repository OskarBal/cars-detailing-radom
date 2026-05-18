import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { SERVICE_BY_ID, formatZl } from '../lib/catalog.js'

// "Wycena w 15 minut" — modal form.
// Open/close controlled by parent. Auto-hydrates the selected-services summary
// from the configurator on `pages/Cennik.jsx`.

const RODO_HINT =
  'Wysyłając formularz zgadzasz się na kontakt telefoniczny i e-mailowy w sprawie wyceny. Dane wykorzystujemy tylko do realizacji wyceny — nie przekazujemy ich osobom trzecim.'

const PHOTO_LIMITS = {
  max: 10,
  maxBytesRaw: 12 * 1024 * 1024, // 12 MB per file before compression
  maxEdgePx: 1400,                // safely under Vercel 4.5 MB body limit (10 × ~250 KB ≈ 2.5 MB raw → ~3.3 MB base64)
  quality: 0.78,
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function WycenaForm({ open, onClose, selectedIds = [] }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    carModel: '',
    address: '',
    note: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')
  const [photos, setPhotos] = useState([])
  const [photoErr, setPhotoErr] = useState('')
  const firstFieldRef = useRef(null)
  const dialogRef = useRef(null)

  // Auto-focus first field on open; restore body scroll on close.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 80)
    return () => {
      document.body.style.overflow = prevOverflow
      window.clearTimeout(id)
    }
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Reset state when dialog closes (so re-opening starts fresh after a send)
  useEffect(() => {
    if (open) return
    if (status === 'sent') {
      setForm({ name: '', phone: '', email: '', carModel: '', address: '', note: '' })
      setPhotos([])
      setPhotoErr('')
      setStatus('idle')
    }
  }, [open, status])

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const selectedDetails = selectedIds
    .map((id) => SERVICE_BY_ID[id])
    .filter(Boolean)

  const subtotal = selectedDetails.reduce(
    (sum, s) => sum + (s.quoteOnRequest ? 0 : s.priceFrom || 0),
    0,
  )
  const hasQuoteOnRequest = selectedDetails.some((s) => s.quoteOnRequest)
  const hasDoorToDoor = selectedIds.includes('door-to-door')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg('Podaj imię i telefon — bez tego nie oddzwonimy.')
      setStatus('error')
      return
    }
    if (hasDoorToDoor && !form.address.trim()) {
      setErrorMsg('Podaj adres odbioru — przy door-to-door musimy wiedzieć, dokąd przyjechać.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setErrorMsg('')

    try {
      const readyPhotos = photos
        .filter((p) => p.status === 'ok' && p.dataUrl)
        .map((p) => ({ name: p.name, dataUrl: p.dataUrl }))

      const res = await fetch('/api/wycena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          selectedIds,
          selectedDetails: selectedDetails.map((s) => ({
            id: s.id,
            name: s.name,
            categoryName: s.categoryName,
            priceFrom: s.priceFrom ?? null,
            quoteOnRequest: !!s.quoteOnRequest,
          })),
          subtotal,
          hasQuoteOnRequest,
          photos: readyPhotos,
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

  if (!open) return null

  const readyPhotosCount = photos.filter((p) => p.status === 'ok').length

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wycena-heading"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Zamknij formularz"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Sheet / dialog */}
      <div
        ref={dialogRef}
        className="relative w-full md:max-w-2xl max-h-[92svh] md:max-h-[88svh] overflow-y-auto bg-noir-surface border-t md:border border-hairline-hi md:rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 md:px-8 py-5 bg-noir-surface/95 backdrop-blur-md border-b border-hairline">
          <div>
            <p className="text-accent font-display font-bold text-[11px] tracking-[0.22em] uppercase mb-1">
              Szczegółowa wycena · 15 minut
            </p>
            <h2
              id="wycena-heading"
              className="font-impact italic font-black uppercase text-[clamp(1.5rem,3.4vw,2.1rem)] leading-[0.95]"
            >
              Szczegółowa&nbsp;wycena
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="shrink-0 -mr-2 -mt-1 w-10 h-10 grid place-items-center text-noir-faint hover:text-noir-bright transition-colors"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {status === 'sent' ? (
          <div className="px-6 md:px-8 py-12 md:py-16 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-accent/15 grid place-items-center mb-5">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent-hi)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5 9-11" />
              </svg>
            </div>
            <h3 className="font-impact italic font-black uppercase text-2xl mb-2">Mamy to.</h3>
            <p className="text-noir-muted leading-relaxed mb-1">
              Oddzwonimy z&nbsp;wyceną w&nbsp;ciągu <strong className="text-noir-bright">15&nbsp;minut</strong> w&nbsp;godz. 9–19.
              {readyPhotosCount > 0 && (
                <> Odebraliśmy też <strong className="text-noir-bright">{readyPhotosCount}</strong>&nbsp;{readyPhotosCount === 1 ? 'zdjęcie' : 'zdjęć'}.</>
              )}
            </p>
            <p className="text-noir-faint text-sm mb-8">Poza godzinami — pierwsza wolna chwila następnego dnia.</p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-6 py-3 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[12.5px] tracking-[0.12em] hover:bg-accent-hi transition-colors"
            >
              Zamknij
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="px-6 md:px-8 py-6 md:py-7 space-y-6">
            {/* Selected services summary */}
            <SelectionSummary
              selectedDetails={selectedDetails}
              subtotal={subtotal}
              hasQuoteOnRequest={hasQuoteOnRequest}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                ref={firstFieldRef}
                label="Imię"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                autoComplete="given-name"
              />
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
                label="Marka, model i rok"
                name="carModel"
                value={form.carModel}
                onChange={onChange}
                placeholder="np. Audi RS6 2022"
                autoComplete="off"
              />
            </div>

            {hasDoorToDoor && (
              <div className="rounded-lg border border-accent/40 bg-accent/[0.05] p-4">
                <p className="text-[11px] uppercase tracking-widest text-accent font-bold mb-2 flex items-center gap-1.5">
                  <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 1.5a5 5 0 0 1 5 5c0 4-5 8-5 8s-5-4-5-8a5 5 0 0 1 5-5z" />
                    <circle cx="8" cy="6.5" r="1.5" />
                  </svg>
                  Door-to-door · adres odbioru
                </p>
                <Field
                  as="textarea"
                  label="Adres"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  required
                  rows={2}
                  placeholder="ul., numer, kod pocztowy, miasto"
                  autoComplete="street-address"
                />
              </div>
            )}

            <Field
              as="textarea"
              label="Krótki opis (opcjonalnie)"
              name="note"
              value={form.note}
              onChange={onChange}
              rows={3}
              placeholder="Stan auta, oczekiwany termin, dodatkowe potrzeby…"
            />

            <PhotoGrid
              photos={photos}
              setPhotos={setPhotos}
              photoErr={photoErr}
              setPhotoErr={setPhotoErr}
            />

            {status === 'error' && (
              <p className="text-sm text-accent-hi font-medium">{errorMsg}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center pt-1">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded text-noir-deep bg-accent uppercase font-display font-bold text-[13px] tracking-[0.12em] hover:bg-accent-hi transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Wysyłanie…' : 'Wyślij · 15 min'}
                {status !== 'sending' && (
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                )}
              </button>
              <p className="text-[11.5px] text-noir-faint leading-relaxed sm:max-w-xs">
                Oddzwonimy w&nbsp;ciągu 15&nbsp;minut w&nbsp;godz. 9–19.
              </p>
            </div>

            <p className="text-[11px] text-noir-faint leading-relaxed pt-1 border-t border-hairline">
              {RODO_HINT}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Photo grid                                                                 */
/* -------------------------------------------------------------------------- */

function PhotoGrid({ photos, setPhotos, photoErr, setPhotoErr }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = useCallback(
    async (fileList) => {
      setPhotoErr('')
      const files = Array.from(fileList || [])
      if (files.length === 0) return

      const remaining = PHOTO_LIMITS.max - photos.length
      if (remaining <= 0) {
        setPhotoErr(`Maksymalnie ${PHOTO_LIMITS.max} zdjęć.`)
        return
      }

      const toProcess = []
      for (const file of files.slice(0, remaining)) {
        // HEIC/HEIF: helpful Polish message, no auto-conversion
        if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
          setPhotoErr('Format HEIC/HEIF nie jest obsługiwany — wyeksportuj zdjęcie jako JPG.')
          continue
        }
        if (!ACCEPTED_TYPES.includes(file.type) && file.type !== '') {
          setPhotoErr(`Format ${file.type} nie jest obsługiwany — wybierz JPG, PNG lub WebP.`)
          continue
        }
        if (file.size > PHOTO_LIMITS.maxBytesRaw) {
          setPhotoErr(
            `${file.name}: ${(file.size / 1024 / 1024).toFixed(1)} MB to za dużo — limit ${(PHOTO_LIMITS.maxBytesRaw / 1024 / 1024).toFixed(0)} MB na zdjęcie.`,
          )
          continue
        }
        toProcess.push(file)
      }

      if (files.length > remaining) {
        setPhotoErr(`Dodano ${toProcess.length} zdjęć — limit ${PHOTO_LIMITS.max} szt.`)
      }

      if (toProcess.length === 0) return

      // Insert pending placeholders synchronously so the UI updates immediately
      const pending = toProcess.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        name: file.name,
        dataUrl: '',
        status: 'processing',
        sizeKB: 0,
      }))
      setPhotos((cur) => [...cur, ...pending])

      // Process each in parallel
      await Promise.all(
        pending.map(async (entry) => {
          try {
            const { dataUrl, sizeKB } = await compressImage(entry.file)
            setPhotos((cur) =>
              cur.map((p) =>
                p.id === entry.id
                  ? { ...p, dataUrl, sizeKB, status: 'ok', file: undefined }
                  : p,
              ),
            )
          } catch (err) {
            setPhotos((cur) =>
              cur.map((p) =>
                p.id === entry.id
                  ? { ...p, status: 'error', error: err.message || 'Błąd zdjęcia' }
                  : p,
              ),
            )
          }
        }),
      )
    },
    [photos.length, setPhotoErr, setPhotos],
  )

  const removePhoto = useCallback(
    (id) => setPhotos((cur) => cur.filter((p) => p.id !== id)),
    [setPhotos],
  )

  const onFilePick = (e) => {
    addFiles(e.target.files)
    e.target.value = '' // allow re-pick of same file
  }

  const onDragOver = (e) => {
    if (Array.from(e.dataTransfer?.types || []).includes('Files')) {
      e.preventDefault()
      setDragOver(true)
    }
  }
  const onDragLeave = () => setDragOver(false)
  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files)
  }

  const slots = Array.from({ length: PHOTO_LIMITS.max }, (_, i) => photos[i] || null)
  const firstEmptyIndex = photos.length
  const totalSizeKB = photos.reduce((n, p) => n + (p.sizeKB || 0), 0)

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`rounded-lg border ${
        dragOver ? 'border-accent bg-accent/[0.06]' : 'border-hairline'
      } transition-colors p-4`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-noir-faint">
            Zdjęcia auta (opcjonalnie)
          </p>
          <p className="text-[12px] text-noir-faint mt-0.5">
            JPG · PNG · WebP · maks. {PHOTO_LIMITS.max} szt.
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-noir-faint tabular-nums shrink-0">
          {photos.length}/{PHOTO_LIMITS.max}
          {totalSizeKB > 0 && (
            <span className="ml-2 normal-case text-noir-faint/80">
              · {(totalSizeKB / 1024).toFixed(1)} MB
            </span>
          )}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onFilePick}
        className="sr-only"
        aria-hidden="true"
      />

      <ol className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {slots.map((slot, i) => (
          <PhotoSlot
            key={slot?.id || `empty-${i}`}
            slot={slot}
            index={i}
            active={!slot && i === firstEmptyIndex}
            onAdd={() => inputRef.current?.click()}
            onRemove={() => slot && removePhoto(slot.id)}
          />
        ))}
      </ol>

      {photoErr && (
        <p className="mt-3 text-[12.5px] text-accent-hi">{photoErr}</p>
      )}

      {dragOver && (
        <p className="mt-3 text-[12.5px] text-accent text-center font-medium">
          Upuść zdjęcia — dodamy do listy.
        </p>
      )}
    </div>
  )
}

function PhotoSlot({ slot, index, active, onAdd, onRemove }) {
  // Filled slot
  if (slot && slot.status === 'ok') {
    return (
      <li className="relative aspect-square rounded-md overflow-hidden border border-hairline-hi group">
        <img
          src={slot.dataUrl}
          alt={`Zdjęcie ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold tabular-nums bg-noir-deep/80 text-noir-bright rounded-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Usuń zdjęcie ${index + 1}`}
          className="absolute top-1.5 right-1.5 w-6 h-6 grid place-items-center rounded-full bg-accent text-noir-deep hover:bg-accent-hi transition-colors opacity-90 group-hover:opacity-100"
        >
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M4 4l8 8M12 4L4 12" />
          </svg>
        </button>
      </li>
    )
  }

  // Processing
  if (slot && slot.status === 'processing') {
    return (
      <li className="relative aspect-square rounded-md border border-hairline-hi bg-noir-elevated grid place-items-center">
        <Spinner />
        <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-noir-faint truncate">
          {slot.name}
        </p>
      </li>
    )
  }

  // Error
  if (slot && slot.status === 'error') {
    return (
      <li className="relative aspect-square rounded-md border border-accent/60 bg-accent/[0.08] grid place-items-center p-2 text-center">
        <p className="text-[10px] text-accent-hi leading-tight">
          {slot.error || 'Błąd zdjęcia'}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Usuń"
          className="absolute top-1 right-1 w-5 h-5 grid place-items-center rounded-full bg-accent/80 text-noir-deep hover:bg-accent transition-colors"
        >
          <svg viewBox="0 0 16 16" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M4 4l8 8M12 4L4 12" />
          </svg>
        </button>
      </li>
    )
  }

  // Empty slot — active (clickable add) or passive (decorative)
  if (active) {
    return (
      <li>
        <button
          type="button"
          onClick={onAdd}
          className="relative w-full aspect-square rounded-md border border-dashed border-accent/60 bg-accent/[0.04] hover:bg-accent/[0.10] hover:border-accent transition-colors grid place-items-center"
        >
          <span className="flex flex-col items-center gap-1.5 text-accent">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="text-[10px] uppercase tracking-widest font-bold">Dodaj</span>
          </span>
        </button>
      </li>
    )
  }

  return (
    <li
      aria-hidden="true"
      className="relative aspect-square rounded-md border border-hairline bg-noir-elevated/40"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, transparent 0 6px, rgba(246,246,247,0.04) 6px 7px)',
      }}
    >
      <span className="absolute top-1.5 left-1.5 text-[10px] text-noir-faint/60 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
    </li>
  )
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      className="animate-spin text-accent"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Compress helper                                                            */
/* -------------------------------------------------------------------------- */

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        let { width, height } = img
        const maxEdge = PHOTO_LIMITS.maxEdgePx
        if (width > maxEdge || height > maxEdge) {
          const scale = Math.min(maxEdge / width, maxEdge / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', PHOTO_LIMITS.quality)
        URL.revokeObjectURL(objectUrl)
        // dataUrl: "data:image/jpeg;base64,XXXX" — size ≈ base64.length * 3/4
        const base64 = dataUrl.split(',')[1] || ''
        const sizeKB = Math.round((base64.length * 3) / 4 / 1024)
        resolve({ dataUrl, sizeKB })
      } catch (err) {
        URL.revokeObjectURL(objectUrl)
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Nie udało się odczytać zdjęcia.'))
    }
    img.src = objectUrl
  })
}

/* -------------------------------------------------------------------------- */
/* Selection summary + Field                                                  */
/* -------------------------------------------------------------------------- */

function SelectionSummary({ selectedDetails, subtotal, hasQuoteOnRequest }) {
  if (selectedDetails.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-hairline-hi bg-noir-elevated/40 px-4 py-3.5 text-sm text-noir-faint">
        Nie zaznaczyłeś usług — wycenimy na podstawie opisu i&nbsp;rozmowy telefonicznej.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-hairline-hi bg-noir-elevated/60 overflow-hidden">
      <div className="px-4 py-3 border-b border-hairline flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-widest text-noir-faint">
          Zaznaczone usługi ({selectedDetails.length})
        </p>
        <p className="text-[11px] uppercase tracking-widest text-accent font-bold tabular-nums">
          {hasQuoteOnRequest ? `od ${formatZl(subtotal)} +` : `od ${formatZl(subtotal)}`}
        </p>
      </div>
      <ul className="max-h-44 overflow-y-auto divide-y divide-hairline">
        {selectedDetails.map((s) => (
          <li
            key={s.id}
            className="flex items-baseline gap-3 px-4 py-2.5 text-sm"
          >
            <span className="flex-1 min-w-0 truncate text-noir-bright">{s.name}</span>
            <span className="shrink-0 text-noir-faint tabular-nums text-[12.5px]">
              {s.quoteOnRequest ? 'wycena' : `od ${formatZl(s.priceFrom)}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Forward-refed input/textarea so the parent can focus the first field on open.
const Field = forwardRef(function Field(
  {
    label,
    name,
    value,
    onChange,
    type = 'text',
    as = 'input',
    rows,
    required,
    placeholder,
    autoComplete,
    inputMode,
  },
  ref,
) {
  const Tag = as
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-noir-faint">
        {label}
        {required && ' *'}
      </span>
      <Tag
        ref={ref}
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
})
