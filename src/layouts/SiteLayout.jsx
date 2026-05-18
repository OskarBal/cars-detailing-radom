import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function SiteLayout() {
  const { pathname } = useLocation()

  // Scroll to top on route change (anchors on same page handled by browser)
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])

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
