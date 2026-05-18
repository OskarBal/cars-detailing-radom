import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function SiteLayout() {
  const { pathname, hash } = useLocation()

  // Scroll on route or hash change. If hash, scroll to the matching id;
  // otherwise reset to top. Wait one frame so the destination section is mounted.
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      // small timeout lets the route's tree paint before we scroll
      const t = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
