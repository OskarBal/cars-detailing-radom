// Vercel Serverless Function — /api/wycena
// Receives quote-request payload from pages/Cennik.jsx → WycenaForm,
// sends two emails via Resend: owner notification + customer confirmation.
//
// Required env (set in Vercel dashboard, NOT committed):
//   RESEND_API_KEY        — Resend secret (re_…)
//   WYCENA_TO_EMAIL       — owner inbox (Tomasz; placeholder until Meeting #2)
//   WYCENA_FROM_EMAIL     — verified Resend sender (e.g. wycena@carsdetailingradom.pl)
//   WYCENA_REPLY_TO       — optional; defaults to WYCENA_TO_EMAIL
//
// Memory rules honored:
//   - Never use onboarding@resend.dev as `from:` (recipient-restricted, cost Jarząbek 3 days).
//   - Resend SDK ^3 returns { data, error } — never throws on API errors; check error explicitly.

import { Resend } from 'resend'

// Bump body size limit so the photo payload (up to 10 × ~250 KB base64 ≈ 3.3 MB) fits.
// Default is 1 MB on Vercel.
export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } },
}

// ── Anti-abuse: best-effort in-memory rate limit.
// ponytail: per-instance only — serverless runs several instances, so this
// blunts a single-IP flood, it is NOT a hard global cap. Upgrade to Vercel
// Firewall / Upstash if real abuse shows up.
const RL_HITS = new Map()
function clientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff) return xff.split(',')[0].trim()
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}
function rateLimited(req, limit = 10, windowMs = 600000) {
  const ip = clientIp(req)
  const now = Date.now()
  const hits = (RL_HITS.get(ip) || []).filter((t) => now - t < windowMs)
  hits.push(now)
  RL_HITS.set(ip, hits)
  if (RL_HITS.size > 5000) for (const [k, v] of RL_HITS) if (!v.some((t) => now - t < windowMs)) RL_HITS.delete(k)
  return hits.length > limit
}

const MAX_NAME = 80
const MAX_PHONE = 32
const MAX_EMAIL = 120
const MAX_CAR = 120
const MAX_ADDRESS = 240
const MAX_NOTE = 2000
const MAX_PHOTOS = 10
const MAX_PHOTO_BYTES = 1_500_000 // ~1.5 MB per photo cap (decoded), defense against bypassed client compression

function clean(v, max) {
  if (typeof v !== 'string') return ''
  return v.trim().slice(0, max)
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatZlServer(n) {
  return new Intl.NumberFormat('pl-PL').format(n) + ' zł'
}

// Parse a data URL like "data:image/jpeg;base64,XXX" into { mime, ext, base64 }.
// Returns null on anything that isn't a base64-encoded image we accept.
function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null
  const m = /^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/i.exec(dataUrl)
  if (!m) return null
  const mime = m[1].toLowerCase()
  const base64 = m[2]
  const ext = mime === 'image/jpeg' || mime === 'image/jpg' ? 'jpg' : mime.split('/')[1]
  return { mime, ext, base64 }
}

function safeFilename(name, fallback) {
  const trimmed = (name || '').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 60)
  return trimmed || fallback
}

function buildAttachments(photos) {
  const out = []
  if (!Array.isArray(photos)) return out
  for (let i = 0; i < photos.length && out.length < MAX_PHOTOS; i++) {
    const p = photos[i]
    const parsed = parseDataUrl(p?.dataUrl)
    if (!parsed) continue
    // base64.length * 3/4 ≈ decoded byte size
    const decodedSize = Math.floor((parsed.base64.length * 3) / 4)
    if (decodedSize > MAX_PHOTO_BYTES) continue
    const baseName = safeFilename(p?.name?.replace(/\.[^.]+$/, ''), `zdjecie-${i + 1}`)
    out.push({
      filename: `${baseName}.${parsed.ext}`,
      content: parsed.base64,
      // Resend SDK ^3 accepts base64 strings for `content` directly.
    })
  }
  return out
}

