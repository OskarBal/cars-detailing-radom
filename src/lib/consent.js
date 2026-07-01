// Single source of truth for cookie consent.
// Shape stored in localStorage:
//   { analytics: boolean, marketing: boolean, timestamp: ISO string, version: 1 }
// Analytics gate is what GA4 (and any future tools) should read before initializing.
// Subscribe pattern lets the GA loader react when the user flips the switch
// after page-load (e.g. opens the banner again from /cookies and accepts).

const STORAGE_KEY = 'cdr.consent.v1'
const EVENT_NAME = 'cdr:consent-change'

export function getConsent() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      timestamp: parsed.timestamp || null,
      version: parsed.version || 1,
    }
  } catch {
    return null
  }
}

export function hasMadeChoice() {
  return getConsent() !== null
}

export function setConsent({ analytics = false, marketing = false } = {}) {
  if (typeof window === 'undefined') return
  const payload = {
    analytics: !!analytics,
    marketing: !!marketing,
    timestamp: new Date().toISOString(),
    version: 1,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // private mode or quota — fail silently; banner will reappear next visit
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }))

  // Google Consent Mode v2 — applies even before GA tag is on page.
  // When the GA script later loads, it picks up the most recent consent state.
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: payload.analytics ? 'granted' : 'denied',
      ad_storage:        payload.marketing ? 'granted' : 'denied',
      ad_user_data:      payload.marketing ? 'granted' : 'denied',
      ad_personalization: payload.marketing ? 'granted' : 'denied',
    })
  }
}

export function clearConsent() {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }))
}

export function subscribeConsent(callback) {
  if (typeof window === 'undefined') return () => {}
  const handler = (e) => callback(e.detail)
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}

export const CONSENT_EVENT = EVENT_NAME
