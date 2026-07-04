// Vercel Serverless Function — /api/lead
// Home page Kontakt section → general inquiry email.
// Lighter than /api/wycena: no services list, no photos, no address logic.
// Captures service-interest + timeline chips for lead qualification.
//
// Reuses the same env vars as /api/wycena:
//   RESEND_API_KEY, WYCENA_TO_EMAIL, WYCENA_FROM_EMAIL, WYCENA_REPLY_TO

import { Resend } from 'resend'

export const config = {
  api: { bodyParser: { sizeLimit: '64kb' } },
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
const MAX_INTEREST = 40
const MAX_TIMING = 40
const MAX_MESSAGE = 2000

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

function buildOwnerHtml({ name, phone, email, carModel, interest, timing, message, submittedAt }) {
  return `
<!doctype html><html><body style="margin:0;background:#08090A;color:#f6f6f7;font-family:-apple-system,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:28px 24px">
  <p style="margin:0 0 6px;color:#B82119;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:800">Cars Detailing Radom · Kontakt</p>
  <h1 style="margin:0 0 24px;font-size:26px;line-height:1.1;color:#f6f6f7">Nowy lead — ${escapeHtml(name)}</h1>

  <table style="width:100%;border-collapse:collapse;background:#111214;border-radius:8px;overflow:hidden">
    <tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em;width:140px">Telefon</td><td style="padding:10px 14px;color:#f6f6f7"><a href="tel:${encodeURIComponent(phone)}" style="color:#f6f6f7;text-decoration:none">${escapeHtml(phone)}</a></td></tr>
    ${email ? `<tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em">Email</td><td style="padding:10px 14px;color:#f6f6f7"><a href="mailto:${escapeHtml(email)}" style="color:#f6f6f7;text-decoration:none">${escapeHtml(email)}</a></td></tr>` : ''}
    ${carModel ? `<tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em">Auto</td><td style="padding:10px 14px;color:#f6f6f7">${escapeHtml(carModel)}</td></tr>` : ''}
    ${interest ? `<tr><td style="padding:10px 14px;color:#B82119;font-size:12px;text-transform:uppercase;letter-spacing:.18em;font-weight:700">Interesuje go</td><td style="padding:10px 14px;color:#f6f6f7">${escapeHtml(interest)}</td></tr>` : ''}
    ${timing ? `<tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em">Termin</td><td style="padding:10px 14px;color:#f6f6f7">${escapeHtml(timing)}</td></tr>` : ''}
    ${message ? `<tr><td style="padding:10px 14px;color:#9aa0a6;font-size:12px;text-transform:uppercase;letter-spacing:.18em;vertical-align:top">Wiadomość</td><td style="padding:10px 14px;color:#f6f6f7;white-space:pre-wrap">${escapeHtml(message)}</td></tr>` : ''}
  </table>

  <p style="margin:32px 0 0;color:#5f6266;font-size:11px">Wysłane: ${escapeHtml(submittedAt)} · z formularza /kontakt</p>
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
    console.error('[lead] Missing env: RESEND_API_KEY/WYCENA_TO_EMAIL/WYCENA_FROM_EMAIL')
    return res.status(500).json({ error: 'Konfiguracja serwera niekompletna. Zadzwoń bezpośrednio na +48 690 426 050.' })
  }

  if (/^onboarding@resend\.dev$/i.test(fromEmail)) {
    console.error('[lead] WYCENA_FROM_EMAIL is set to sandbox onboarding@resend.dev — fix the env.')
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

  const payload = {
    name: clean(body.name, MAX_NAME),
    phone: clean(body.phone, MAX_PHONE),
    email: clean(body.email, MAX_EMAIL),
    carModel: clean(body.carModel, MAX_CAR),
    interest: clean(body.interest, MAX_INTEREST),
    timing: clean(body.timing, MAX_TIMING),
    message: clean(body.message, MAX_MESSAGE),
    submittedAt: clean(body.submittedAt, 64) || new Date().toISOString(),
  }

  if (!payload.name || !payload.phone) {
    return res.status(400).json({ error: 'Imię i telefon są wymagane.' })
  }
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return res.status(400).json({ error: 'Nieprawidłowy adres e-mail.' })
  }

  const resend = new Resend(apiKey)

  const interestTag = payload.interest ? ` · ${payload.interest}` : ''
  const subject = `Lead · ${payload.name}${interestTag}`

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email || replyTo,
    subject,
    html: buildOwnerHtml(payload),
  })

  if (error) {
    console.error('[lead] Resend error:', error)
    return res.status(502).json({ error: 'Nie udało się wysłać formularza. Zadzwoń bezpośrednio na +48 690 426 050.' })
  }

  return res.status(200).json({ ok: true, emailId: data?.id || null })
}
