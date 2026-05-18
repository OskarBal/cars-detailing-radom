import { useEffect, useRef, useState } from 'react'

// Tomasz's TikTok IDs (ported from legacy site)
const VIDEOS = [
  '7592202369799228674',
  '7571531853555993879',
  '7554467947104898306',
  '7623393886597156128',
]

const playerUrl = (id) =>
  `https://www.tiktok.com/player/v1/${id}?autoplay=0&loop=1&controls=1&music_info=0&description=0&rel=0&progress_bar=0`

export default function Realizacje() {
  const sectionRef = useRef(null)
  const [hydrated, setHydrated] = useState(false)

  // Lazy-hydrate iframes when section enters viewport (saves LCP/data)
  useEffect(() => {
    if (!sectionRef.current || hydrated) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setHydrated(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [hydrated])

  return (
    <section
      ref={sectionRef}
      id="realizacje"
      aria-label="Realizacje"
      className="relative bg-noir-deep text-noir-bright py-20 md:py-32 px-6 md:px-10 border-t border-hairline"
    >
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-12 md:mb-14 max-w-2xl">
          <p className="text-accent font-display font-bold text-[12px] tracking-[0.22em] uppercase mb-4">
            Realizacje
          </p>
          <h2 className="font-impact italic font-black uppercase leading-[0.95] text-[clamp(2rem,5.2vw,3.6rem)] mb-4">
            Zobacz efekty<br />naszej&nbsp;pracy.
          </h2>
          <p className="text-noir-muted text-base md:text-lg leading-relaxed">
            Wybrane projekty na&nbsp;naszym TikToku.
            Pełna galeria — <a href="https://www.tiktok.com/@carsdetailingradom" target="_blank" rel="noopener" className="text-accent hover:text-accent-hi underline-offset-4 hover:underline">@carsdetailingradom</a>.
          </p>
        </header>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {VIDEOS.map((id) => (
            <li
              key={id}
              className="relative rounded-2xl overflow-hidden border border-hairline bg-noir-surface aspect-[9/16]"
            >
              {hydrated ? (
                <iframe
                  src={playerUrl(id)}
                  title={`Realizacja Cars Detailing Radom — TikTok ${id}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-noir-faint text-xs tracking-wider uppercase">
                  Wczytywanie…
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
