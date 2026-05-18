# Build State — Cars Detailing Radom v2

> Last updated: 2026-05-18 late night (Home Kontakt expanded + /api/lead + DoorToDoor section + conditional address field + dropdown/slash chips + hero magic CTA + copy refresh — full home + cennik now feature-complete UI/UX, awaiting Vercel link + Meeting #2 inputs)

## Resume from (TOP — read first)

**Stage:** ✅ **HOME + CENNIK FEATURE-COMPLETE.** Home flow: Hero (with magic-shimmer "Szczegółowa wycena · 15 min" CTA — mobile 2nd, desktop 3rd) → TrustStrip → About → Services → **DoorToDoor** (new dedicated section, animated 3-step route) → Realizacje → **Kontakt** (rewritten: dropdown service-interest + slash-separated timing chips + Samochód + email, wires to `/api/lead`). Cennik subpage: 8-category / 39-row interactive checklist, sticky-bar running total, "Szczegółowa wycena · 15 minut" modal with 10-slot photo grid + conditional pickup-address field (revealed when door-to-door selected) → `/api/wycena` Vercel serverless → Resend (owner notification with photo attachments + Google Maps link for address + optional customer confirmation). LocalStorage persists selection. Deep-link support: `/cennik#<category-slug>` scrolls, `/cennik#wycena` auto-opens the modal. Mobilny serwis removed from offering. **Build clean** (313 kB / 94 kB gzip JS, 50 kB / 9.3 kB gzip CSS). Lint: 5 setState-in-effect false positives, all matching pre-existing codebase pattern. **Vercel project still not linked** — first deploy needs `vercel.com/new` → import `OskarBal/cars-detailing-radom`, set root to `site-v2`, add the four env vars from `.env.example` (`RESEND_API_KEY`, `WYCENA_TO_EMAIL`, `WYCENA_FROM_EMAIL`, optional `WYCENA_REPLY_TO` — used by BOTH `/api/wycena` and `/api/lead`).

**Next session = deploy + smoke test.**
1. Link Vercel project (dashboard import — repo: `OskarBal/cars-detailing-radom`, framework: Vite, root: `site-v2`)
2. Set env vars in Vercel: `RESEND_API_KEY`, `WYCENA_TO_EMAIL` (Oskar's address until Tomasz's confirmed at Meeting #2), `WYCENA_FROM_EMAIL` (must be a verified Resend sender — **NEVER** `onboarding@resend.dev`), optional `WYCENA_REPLY_TO`
3. Test the live form to Oskar's inbox (never test-fire into Tomasz's inbox per `feedback_no_test_emails_to_client_inbox.md`)
4. Wire home page Kontakt section to the same `/api/wycena` endpoint (or a sibling `/api/lead`) — currently still a `setTimeout` placeholder
5. Optional polish: add photo upload (Supabase Storage signed URLs) once Tomasz confirms scope at Meeting #2

**Boot sequence next session:**
1. Read this file
2. Read `DESIGN_BRIEF.md`
3. `npm run dev` (port 5180) — verify `/cennik` end-to-end locally
4. Vercel dashboard import

**Open inputs (still blocked on Meeting #2):**
- Owner business email (form recipient — `WYCENA_TO_EMAIL`)
- Verified Resend sender domain for `WYCENA_FROM_EMAIL` (carsdetailingradom.pl DNS once they own it, otherwise Bal Agency's verified sender)
- Studio opening hours (currently "9–19, 7 dni" placeholder in WycenaForm success copy)
- Tier 2 automations y/n (auto-replies — customer confirmation email is already on; can be toggled by clearing customer-email field handling)
- Approved Realizacje photos (TikTok-only for now)
- B2B y/n (affects KSeF copy on cennik)

## Session log

**2026-05-18 (late night, +6) — Kontakt form polish (Samochód + dropdown + slash chips), hero magic CTA, copy unification:**
- Status: Final polish pass on the home page wraps the session. Kontakt form gets a Samochód field + native dropdown for service interest + square-box timing chips with `/` separators (fitting one line on mobile). Hero gets a `cta-magic` shimmer/glow button for "Szczegółowa wycena · 15 min" (mobile = full-width 2nd row, desktop = 3rd CTA). All `Wycena · 15 minut` labels swapped to `Szczegółowa wycena · 15 minut/min` for consistency. Build clean (313 kB / 94 kB gzip JS, 50 kB / 9.3 kB gzip CSS).
- Shipped (chronologically across the late-evening pass):
  - **Kontakt — Samochód field**: optional input next to Email, `placeholder="np. Audi RS6 2022"`, `autoComplete="off"`. `MAX_CAR = 120` on `/api/lead`. Owner email now shows an "Auto" row between Email and Interesuje go.
  - **Kontakt — interest control switched from chips → native `<select>`**: `appearance-none` + custom chevron-down icon, `Wybierz usługę…` placeholder option. Dark-themed dropdown panel courtesy of new global `color-scheme: dark` rule in `index.css`.
  - **Kontakt — timing control switched to square boxes + `/` separators**: `rounded-sm` (not full), `/` glyphs between via `Fragment` map. Re-tuned to fit one mobile line: `flex-nowrap`, `justify-between sm:justify-start`, `shrink-0` on each child, `text-[10px]` mobile → `text-[12.5px]` sm+, `tracking-[0.04em]` mobile → `tracking-wider` sm+, `px-2 py-1.5` mobile → `px-4 py-2` sm+, slashes `text-xs` mobile → `text-base` sm+.
  - **Global `color-scheme: dark`** added to `html, body` in `index.css` — fixes native `<select>` menu rendering across OS and as a side benefit also handles dark scrollbars + datepickers consistently going forward.
  - **Copy refresh**: 4 occurrences of `Wycena · 15 min(ut)` swapped to `Szczegółowa wycena · 15 min(ut)` (Cennik hero CTA + sticky-bar + final-CTA eyebrow + WycenaForm modal eyebrow). Heads-up: the modal H2 still reads `Szczegółowa wycena` directly under the new eyebrow — minor duplication worth tightening on next pass.
  - **Hero — 3rd CTA on desktop**: ghost-styled "Szczegółowa wycena · 15 min" → `/cennik` added after "Nasze realizacje". Wraps gracefully via existing `flex flex-wrap`.
  - **Hero — 2nd CTA on mobile (replaces Umów wizytę)**: same "Szczegółowa wycena · 15 min" → `/cennik`. Originally tried `flex-1 half-row + whitespace-nowrap` but the 28-char label overflowed at 360px; switched the whole MobileCTAs row to `w-full` stacked layout — Zadzwoń teraz on row 1 (filled), Szczegółowa wycena on row 2 (magic ghost), gap-2.5 between.
  - **Magic-CTA class `.cta-magic`** added to `index.css`. Two layered keyframes:
    1. `cta-magic-glow` (3.2s, ease-in-out, infinite): 2-layer box-shadow breathes between subtle (40% accent border-glow) and bold (80% accent-hi + 32px aura). Reads as a "breathing" red halo around the button.
    2. `cta-magic-shine` (4s, ease-in-out, infinite): a 100° diagonal gradient (accent → white-highlight → accent at three stops) translates from `-110%` to `120%` across the button via a `::before` at `z-index: -1`. `overflow: hidden` + `isolation: isolate` keeps it inside the button bounds, behind the text. The transparent ghost background lets the sweep bleed through visually.
    3. Hover: both durations drop to 1.6s — "I noticed you" speed-up.
    4. `prefers-reduced-motion: reduce`: both animations killed, button falls back to plain ghost.
  - **Hero CTA href**: locked to `/cennik` (not `/cennik#wycena`) per owner steer — user lands on the configurator first, opens the modal themselves from any of the in-page CTAs.
- Decisions locked (this pass):
  - **Dropdown over chips for service interest**: 7 options is the threshold where chips start to feel crowded. Native `<select>` is keyboard-perfect, accessibility-correct, and free.
  - **Square boxes + `/` for timing**: 3 options, mutually exclusive, fits "X / Y / Z" mental model. The `/` glyph treatment was the user's explicit preference.
  - **Magic ghost over magic filled**: the button stays ghost-styled so it doesn't visually outrank the primary `Zobacz usługi`. The breathing halo + shine sweep is what makes it special, not a different fill.
  - **Mobile CTA stack vertical**: long "Szczegółowa wycena · 15 min" label doesn't fit at half-row width. Stacking gives the magic button its own row and lets the halo breathe upward toward the primary CTA.
- Files touched (across the late-evening pass):
  - `src/sections/Kontakt.jsx` (Samochód field + InterestSelect dropdown + TimingPicker slash boxes + one-line mobile fit)
  - `src/sections/Hero.jsx` (3rd desktop CTA + mobile stack vertical + cta-magic class)
  - `src/components/WycenaForm.jsx` (eyebrow copy)
  - `src/pages/Cennik.jsx` (3× eyebrow/CTA copy)
  - `src/index.css` (color-scheme: dark + .cta-magic keyframes)
  - `api/lead.js` (MAX_CAR + carModel in payload + Auto row in email)
  - `BUILD_STATE.md` (this entry + top header refresh + Resume from)
- Open questions:
  - **WycenaForm modal title duplication**: eyebrow now reads `Szczegółowa wycena · 15 minut` directly above H2 `Szczegółowa wycena`. Either drop the H2 to something like `Twoje dane` or rephrase the eyebrow. Cosmetic, can ship as-is.
  - **DoorToDoor section caption**: "Radom & okolice · Wycena indywidualna" — replace "okolice" with the actual km radius once Tomasz confirms it at Meeting #2.
  - **WOW-animation suggestions delivered** for future rounds (paint-sheen sweep on hero photo, before/after drag sliders in Realizacje, magnetic-pull on key buttons). Not implemented — awaiting user pick.
- Resume from:
  1. **First Vercel deploy** of v2 — `vercel.com/new` → `OskarBal/cars-detailing-radom`, root `site-v2`. Set env vars (same set used by both `/api/wycena` and `/api/lead`):
     - `RESEND_API_KEY` = `re_…` (from Resend dashboard)
     - `WYCENA_TO_EMAIL` = Oskar's address (until Tomasz's locked at Meeting #2)
     - `WYCENA_FROM_EMAIL` = verified Resend sender (NEVER `onboarding@resend.dev`)
     - `WYCENA_REPLY_TO` = optional, defaults to WYCENA_TO_EMAIL
  2. Smoke test from preview URL: submit the home `/kontakt` form (lead) + submit the `/cennik` wycena form with 3-4 photos + door-to-door selected (verify attachments + Google Maps address link both work). Both should land in Oskar's inbox.
  3. Optional polish queued: WOW animation pick (paint-sheen / before-after / magnetic pull), modal-title duplication tweak, DoorToDoor radius caption.
  4. If everything passes smoke test, point the production domain at the new project; archive `cars-detailing-radom-legacy` on prod.

---

**2026-05-18 (night, +5) — Home Kontakt form expanded + wired to /api/lead:**
- Status: Home `/` Kontakt section is no longer a `setTimeout` placeholder. New fields (email + service-interest chips + timeline chips) feed a sibling `/api/lead` Resend endpoint. Real send. Same env vars as `/api/wycena`. Tomasz now gets qualified inbox leads from the home page instead of just blind "Imię + Telefon" submissions.
- Shipped:
  - **`api/lead.js` (NEW)** — sibling to `/api/wycena`. Minimal handler (~110 lines): POST-only, reuses `RESEND_API_KEY` + `WYCENA_TO_EMAIL` + `WYCENA_FROM_EMAIL` + `WYCENA_REPLY_TO`, sanitizes string lengths, never-`onboarding@resend.dev` guard. No photos, no address, no selectedIds — semantically distinct from the wycena flow. Email subject: `Lead · <name> · <interest>`. Email body uses the same dark-noir HTML style as the wycena owner email but with a smaller table — accent-red "Interesuje go" row when present.
  - **`src/sections/Kontakt.jsx` (rewritten)** — kept the 2-col layout (left: brand + phone + studio address; right: form). Form expanded:
    - **Imię + Telefon** — required, 2-col paired (unchanged behaviour)
    - **E-mail** — optional, full-width input
    - **Czego potrzebujesz?** — chip group, single-select, 7 options (Powłoki ceramiczne / PPF / Korekta lakieru / Detailing wnętrza / Pranie tapicerki / Door-to-door / Inne)
    - **Kiedy planujesz?** — chip group, single-select, 3 options (W tym tygodniu / W ciągu 2 tygodni / Elastycznie)
    - **Wiadomość** — optional textarea, 3 rows
  - **Real submit** — POSTs to `/api/lead`, sends both label strings (not ids) for owner readability. Status states `idle | sending | sent | error` with matching button copy. Success state swaps the form for a card with "Dzięki, odebraliśmy" headline + "Oddzwonimy w ciągu 15 min" + "Nowe zgłoszenie" reset button (so re-submission is one click).
  - **Chip behaviour** — re-clicking the active chip deselects it (toggle), so users can change their mind without keyboard. `aria-checked` on each chip + `role=radiogroup` on the wrapper.
- Decisions locked:
  - **Two endpoints, not one**: `/api/lead` over reusing `/api/wycena`. The two flows have fundamentally different shapes (lead has no services array, no photos, no address; wycena has all three). Reusing would have meant a switch-on-payload inside one handler — uglier than two ~100-line files. Both share env vars and Resend setup.
  - **Chips over a dropdown**: chips show all options at once, scan-friendly, no second-tap cost. The set is small enough (≤7 items) to fit on 2 visual rows.
  - **No photo upload on home Kontakt**: home form stays low-friction. Photos belong to the structured wycena flow.
  - **No car-make/model field on home Kontakt**: Tomasz asks on the callback. Keeping the form perceived length tight matters more than upfront detail.
- Files touched: `api/lead.js` (NEW), `src/sections/Kontakt.jsx` (rewrite), `BUILD_STATE.md`.
- Open questions:
  - Auto-reply email to the customer? Currently only the owner gets an email. Easy to add (same pattern as `/api/wycena` customer-confirmation) when Tomasz confirms scope at Meeting #2.

---

**2026-05-18 (night, +4) — Conditional pickup-address field on the wycena form:**
- Status: Wycena form now reveals a required "Adres odbioru" field when the `door-to-door` service is in the selection. Otherwise the form stays as before (no address asked). Both client + server enforce. Owner email surfaces the address in its own red-labelled row with a Google Maps deep-link.
- Shipped:
  - **`src/components/WycenaForm.jsx`** — added `address: ''` to form state + reset object; computed `hasDoorToDoor = selectedIds.includes('door-to-door')`; added client-side validation guard (`'Podaj adres odbioru — przy door-to-door musimy wiedzieć, dokąd przyjechać.'`); conditional block renders a 2-row textarea inside an accent-tinted card (small pin glyph + "Door-to-door · adres odbioru" eyebrow) — only when door-to-door is selected. `autoComplete="street-address"`. Slots in between Marka/Email row and the Opis textarea so it reads as "this is where we pick up your car" before any free-form description.
  - **`api/wycena.js`** — `MAX_ADDRESS = 240` + payload `address` field; server validates: if `selectedIds.includes('door-to-door')` and address blank → 400 with `'Przy usłudze door-to-door adres odbioru jest wymagany.'` (defense against curl bypass of the client-side check). Owner email HTML now renders an "Adres odbioru" row (accent-red uppercase label) that's a clickable Google Maps deep-link (`https://www.google.com/maps/search/?api=1&query=<encoded>`). Tomasz can tap and navigate from his phone.
- Decisions locked:
  - **Conditional reveal, not always-visible**: keeps the standard form lean for the 90% of submissions that are studio-served. Surface the field only when there's a reason to ask, signal value (red tint = "this matters").
  - **Textarea (2 rows) over single input**: PL addresses span 2 lines (`ul. + numer` / `kod + miasto`), and clients may add doorman / gate / klatka instructions. Free-form serves better than 4 separate fields.
  - **Google Maps deep-link in owner email**: zero-friction navigation from inbox to driving directions. Encoded query is universally accepted across iOS/Android Maps.
- Files touched: `src/components/WycenaForm.jsx`, `api/wycena.js`, `BUILD_STATE.md`.

---

**2026-05-18 (night, +3) — Door-to-door spotlight section between Usługi and Realizacje:**
- Status: New `src/sections/DoorToDoor.jsx` shipped — compact noir-deep section dedicated to the door-to-door valet proposition. Sits in the home flow between Services (noir-surface) and Realizacje (noir-deep). Build clean (306 kB / 93 kB gzip JS, 48 kB / 8.8 kB gzip CSS, 142 ms).
- Shipped:
  - **`src/sections/DoorToDoor.jsx` (NEW)** — section structure: eyebrow `Door-to-door` → H2 `Zostań w domu. My przyjedziemy.` → 1-line subtitle. Below that, a 3-node horizontal route flow (`grid-cols-1 md:grid-cols-3`):
    - 01 Zgłoszenie (PhoneIcon) — "Telefon lub formularz. Ustalamy datę i adres odbioru."
    - 02 Odbiór (KeyIcon) — "Przyjeżdżamy spod Twojego adresu w Radomiu o ustalonej godzinie."
    - 03 Powrót (CheckCircle SparkleIcon) — "Odwozimy auto pod drzwi, gotowe do jazdy."
    Each node = 88×88 noir-surface circle with accent border + icon + accent-red 01/02/03 badge in the top-right corner. Mobile = stacked vertical with horizontal node + text rows; desktop = centered columns.
  - **Animation:** IntersectionObserver-gated (`threshold: 0.25`, once-only — disconnect after firing). On enter:
    - Cards fade-up sequentially (Apple-ease `cubic-bezier(0.32, 0.72, 0, 1)`, 700 ms duration, 180 ms stagger, 280 ms initial delay)
    - SVG dotted line connecting the 3 nodes draws in via `stroke-dashoffset 400 → 0` over 1400 ms
    - A 8 px accent-red dot with a soft red+white glow pulse-travels along the line continuously (`d2d-travel` keyframe in `index.css`, 3.6 s linear infinite loop, opacity fade at start/end of each pass so the dot disappears off the edges instead of teleporting back)
    - Connector + travelling dot are **desktop-only** (`hidden md:block`) — keeps mobile clean and avoids the dot stranded between vertical cards
  - **`prefers-reduced-motion: reduce` respected**: short-circuits IntersectionObserver and sets `inView=true` immediately (full static state); `.d2d-dot` rule in CSS sets `animation: none; opacity: 0` so the pulsing dot disappears.
  - **CTA**: `Zamów odbiór` button (accent) → `/cennik#wycena` (auto-opens the wycena form modal). Caption next to it: "Radom & okolice · Wycena indywidualna".
  - **`src/index.css`** — added `@keyframes d2d-travel` + `.d2d-dot` rule + `prefers-reduced-motion` override.
  - **`src/pages/Home.jsx`** — `DoorToDoor` imported and inserted between `Services` and `Realizacje`.
- Decisions locked:
  - **Position**: between Usługi and Realizacje. Pitches the differentiator immediately after the catalog tease (right when the user is wondering "but how do I actually book this without driving 5 km out of town").
  - **Compact paddings**: `py-16 md:py-24` instead of the standard `py-20 md:py-32` — deliberate contrast vs Services + Kontakt so the section reads as a focused punch, not another large block.
  - **No price** in the section copy — door-to-door is `quoteOnRequest`. CTA is "Zamów odbiór" (action) not "Zobacz cenę".
  - **Icons**: phone → key (handover metaphor) → check-in-circle (job done). Avoided car icons because the cards stack on mobile and 3× car icons would feel repetitive.
  - **Surface**: noir-deep matches Realizacje below it for a seamless transition. Top hairline border separates from Services (noir-surface).
- Files touched: `src/sections/DoorToDoor.jsx` (NEW), `src/index.css` (keyframe), `src/pages/Home.jsx` (composition), `BUILD_STATE.md`.
- Open questions:
  - Geo-radius copy: "Radom & okolice" is vague — Tomasz will want to nail an actual km radius (`do 30 km od Godowa`?) at Meeting #2. Update once the answer lands.
  - Section could host a small inline KM/strefa map later if Tomasz wants the geo claim visualized — currently just text caption.

---

**2026-05-18 (night, +2) — Mobilny serwis cut from offering:**
- Status: Owner steer — "Mobilny serwis u klienta" (on-site mobile detailing at client location) removed from both the home Services ledger and the cennik catalog. Door-to-door valet stays. Build clean (301 → 301 kB / 92 kB gzip JS, no measurable delta).
- Shipped:
  - `src/sections/Services.jsx` — row 08 "Mobilny serwis" removed (was the last entry). Home ledger now 7 rows (01–07).
  - `src/lib/catalog.js` — logistyka category renamed `Logistyka i serwis mobilny` → `Door-to-door`, lede shortened to drop the "przyjeżdżamy z całym warsztatem na miejsce" half, `mobilny` service entry deleted. Now 1 service in the category. `TOTAL_SERVICES_COUNT` auto-decrements (39).
  - `src/pages/Cennik.jsx` — `isLogistics` grid made adaptive: `grid-cols-1 md:grid-cols-2` when 2+ services, else `grid-cols-1 max-w-2xl` so the single door-to-door card doesn't sit awkwardly at half-width.
- Decisions locked:
  - **Category kept, not merged**: door-to-door stays in its own `logistyka`-slug category because (a) the home page Services rows deep-link there, and (b) it's conceptually different from a service line — it's a delivery mode. Renaming the category to "Door-to-door" makes the slug feel mis-named but breaking the slug would break the home `/cennik#logistyka` anchor; leaving it.
- Files touched: `src/sections/Services.jsx`, `src/lib/catalog.js`, `src/pages/Cennik.jsx`, `BUILD_STATE.md`
- Open questions:
  - If mobilny ever comes back as a separate offering, the catalog entry + adaptive grid both restore cleanly.
  - Hero header still computes from `TOTAL_SERVICES_COUNT` — auto-updates to "39 usług w 8 kategoriach".

---

**2026-05-18 (night, +1) — Photo grid + Resend attachments wired into Wycena form:**
- Status: 10-slot photo upload grid is live on `/cennik` wycena modal. Photos compress client-side via canvas (≤1400 px / JPEG 0.78 — typical 150–300 KB each), travel as base64 in the POST body, and arrive as native Resend attachments on the owner email. Build clean (301 kB / 92 kB gzip JS, 47 kB / 8.5 kB gzip CSS, 138 ms). Lint unchanged (same 4 react-doctor false positives).
- Shipped:
  - **`src/components/WycenaForm.jsx`** — added `PhotoGrid` + `PhotoSlot` + `compressImage`. State: `photos[]` of `{id, name, dataUrl, status, sizeKB, error?}` + `photoErr` top-level message. `PHOTO_LIMITS` constants: max 10, max 12 MB raw per file, 1400 px max edge, 0.78 quality. HEIC/HEIF rejected (Polish hint). MIME whitelist: jpeg, png, webp. Slot states: empty-active (clickable + plus icon + DODAJ), empty-passive (diagonal stripe), processing (spinner + filename), filled (thumbnail + index badge + remove X), error (red border + msg). Drag-drop highlights the whole section. Per-photo + total size meter shown next to the count. Submit serializes only `status === 'ok'` photos. Success screen now says "Odebraliśmy też N zdjęć." when applicable.
  - **`api/wycena.js`** — `export const config = { api: { bodyParser: { sizeLimit: '6mb' } } }` so the body limit clears Vercel's default. Added `parseDataUrl()` + `buildAttachments()` helpers: whitelist `image/jpeg|png|webp`, server-side per-photo cap at 1.5 MB decoded, safe-filename sanitizer (`a-zA-Z0-9._-` + `.<ext>`). Sends through Resend SDK as `attachments: [{ filename, content }]` — Resend ^3 accepts base64 strings for `content`. Email subject gets a `· N📎` tag when photos are attached. Owner email body adds a 📎 footer line stating the attachment count. Response payload includes `photosAttached`.
- Decisions locked (this round):
  - **Attachments over inline data URLs** — cleaner inbox preview, no HTML-image quirks, no oversized email bodies. Resend supports up to 40 MB total request; we cap at 10 × 1.5 MB decoded server-side anyway.
  - **1400 px / Q 0.78** vs legacy's 1600 / 0.82 — squeezed to fit Vercel's body limit while keeping enough detail for damage assessment (paint swirls, dents) on a phone screen.
  - **HEIC handling**: reject + tell user to export as JPG. Auto-conversion via `heic2any` would add ~50 kB to the bundle and another async dependency for a niche case (iOS default format). Defer if iPhone owners actually complain.
  - **Per-photo size caps stack**: client (12 MB raw before compress) → compress to ~250 KB → server checks 1.5 MB decoded. Belt-and-braces against a curl-bypass attack.
- Files touched:
  - `src/components/WycenaForm.jsx` (PhotoGrid + compressImage + photo state in main form)
  - `api/wycena.js` (bodyParser config + parseDataUrl/buildAttachments + attachments in send + subject tag + body footer)
  - `DESIGN_BRIEF.md` (Backend section — photo upload moved from deferred → live)
  - `BUILD_STATE.md` (this entry + top header tweak)
- Open questions:
  - **Vercel body-size limit override** — `bodyParser.sizeLimit` is the legacy Vercel/Next.js API config knob. Newer Vercel functions runtime ignores it and just streams the body. Watch for 413s on the first prod test; if they hit, switch to a streaming reader or use a Vercel `vercel.json` `functions` block.
  - **iOS Safari camera capture** — current `<input type=file accept="image/*">` triggers the photo picker, not a direct camera. If Tomasz's clients want one-tap "take a photo" UX, add `capture="environment"` (but it blocks gallery picks — a tradeoff).
- Resume from: Same as the previous entry — Vercel project link + env vars + smoke test. The smoke test should now include attaching 3-4 photos to confirm the attachments arrive in the inbox.

---

**2026-05-18 (night) — Cennik configurator + Wycena 15 min form + /api/wycena Resend shipped (local only):**
- Status: `/cennik` no longer a placeholder. Full 8-category / 41-service interactive configurator, Wycena modal wired to Resend serverless function, home Services rows deep-link to per-category anchors. Not yet deployed (Vercel project still unlinked).
- Shipped:
  - **`src/lib/catalog.js` (NEW)** — single source of truth for the 41-service catalog. 8 `CATEGORIES`, each with `slug` (matches the URL hash), `lede`, and `services[]`. Helper `formatZl()` (Polish-locale `1 600 zł`), `SERVICE_BY_ID` map for O(1) lookups in the form, `TOTAL_SERVICES_COUNT` + `CATEGORY_COUNT`. "Wycena indywidualna" rows carry `quoteOnRequest: true` and are excluded from the running total but counted in the selection. Anchor services (`anchor: true`) get a "Bestseller" / "Najlepiej sprzedające się" badge. Two special category shapes: `isPackages: true` (interior packages — card grid w/ bullet `includes`) and `isLogistics: true` (door-to-door + mobilny serwis — 2-col card grid, body copy explains the model). Logistics services have no fixed price.
  - **`src/pages/Cennik.jsx` (FULL REWRITE)** — replaces the "wkrótce" placeholder. Composed of:
    - `CennikHero` — noir hero, eyebrow `Cennik · 41 usług w 8 kategoriach`, H1 `Każda usługa, jasna cena.`, lede + primary CTA `Wycena · 15 minut`, live selection summary chip when count > 0
    - `CategoryNav` — sticky horizontal jump-nav at `top-16` w/ rounded-pill anchors; mobile-scrollable (no-scrollbar)
    - `CategorySection` — per-category section with `id="cat-<slug>"` + `scroll-mt-32` (clears the sticky navbar + catnav stack), heading + lede, then either:
      - Standard rows (default) — `ol > li` with a `<button role=checkbox>` that toggles selection. Each row: CheckBox + service name (+ optional Bestseller pill) + price ("od X zł" or "wycena indyw.")
      - `isPackages` — 3-column card grid (collapses on mobile); each card shows package name + price + bulleted `includes[]`
      - `isLogistics` — 2-column card grid; each card shows service name + "wycena indywidualna" + body explanation
    - `StickyBar` — fixed bottom bar visible only when selection > 0; shows count + running total ("od X zł +" when any `quoteOnRequest` is selected) + clear + Wycena CTA
    - `FinalCta` — full-width CTA section at page end, copy adapts to whether anything is selected
  - **`src/components/WycenaForm.jsx` (NEW)** — modal dialog component. Backdrop button + sheet (slide-up on mobile via `items-end`, centered on md+). Sticky header w/ "Wycena · 15 minut" eyebrow + H2 + close button. Body: `SelectionSummary` card (lists selected services with prices, total, "+" suffix when quote-on-request items mixed in) → 2-col Imię/Telefon → 2-col Email/Marka+model+rok → Krótki opis textarea → Submit (`Wyślij · 15 min`) + 15-min copy → RODO 11px. Submit state machine: `idle | sending | sent | error`. Success state replaces the form: green checkmark + thanks + 15-min copy + close button. Escape-to-close + body scroll lock + first-field auto-focus.
  - **`api/wycena.js` (NEW)** — Vercel serverless function. Resend SDK ^3 (`{data, error}` not throws). Strict env-var check (`RESEND_API_KEY` / `WYCENA_TO_EMAIL` / `WYCENA_FROM_EMAIL`) + defensive `onboarding@resend.dev` guard. Builds two emails: (1) owner notification — dark-noir HTML, contact card + selected-services table with "od X zł" prices + "od TOTAL +" footer; (2) optional customer confirmation when their email was provided. Returns `{ ok, ownerEmailId, confirmationSent }`. Length-clamped string sanitization on every field. Customer-confirmation failure is logged but doesn't fail the request — owner gets the lead regardless.
  - **`src/sections/Services.jsx`** — 8 row hrefs swapped from `/cennik` → `/cennik#<category-slug>`. Services 01–05 + 06 (Pakiety) and 07/08 (Door-to-door / Mobilny) route to their matching catalog category (`#detailing-wnetrza` for both Pakiety and Detailing wnętrza rows; `#logistyka` for both door-to-door and mobilny). Replaced via python script because the original strings had non-breaking-space (U+00A0) bytes that defeated Edit's exact-match.
  - **`package.json`** — `resend@^3.5.0` added to deps. `npm install resend@^3` ran successfully (+70 packages, 0 vulnerabilities).
  - **`.env.example` (NEW)** — documents the four env vars + the never-use-sandbox guard + placeholder values pointing at Oskar's address until Meeting #2.
  - **`.gitignore`** — added `.env`, `.env.local`, `.env.*.local`, `.vercel` to prevent secret leaks.
  - **`eslint.config.js`** — added a second config object for `api/**` files giving them Node globals (cleans 4× `'process' is not defined` errors).
  - **`DESIGN_BRIEF.md`** — components table updated (Cennik no longer placeholder, WycenaForm + catalog.js + api/wycena.js added). Backend section rewritten — `/api/wycena` is now live, env-var list captured. Site map adds the category + `#wycena` anchors.
- Decisions locked (this round):
  - **Catalog data lives in `lib/catalog.js`** as a static JS module, not Markdown or JSON fetch — keeps build clean, no runtime fetch, easy to evolve when Tomasz tweaks prices.
  - **Single category id schema**: section element `id="cat-<slug>"`, but the deep-link hash is the bare slug (`/cennik#powloki-ochronne`). Cennik page's `useEffect` resolves either form. CategoryNav anchors use the full `cat-<slug>` form so the browser handles them natively.
  - **Quote-on-request handling**: selected `quoteOnRequest` services don't add to the price total but still count toward the selection count. UI shows "od X zł +" suffix when any are selected, so the customer understands the headline price is incomplete.
  - **Interior packages as cards, not rows** — packages have meaningful bullet content (`includes[]`); cramming that into a row would lose the "what's actually in this" clarity.
  - **Logistics as cards too** — door-to-door + mobilny serwis are conceptually different from a service line (no price, just a delivery mode). Card form makes that legible.
  - **localStorage persist** under `cdr.cennik.selection.v1` — survives reload but doesn't auto-restore between users. Filter on read drops any ids that no longer exist in the catalog.
  - **Form fields**: required = name + phone only. Email is optional but enables customer confirmation. Car model + note are optional. No checkbox for RODO — informational paragraph on submit, matches DESIGN_BRIEF spec.
  - **Modal pattern**: full-width bottom-sheet on mobile (`items-end` + no rounded top corners), centered card on `md:` and up (`md:items-center` + `md:rounded-2xl`). Sticky inner header for scrollable long lists. Escape-to-close. URL syncs to `/cennik#wycena` when open, `/cennik` when closed.
  - **Two emails per submit**: owner notification (required) + customer confirmation (only if email provided). Confirmation failure is logged but doesn't 502 the request — the lead is already with Tomasz.
- Files touched:
  - `src/lib/catalog.js` (NEW)
  - `src/components/WycenaForm.jsx` (NEW)
  - `src/pages/Cennik.jsx` (full rewrite)
  - `src/sections/Services.jsx` (hrefs)
  - `api/wycena.js` (NEW)
  - `package.json` (resend dep)
  - `package-lock.json` (auto)
  - `.env.example` (NEW)
  - `.gitignore` (env/.vercel)
  - `eslint.config.js` (api/ node globals block)
  - `DESIGN_BRIEF.md` (components + backend + site map)
  - `BUILD_STATE.md` (this entry)
- Verified locally:
  - `npm run build` clean — 294 kB JS / 90 kB gzip, 45 kB CSS / 8 kB gzip, 187ms build
  - `npm run lint` — 4 errors, all `react-hooks/set-state-in-effect` false positives. 3 pre-existing (Hero, Navbar, TrustStrip), 1 new in WycenaForm matches the same pattern. Per `feedback_react_doctor.md` these are known false positives — leaving them rather than refactoring around a flawed rule.
  - **Dev server not started this session** — per `feedback_visual_verification.md`, no auto-screenshot loop. Browser verification is Oskar's call.
- Open questions:
  - **Vercel project link** — repo `OskarBal/cars-detailing-radom`, root `site-v2`. Oskar imports via dashboard; Vercel detects Vite automatically. Env vars are the gate.
  - **Resend sender domain**: is `carsdetailingradom.pl` already owned + DNS-able, or do we send from Bal Agency's verified sender for now?
  - **Customer confirmation copy** — "9–19" hours hard-coded. Update once Tomasz confirms studio hours at Meeting #2.
  - **Home Kontakt section** still UI-only — reuse `/api/wycena` (form field shapes are close enough) or build a dedicated `/api/lead`?
  - **Photo upload** — defer to a v2 round of Cennik once Tomasz confirms scope. The legacy site had a 10-slot grid; the schema decision (Supabase Storage signed URLs vs. base64 inline) is captured in `BUILD_STATE.md` 2026-05-15 night entry of the legacy folder.
- Resume from: Open `https://vercel.com/new`, import `OskarBal/cars-detailing-radom`, set root to `site-v2`, add env vars from `.env.example` (real values), deploy. Then on the preview URL, run a smoke test: navigate `/cennik#powloki-ochronne`, select 2-3 services, click `Wycena · 15 min`, fill the form with Oskar's address as the recipient (`WYCENA_TO_EMAIL` should still point to Oskar's inbox at this stage), submit, verify both emails land. After that, decide whether to wire the home `Kontakt` form to the same endpoint or build a sibling `/api/lead`.

---

**2026-05-18 (evening) — Homepage feels v2-shaped: copy, TrustStrip, ledger, fixed drawer:**
- Status: Homepage framework locked except for hero photo (placeholder remains) and Cennik. Mobile drawer now production-grade.
- Shipped:
  - **Hero copy:** H1 → `TWOJE AUTO.` / `NASZA PASJA.`; eyebrow → `DETAILING & CAR CARE W RADOMIU I OKOLICACH`
  - **Hero subtitle mobile visibility fix** — 17px / font-medium / triple-layer text shadow (was washing out on bright bg areas)
  - **Hero feature panels — mobile carousel:** replaced 2×2 grid with horizontal-slide carousel. 2s auto-cycle (no pause on tap, pauses only during active drag), clone-and-snap seamless wrap, dot indicators + swipe + finger-following drag, viewport-clamped card height (`min-height: clamp(150px, 24svh, 230px)` — later tightened to text-hugging size), more glassmorphic (`bg-white/[0.045]` + `backdrop-blur-2xl backdrop-saturate-150`)
  - **Hero overflow fix:** added `grid-cols-1` (= `minmax(0, 1fr)`) + `min-w-0 w-full` chain on carousel containers — was stretching off-screen-right because the implicit grid column auto-grew to max-content
  - **Hero → TrustStrip gradient blend:** added bottom-fade overlay div at `-z-[5]` between BG image and content; 3-stop `linear-gradient(to bottom, transparent → 55% noir-deep → 100% noir-deep)` at `h-40 md:h-56`. Photo dissolves into noir-deep before the strip starts — no visible seam.
  - **About:** infinity-symbol `∞` in Cierpliwości stat replaced with `<InfinityGlyph />` SVG (Unicode U+221E falls back to system fonts because Barlow Condensed lacks the glyph — was rendering inconsistently across browsers). Top padding cut `py-20 md:py-32` → `pt-10 md:pt-16 pb-20 md:pb-32` (was too much air above "O nas" heading).
  - **NEW: TrustStrip section** between Hero and About. Whole strip is a `<a target="_blank">` to `https://www.tiktok.com/@carsdetailingradom`. 4×1 layout on every breakpoint. Stats: `5.0` Ocena Google + 5 stars · `+23.4K` Zasięg na TikToku (vivid green `#34E89E` + glow) · `91` Realizacji na video · `12+` Miesięcy w grze. Each stat has its own animation flavor (count-up + stars cascade · count-up + green bloom · count-up + blur-to-clear · count-up + back-eased "+" pop). IntersectionObserver-triggered, respects `prefers-reduced-motion`. Borders removed for seamless blend with surrounding noir-deep surfaces.
  - **Services — full redesign.** Killed the 6-tile icon+title+body grid (generic and forgettable). Replaced with **typography-led ledger / specimen sheet:** numbered rows (01–08), Barlow Condensed Italic Black titles with fluid `clamp()` sizing, body line, outlined `OD X ZŁ` chip + arrow, hairline dividers. Prices pulled from `../Cennik_Uslug.md`. Final order: `01 Powłoki ceramiczne` (1 600 zł) · `02 PPF` (4 500 zł) · `03 Korekta lakieru` (800 zł) · `04 Detailing wnętrza` (250 zł — added per user) · `05 Pranie tapicerki` (400 zł) · `06 Pakiety` (250 zł — **featured, all-red text + accent tint + outlined accent chip, body: "3 gotowe pakiety, największa wartość za cenę."**) · `07 Door-to-door` (Wycena indyw.) · `08 Mobilny serwis` (Wycena indyw.). All rows currently `<Link to="/cennik">` — per-service hash deep-links pending cennik port.
  - **Mobile Navbar drawer fixes** (this was the most impactful UX fix):
    - Header bumped `z-40` → `z-[60]`; drawer stays `z-50`. Logo + hamburger now remain visible when drawer is open (previously the drawer covered the whole header).
    - Header bg auto-darkens when drawer is open (was only `scrolled`-triggered).
    - **iOS Safari scroll lock fixed** — the prior `html.style.overflow = 'hidden'` is ignored by iOS Safari. Replaced with canonical pattern: save scrollY → `body.style.position = 'fixed'` + `body.style.top = '-Ypx'` → on close, restore body styles + `window.scrollTo(0, y)`.
    - Drawer hierarchy: nav links use `flex-1 justify-center`, footer block (hairline divider + CTA + tel: link) sits at bottom with `env(safe-area-inset-bottom)` padding. Drawer links upgraded to Barlow Condensed Italic Black to match site display voice.
- Decisions locked (full list in DESIGN_BRIEF.md):
  - Carousel-not-grid for mobile hero features. 2s auto-cycle. No pause on tap.
  - Services = typography-led ledger (specimen sheet). NOT card grid, NOT photo-led split-screen — chose this because it ships today with zero photo dependency on Tomasz.
  - Pakiety presented as single row with all-red treatment, not 3 separate rows (would have bloated the ledger). Body text explicitly names the 3 tiers ("podstawowy, kompleksowy, pod sprzedaż").
  - TrustStrip uses vivid green `#34E89E` for the TikTok stat — green is not on the noir blocklist (only warm yellow/gold/orange are blocked).
  - Cierpliwości stat uses SVG `<InfinityGlyph />`, never Unicode `∞`. Will reapply this rule for any other "decorative" symbols in display type.
- Files touched:
  - `src/sections/Hero.jsx` (copy + carousel + bottom-fade + subtitle + grid-cols-1)
  - `src/sections/About.jsx` (InfinityGlyph + padding)
  - `src/sections/TrustStrip.jsx` (NEW)
  - `src/sections/Services.jsx` (full rewrite as ledger)
  - `src/components/Navbar.jsx` (drawer fixes, z-index restructure, iOS scroll lock)
  - `src/pages/Home.jsx` (added TrustStrip to composition)
  - `src/index.css` (added then removed pakiety-pulse keyframes — featured row ended up using static red text not animation)
  - `DESIGN_BRIEF.md` (Hero copy lock, Services description updated)
- Open questions:
  - `/cennik#powloki-ochronne`-style anchors don't exist yet → next session adds them as part of cennik port
  - `04 Detailing wnętrza @ 250 zł` and `06 Pakiety @ 250 zł` describe the same Pakiet podstawowy → user explicitly said keep both for now; revisit if customer feedback flags confusion
  - Hero CTA `Umów wizytę` and drawer CTA `Umów wizytę` both target `/cennik#wycena` — this anchor needs to exist on the cennik page
- Resume from: Start Cennik port. Read `../Cennik_Uslug.md` + skim legacy `../cennik/index.html` + `../cennik.js`. Build `pages/Cennik.jsx` with 8-category checklist + running total + "Wycena w 15 minut" promise + contact form → `/api/wycena` (Resend). Wire per-row anchors so home Services rows deep-link correctly.

---

**2026-05-18 (afternoon) — Initial scaffold + first push to clean repo:**
- Status: Old repo `OskarBal/cars-detailing-radom` renamed → `cars-detailing-radom-legacy`. New repo `OskarBal/cars-detailing-radom` initialized with this scaffold.
- Shipped:
  - Vite 7 + React 19 + Tailwind v4 (`@tailwindcss/vite`, CSS-first `@theme`) + React Router v6
  - Fonts: Plus Jakarta Sans + Barlow Condensed Italic Black + JetBrains Mono (all Google Fonts)
  - 5 home sections: Hero, About, Services, Realizacje, Kontakt
  - `/cennik` placeholder, `/404` page
  - Layout shell: Navbar (scroll-aware + mobile hamburger drawer with backdrop-blur) + Footer (3-col + © strip)
  - `lib/nav.js` — single source of truth for NAV_ITEMS + BRAND constants
  - `DESIGN_BRIEF.md` — palette + type + sections + "we do NOT do" blocklist
  - `README.md`
  - Dev server: port 5180, `strictPort: true`, `host: true`
  - Build clean: 81.97 kB gzip JS, 6.30 kB gzip CSS, 135ms build
  - Initial commit `3cc48d3`, port lock commit `76ec63b`, pushed to `origin/main`
- Decisions locked (full list in DESIGN_BRIEF.md):
  - Vite + React + JSX (no TS) — Balagency default
  - Tailwind v4 with `@theme` config (no `tailwind.config.js` needed)
  - Routing: single scroll page (`/`) + `/cennik` subroute + `/404`
  - Mobile nav: hamburger → full-screen blurred drawer, body scroll lock, Escape close
  - **Viewport-aware Hero CTAs**: desktop = browse (Zobacz usługi / Nasze realizacje), mobile = action (Zadzwoń teraz / Umów wizytę)
  - Realizacje: 4 lazy-hydrated TikTok phone-frame iframes (IDs `7592202369799228674`, `7571531853555993879`, `7554467947104898306`, `7623393886597156128`)
  - Palette: noir blacks + accent `#B82119` (deep crimson — logo red, deepened per user steer)
  - Typography: Barlow Condensed Italic Black for impact (Saira Condensed rejected — Google Fonts ships no italic for it)
  - No `Opinie` section in v1 (defer until real reviews aggregated)
  - Dev port 5180 (CRM owns 5173)
- Files touched: 25 files in initial commit (all new); +1 in port-lock commit
- Open questions:
  - Vercel project link — user imports via dashboard (`vercel.com/new` → `OskarBal/cars-detailing-radom`)
  - Cennik configurator port — half-day of focused work, ports from `legacy/cennik/index.html` + `cennik.js` + `Cennik_Uslug.md`
  - Form backend wire-up — Resend API key reuse from CRM env, or per-client key?
- Resume from: `npm run dev` from `site-v2/`. Open `localhost:5180`. Decide: Vercel import OR Cennik port OR section polish round.
