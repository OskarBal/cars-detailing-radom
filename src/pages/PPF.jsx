import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  PPF_PACKAGE_BY_ID,
  PPF_PACKAGE_BY_SLUG,
  PPF_DEFAULT_PACKAGE_ID,
} from '../lib/ppf-data.js'
import WycenaForm from '../components/WycenaForm.jsx'
import PpfHero from '../components/ppf/PpfHero.jsx'
import CarCanvas from '../components/ppf/CarCanvas.jsx'
import Packages from '../components/ppf/Packages.jsx'
import PackageSummary from '../components/ppf/PackageSummary.jsx'
import PpfStickyBar from '../components/ppf/PpfStickyBar.jsx'
import SpecsBlock from '../components/ppf/SpecsBlock.jsx'
import ValueCalculator from '../components/ppf/ValueCalculator.jsx'
import Realizacje from '../components/ppf/Realizacje.jsx'
import Faq from '../components/ppf/Faq.jsx'
import FinalCta from '../components/ppf/FinalCta.jsx'

const STORAGE_KEY = 'cdr.ppf.selection.v1'

function loadActivePackageId() {
  if (typeof window === 'undefined') return PPF_DEFAULT_PACKAGE_ID
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return PPF_DEFAULT_PACKAGE_ID
    // Migration: phase 1 stored a string[] of zone IDs. Anything that isn't
    // a known package id falls back to the default.
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'string' && PPF_PACKAGE_BY_ID[parsed]) return parsed
    return PPF_DEFAULT_PACKAGE_ID
  } catch {
    return PPF_DEFAULT_PACKAGE_ID
  }
}

function saveActivePackageId(id) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(id))
  } catch {
    /* quota / private mode — fail silently */
  }
}

export default function PPF() {
  const location = useLocation()
  const navigate = useNavigate()

  const [activePackageId, setActivePackageId] = useState(loadActivePackageId)
  const [view, setView] = useState('front')
  const [formOpen, setFormOpen] = useState(false)
  const [formPrefillNote, setFormPrefillNote] = useState('')

  useEffect(() => { saveActivePackageId(activePackageId) }, [activePackageId])

  // Deep-link: ?pkg=<slug> auto-selects on mount (one-shot, then stripped)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const pkgParam = params.get('pkg')
    if (pkgParam) {
      const pkg = PPF_PACKAGE_BY_SLUG[pkgParam] || PPF_PACKAGE_BY_ID[`pkg-${pkgParam}`] || PPF_PACKAGE_BY_ID[pkgParam]
      if (pkg) setActivePackageId(pkg.id)
      navigate('/ppf' + (location.hash || ''), { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Deep-link: #wycena opens form, #pakiety scrolls to packages list
  useEffect(() => {
    const hash = (location.hash || '').replace('#', '')
    if (!hash) return
    if (hash === 'wycena') {
      const id = window.requestAnimationFrame(() => setFormOpen(true))
      return () => window.cancelAnimationFrame(id)
    }
    const id = window.requestAnimationFrame(() => {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(id)
  }, [location.hash])

  const applyPackage = useCallback((pkgId) => {
    if (!PPF_PACKAGE_BY_ID[pkgId]) return
    setActivePackageId(pkgId)
  }, [])

  const openForm = useCallback(() => {
    setFormPrefillNote('')
    setFormOpen(true)
    if (location.hash !== '#wycena') {
      navigate('/ppf#wycena', { replace: true })
    }
  }, [location.hash, navigate])

  // Open the form with a pre-filled "note" — used by the Ekonomia ochrony
  // calculator to hand off the car profile (value, km, trasa, okres).
  // Also auto-selects the package the user was simulating, so the form
  // summary shows the right service.
  const openFormWithNote = useCallback((note, pkgId) => {
    if (pkgId && PPF_PACKAGE_BY_ID[pkgId]) setActivePackageId(pkgId)
    setFormPrefillNote(note || '')
    setFormOpen(true)
    if (location.hash !== '#wycena') {
      navigate('/ppf#wycena', { replace: true })
    }
  }, [location.hash, navigate])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setFormPrefillNote('')
    if (location.hash === '#wycena') {
      navigate('/ppf', { replace: true })
    }
  }, [location.hash, navigate])

  const activePackage = useMemo(
    () => PPF_PACKAGE_BY_ID[activePackageId] || null,
    [activePackageId],
  )

  return (
    <>
      <PpfHero />

      <section
        id="konfigurator"
        aria-label="Konfigurator PPF"
        className="relative bg-noir-deep px-6 md:px-10 py-14 md:py-20 border-b border-hairline"
      >
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-12">
          <CarCanvas
            activePackage={activePackage}
            view={view}
            onViewChange={setView}
          />
          <aside className="lg:sticky lg:top-24 self-start space-y-6">
            <Packages
              activePackageId={activePackageId}
              onApplyPackage={applyPackage}
            />
            <PackageSummary
              activePackage={activePackage}
              onOpenForm={openForm}
            />
          </aside>
        </div>
      </section>

      <SpecsBlock />
      <ValueCalculator
        activePackageId={activePackageId}
        onOpenFormWithNote={openFormWithNote}
      />
      <Realizacje />
      <Faq />
      <FinalCta onOpenForm={openForm} activePackage={activePackage} />

      <PpfStickyBar
        activePackage={activePackage}
        onOpenForm={openForm}
      />

      <WycenaForm
        open={formOpen}
        onClose={closeForm}
        mode="ppf"
        ppfPackage={activePackage}
        prefillNote={formPrefillNote}
      />
    </>
  )
}
