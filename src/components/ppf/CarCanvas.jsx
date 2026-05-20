import { PPF_PACKAGES, PPF_VIEWS } from '../../lib/ppf-data.js'

// Crossfade-stack canvas. Every package's render for the active view is
// pre-mounted as an absolutely-positioned <img>; selection toggles each
// image's opacity. No SVG layer, no polygon overlays — the render IS the
// answer. Base photo sits underneath as a visible fallback.
export default function CarCanvas({ activePackage, view, onViewChange }) {
  const current = PPF_VIEWS.find((v) => v.id === view) || PPF_VIEWS[0]

  return (
    <div className="relative aspect-[2000/1493] rounded-2xl overflow-hidden border border-hairline-hi bg-noir-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      {/* Base bare-paint render — always visible as the bottom layer */}
      <img
        src={current.baseImage}
        alt={`Mercedes G-Class — widok ${current.label.toLowerCase()}, bez folii`}
        width={2000}
        height={1493}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />

      {/* Per-package PPF renders, stacked, crossfade via opacity */}
      {PPF_PACKAGES.map((pkg) => {
        const isActive = activePackage?.id === pkg.id
        const src = pkg.images[view]
        return (
          <img
            key={pkg.id}
            src={src}
            alt=""
            aria-hidden="true"
            width={2000}
            height={1493}
            // First-paint priority for the bestseller front-view image; everything else lazy
            loading={view === 'front' && pkg.bestseller ? 'eager' : 'lazy'}
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500 motion-reduce:transition-none ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-apple)' }}
          />
        )
      })}

      <ViewToggle view={view} onChange={onViewChange} />

      {/* Caption — names what the user is looking at */}
      <div className="absolute bottom-3 left-4 pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-noir-faint leading-none">
          {activePackage ? 'Pakiet' : 'Bez folii'}
        </p>
        <p className="font-impact italic font-black uppercase text-[1.1rem] leading-tight text-noir-bright mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {activePackage ? activePackage.name : 'Mercedes G-Class'}
        </p>
      </div>
    </div>
  )
}

function ViewToggle({ view, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Widok auta"
      className="absolute top-3 right-3 inline-flex p-1 rounded-full bg-noir-deep/85 backdrop-blur-md border border-hairline-hi"
    >
      {PPF_VIEWS.map((v) => {
        const active = view === v.id
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v.id)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-display font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
              active
                ? 'bg-accent text-noir-deep'
                : 'text-noir-muted hover:text-noir-bright'
            }`}
          >
            {v.label}
          </button>
        )
      })}
    </div>
  )
}