// Human label for a PPF preset id ("pkg-cale-auto" → "PPF całe auto"). Keeps the
// owner-email subject readable without importing the data file (api/ runs on
// Node, the data lives in src/ — duplicate is cheaper than a build-time alias).
const PPF_PKG_LABELS = {
  'pkg-reflektory': 'PPF reflektory',
  'pkg-progi':      'Zabezpieczenie progów PPF',
  'pkg-front':      'PPF pakiet front',
  'pkg-cale-auto':  'PPF całe auto',
}

function buildOwnerHtml(payload) {
  const {
    name,
    phone,
    email,
    carModel,
    address,
    note,
    selectedDetails = [],
    subtotal = 0,
    hasQuoteOnRequest = false,
    submittedAt,
    photosCount = 0,
    mode = 'cennik',
    ppfPackageId = null,
  } = payload

  const isPpf = mode === 'ppf'
  const pkgLabel = ppfPackageId ? PPF_PKG_LABELS[ppfPackageId] || null : null

  const rows = selectedDetails
    .map((s) => {
      const price = s.quoteOnRequest
        ? 'wycena indywidualna'
        : `od ${formatZlServer(s.priceFrom || 0)}`
      return `<tr>
        <td style="padding:6px 12px;border-bottom:1px solid #1f1f23;color:#f6f6f7">${escapeHtml(s.name)}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #1f1f23;color:#9aa0a6;font-size:12px;text-align:right;white-space:nowrap">${escapeHtml(price)}</td>
      </tr>`
    })
    .join('')

  const subtotalLabel = isPpf ? 'Suma od' : 'Suma od'
  const subtotalLine =
    selectedDetails.length > 0
      ? `<tr>
          <td style="padding:10px 12px;color:#f6f6f7;font-weight:700">${subtotalLabel}</td>
          <td style="padding:10px 12px;color:#B82119;font-weight:700;text-align:right;white-space:nowrap">od ${formatZlServer(subtotal)}${hasQuoteOnRequest ? ' +' : ''}</td>
        </tr>`
      : ''

  const eyebrowLabel = isPpf ? 'Cars Detailing Radom · PPF' : 'Cars Detailing Radom · Wycena'
  const h1Label = isPpf
    ? `Nowa konfiguracja PPF — ${escapeHtml(name)}`
    : `Nowa wycena — ${escapeHtml(name)}`
  const tableHeader = isPpf
    ? `Wybrane strefy (${selectedDetails.length})${pkgLabel ? ` · pakiet ${escapeHtml(pkgLabel)}` : ''}`
    : `Zaznaczone usługi (${selectedDetails.length})`

  return `
<!doctype html><html><body style="margin:0;background:#08090A;color:#f6f6f7;font-family:-apple-system,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:28px 24px">
  <p style="margin:0 0 6px;color:#B82119;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:800">${eyebrowLabel}</p>
  <h1 style="margin:0 0 24px;font-size:28px;line-height:1.1;color:#f6f6f7">${h1Label}</h1>

  <table style="width:100%;border-collapse:collapse;background:#111214;border-radius:8px;overflow:hidden">
    <tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em;width:120px">Telefon</td><td style="padding:10px 14px;color:#f6f6f7"><a href="tel:${encodeURIComponent(phone)}" style="color:#f6f6f7;text-decoration:none">${escapeHtml(phone)}</a></td></tr>
    ${email ? `<tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em">Email</td><td style="padding:10px 14px;color:#f6f6f7"><a href="mailto:${escapeHtml(email)}" style="color:#f6f6f7;text-decoration:none">${escapeHtml(email)}</a></td></tr>` : ''}
    ${carModel ? `<tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em">Auto</td><td style="padding:10px 14px;color:#f6f6f7">${escapeHtml(carModel)}</td></tr>` : ''}
    ${address ? `<tr><td style="padding:10px 14px;color:#B82119;font-size:12px;text-transform:uppercase;letter-spacing:.18em;font-weight:700;vertical-align:top">Adres odbioru</td><td style="padding:10px 14px;color:#f6f6f7;white-space:pre-wrap"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" style="color:#f6f6f7;text-decoration:underline">${escapeHtml(address)}</a></td></tr>` : ''}
    ${note ? `<tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em;vertical-align:top">Opis</td><td style="padding:10px 14px;color:#f6f6f7;white-space:pre-wrap">${escapeHtml(note)}</td></tr>` : ''}
  </table>

  ${
    rows
      ? `<h2 style="margin:28px 0 10px;font-size:15px;color:#9aa0a6;font-weight:700;text-transform:uppercase;letter-spacing:.18em">${tableHeader}</h2>
    <table style="width:100%;border-collapse:collapse;background:#111214;border-radius:8px;overflow:hidden">
      ${rows}
      ${subtotalLine}
    </table>`
      : `<p style="margin:24px 0 0;color:#9aa0a6;font-size:14px">${isPpf ? 'Klient nie zaznaczył stref — wycena na bazie rozmowy.' : 'Klient nie zaznaczył usług — wycena na bazie rozmowy.'}</p>`
  }

  ${
    photosCount > 0
      ? `<p style="margin:24px 0 0;color:#9aa0a6;font-size:13px">📎 W&nbsp;załączniku ${photosCount}&nbsp;${photosCount === 1 ? 'zdjęcie' : 'zdjęć'} auta.</p>`
      : ''
  }

  <p style="margin:32px 0 0;color:#5f6266;font-size:11px">Wysłane: ${escapeHtml(submittedAt)} · z formularza /cennik</p>
</div>
</body></html>`.trim()
}

function buildCustomerHtml(payload) {
  const { name } = payload
  return `
<!doctype html><html><body style="margin:0;background:#08090A;color:#f6f6f7;font-family:-apple-system,'Segoe UI',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <p style="margin:0 0 6px;color:#B82119;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:800">Cars Detailing Radom</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.1">Dzięki, ${escapeHtml(name)}.</h1>
  <p style="margin:0 0 14px;color:#cfd1d4;line-height:1.55">Odebraliśmy Twoje zgłoszenie. Oddzwonimy z wyceną w&nbsp;ciągu <strong style="color:#f6f6f7">15&nbsp;minut</strong> w&nbsp;godz. 9–19. Poza godzinami — pierwsza wolna chwila następnego dnia.</p>
  <p style="margin:24px 0 8px;color:#9aa0a6;font-size:13px">Najszybszy kontakt:</p>
  <p style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:16px"><a href="tel:+48690426050" style="color:#f6f6f7;text-decoration:none">+48 690 426 050</a></p>
  <p style="margin:40px 0 0;color:#5f6266;font-size:11px">ul. Opolska 46A · Radom · carsdetailingradom.pl</p>
</div>
</body></html>`.trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (rateLimited(req)) {
    res.setHeader('Retry-After', '600')
    return res.status(429).json({ error: 'Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.WYCENA_TO_EMAIL
  const fromEmail = process.env.WYCENA_FROM_EMAIL
  const replyTo = process.env.WYCENA_REPLY_TO || toEmail

  if (!apiKey || !toEmail || !fromEmail) {
    console.error('[wycena] Missing env: RESEND_API_KEY/WYCENA_TO_EMAIL/WYCENA_FROM_EMAIL')
    return res.status(500).json({ error: 'Konfiguracja serwera niekompletna. Zadzwoń bezpośrednio na +48 690 426 050.' })
  }

  // Defensive against placeholder leaks
  if (/^onboarding@resend\.dev$/i.test(fromEmail)) {
    console.error('[wycena] WYCENA_FROM_EMAIL is set to sandbox onboarding@resend.dev — Resend will only deliver to the account owner. Fix the env.')
    return res.status(500).json({ error: 'Adres nadawcy nie został zweryfikowany. Zadzwoń bezpośrednio.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Nieprawidłowy format danych.' })
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Brak danych formularza.' })
  }

  // Honeypot — silently accept & drop bot submissions (hidden "company" field).
  if (typeof body.company === 'string' && body.company.trim()) {
    return res.status(200).json({ ok: true })
  }

  const attachments = buildAttachments(body.photos)

  const mode = body.mode === 'ppf' ? 'ppf' : 'cennik'

  const payload = {
    name: clean(body.name, MAX_NAME),
    phone: clean(body.phone, MAX_PHONE),
    email: clean(body.email, MAX_EMAIL),
    carModel: clean(body.carModel, MAX_CAR),
    address: clean(body.address, MAX_ADDRESS),
    note: clean(body.note, MAX_NOTE),
    selectedIds: Array.isArray(body.selectedIds) ? body.selectedIds.slice(0, 60) : [],
    selectedDetails: Array.isArray(body.selectedDetails) ? body.selectedDetails.slice(0, 60) : [],
    subtotal: typeof body.subtotal === 'number' ? body.subtotal : 0,
    hasQuoteOnRequest: !!body.hasQuoteOnRequest,
    mode,
    ppfPackageId: typeof body.ppfPackageId === 'string' ? clean(body.ppfPackageId, 48) : null,
    submittedAt: clean(body.submittedAt, 64) || new Date().toISOString(),
    photosCount: attachments.length,
  }

  if (!payload.name || !payload.phone) {
    return res.status(400).json({ error: 'Imię i telefon są wymagane.' })
  }
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return res.status(400).json({ error: 'Nieprawidłowy adres e-mail.' })
  }
  if (payload.selectedIds.includes('door-to-door') && !payload.address) {
    return res.status(400).json({ error: 'Przy usłudze door-to-door adres odbioru jest wymagany.' })
  }

  const resend = new Resend(apiKey)

  // 1) Owner notification
  const photosTag = attachments.length > 0 ? ` · ${attachments.length}📎` : ''
  let ownerSubject
  if (payload.mode === 'ppf') {
    const pkgLabel = payload.ppfPackageId
      ? PPF_PKG_LABELS[payload.ppfPackageId] || 'Konfiguracja indywidualna'
      : 'Konfiguracja indywidualna'
    ownerSubject = `PPF · ${payload.name} · ${pkgLabel}${payload.carModel ? ` · ${payload.carModel}` : ''}${photosTag}`
  } else {
    ownerSubject = `Wycena · ${payload.name}${payload.carModel ? ` · ${payload.carModel}` : ''}${photosTag}`
  }
  const { data: ownerData, error: ownerError } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email || replyTo,
    subject: ownerSubject,
    html: buildOwnerHtml(payload),
    attachments: attachments.length > 0 ? attachments : undefined,
  })

  if (ownerError) {
    console.error('[wycena] Resend owner-email error:', ownerError)
    return res.status(502).json({ error: 'Nie udało się wysłać formularza. Zadzwoń bezpośrednio na +48 690 426 050.' })
  }

  // 2) Optional customer confirmation (only if they provided email)
  let confirmationError = null
  if (payload.email) {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      replyTo,
      subject: 'Mamy Twoje zgłoszenie · Cars Detailing Radom',
      html: buildCustomerHtml(payload),
    })
    if (error) {
      confirmationError = error
      console.warn('[wycena] Customer confirmation failed (owner email succeeded):', error)
      // Don't fail the request — the owner already has the lead.
    }
  }

  return res.status(200).json({
    ok: true,
    ownerEmailId: ownerData?.id || null,
    confirmationSent: !!payload.email && !confirmationError,
    photosAttached: attachments.length,
  })
}
