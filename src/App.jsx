import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import Home from './pages/Home.jsx'

const Cennik          = lazy(() => import('./pages/Cennik.jsx'))
const PPF             = lazy(() => import('./pages/PPF.jsx'))
const ServiceLanding  = lazy(() => import('./pages/ServiceLanding.jsx'))
const Regulamin       = lazy(() => import('./pages/Regulamin.jsx'))
const PolitykaPrywatnosci = lazy(() => import('./pages/PolitykaPrywatnosci.jsx'))
const Cookies         = lazy(() => import('./pages/Cookies.jsx'))
const NotFound        = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="cennik" element={<Cennik />} />
          <Route path="ppf" element={<PPF />} />
          <Route path="auto-detailing-radom" element={<ServiceLanding slug="auto-detailing-radom" />} />
          <Route path="powloki-ceramiczne-radom" element={<ServiceLanding slug="powloki-ceramiczne-radom" />} />
          <Route path="korekta-lakieru-radom" element={<ServiceLanding slug="korekta-lakieru-radom" />} />
          <Route path="pranie-tapicerki-radom" element={<ServiceLanding slug="pranie-tapicerki-radom" />} />
          <Route path="detailing-wnetrza-radom" element={<ServiceLanding slug="detailing-wnetrza-radom" />} />
          <Route path="regulamin" element={<Regulamin />} />
          <Route path="polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
          <Route path="cookies" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
