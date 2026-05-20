import Hero from '../sections/Hero.jsx'
import TrustStrip from '../sections/TrustStrip.jsx'
import PromoOfMonth from '../sections/PromoOfMonth.jsx'
import About from '../sections/About.jsx'
import Services from '../sections/Services.jsx'
import DoorToDoor from '../sections/DoorToDoor.jsx'
import PPFTeaser from '../components/ppf/PpfTeaser.jsx'
import Realizacje from '../sections/Realizacje.jsx'
import Kontakt from '../sections/Kontakt.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <PromoOfMonth />
      <About />
      <Services />
      <DoorToDoor />
      <PPFTeaser />
      <Realizacje />
      <Kontakt />
    </>
  )
}
