import { Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import Cennik from './pages/Cennik.jsx'
import PPF from './pages/PPF.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="cennik" element={<Cennik />} />
        <Route path="ppf" element={<PPF />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
