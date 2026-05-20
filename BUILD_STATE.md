# Build State — Cars Detailing Radom v2

> Last updated: 2026-05-21 (early) — **`Ekonomia ochrony` rebuilt as a personalized PPF ROI engine + lead conversion machine.** Old ValueCalculator was a 1-slider decoration (car value → "PPF is 1.8% of car value") with no CTA. New version: 4 inputs (pakiet tabs × 4, wartość auta slider, roczny przebieg slider, trasa dominująca miasto/mieszane/autostrada, planowany okres posiadania slider) → 4 live outputs (hero `zł/dzień` in 5.5rem Barlow Black Italic + próg opłacalności using 2200 zł avg PL repair-cost anchor + wartość rezydualna `+3–5%` + pierwszy odprysk months estimate adjusted by trasa+km). Below: 2-column comparator card — left side animates 5-year "Bez folii" damage roll-up (IntersectionObserver-triggered, 180ms row stagger), right side shows flat PPF-amortized counter. Bottom CTA opens existing WycenaForm pre-filled with all 4 calculator inputs via new `prefillNote` prop + new `openFormWithNote(note, pkgId)` callback in PPF.jsx — Tomasz inbox lands with full car profile attached to the lead. Zero new endpoints, deps, or assets. Build 355.61 kB / 104.05 kB gzip JS (+11 kB delta), CSS 62.32 kB / 11.31 kB gzip (+3 kB for stagger keyframes). Files: `src/components/ppf/ValueCalculator.jsx` (full rewrite, ~415 lines), `src/components/WycenaForm.jsx` (added prefillNote prop + open-cycle sync effect), `src/pages/PPF.jsx` (added formPrefillNote state + openFormWithNote callback), `src/index.css` (vc-hero-pulse + vc-compare-row keyframes, prefers-reduced-motion respected). Resale `+3–5%` stays uncited per no-hallucinated-context rule. Still not pushed to prod. Prior `2026-05-20 very late night` entry preserved below.

> Earlier 2026-05-20 very late night state (preserved): **Three v2.3-era polish passes shipped on top of v2.2 + a CarCanvas refactor.** (1) **Glass-fix** — composited base's dark glass back over `cale-auto/{front,rear}` + `pakiet-front/front` to kill the "vertically stretched" perception caused by the model painting windows crimson. (2) **Wheel-bleed fix** on `cale-auto/rear` — Python-built mask of "dark-in-base AND red-dominant-in-cale" constrained to y=940–1380 restored the rear-right tire + bonus rocker trim line. (3) **Brake light highlight** on `pakiet-reflektory/rear` — the model rendered brake lenses red in `base/rear` so existing red pixels became a free precise mask; applied crimson `#B82119` @ 75% opacity over 2 upper brake lights + 2 lower bumper reflectors. Pakiet-reflektory/rear is no longer a byte-copy of base. **CarCanvas refactored** to a fixed-aspect-ratio placeholder (`aspect-[2000/1493]`) with all 5 imgs (1 base + 4 packages) absolutely positioned inside — locks layout regardless of which image is loading. Zero Higgsfield credits across all 4 fixes — all post-process compositing. Prior v2.3-glass-fix entry preserved below; prior v2.2 entry below that.)
>
> Earlier 2026-05-20 late night state (preserved): **PPF v2.3 glass-fix hotfix shipped locally.** Oskar caught a "vertically stretched" perception on `cale-auto/{front,rear}` and `pakiet-front/front` — cars were pixel-aligned with base, but the model had painted the windows crimson along with the body. Loss of dark-window contrast → eye reads the whole greenhouse as body → perceived stretch. Fix: composited base's dark glass back over the 3 affected PNGs via ImageMagick (threshold→negate→floodfill→Open Disk:10→y-band crop→`base.png package.png mask.png -composite`). No Higgsfield regen needed. Re-cwebp at 2000×1493, replaced 3 webps in `public/ppf/packages/`. Smoke test on :5180: G-Brabus silhouette reads correctly across all 4 packages × 2 views. Pre-fix PNGs preserved as `*-pre-glass-fix.png`. Recipe + general rule for future coverage-map work documented in `assets-src/ppf/prompts.md` § v2.3. Prior v2.2 entry preserved below.)
>
> Earlier 2026-05-20 night state (preserved): **PPF v2.2 cinematic reshoot SHIPPED locally.** All 10 webps replaced at `public/ppf/` — pearl-white Mercedes G63 Brabus 800 Widestar on wet jet-black mirror floor with dramatic full-length reflection, scattered water droplets, deep crushed-black void above for headline text. Phase 3a test gate validated coverage + cinematic transfer; Phase 3b batched 6 fresh 2k overlays in parallel; the 2 bare-rear views (reflektory + pakiet-front) are byte-copies of `base/rear.webp`. cwebp pipeline hit a libpng "invalid read length (overflow)" on the raw PNGs — fixed by routing all 10 PNGs through `sips -s format png` first to re-encode + then cwebp -resize 2000 1493 to final webp. Smoke test on :5180 passed: bestseller pre-selected, package crossfade works, view toggle works, deep-link `?pkg=cale-auto` lands correctly, 0 console errors. Total bundle: 10 webps at 2000×1493, ~870 KB combined (vs v2.1's 696 KB — bigger because the new cinematic detail has more entropy, still well under 1 MB). v2.1 webps preserved at `public/ppf.v2-1-backup/` for one-command revert. NOT pushed to prod — local-only ship. Prior v2.2-in-progress entry preserved below.)

## Resume from (TOP — read first)

**Stage:** ✅ **PPF v2.2 cinematic reshoot SHIPPED locally (2026-05-20 night).** All 10 webps live at `public/ppf/{base,packages}` with the cinematic noir G-Brabus aesthetic. Architecture untouched (`src/lib/ppf-data.js`, `src/components/ppf/*` — same paths, same enums). Plan file at `/Users/oskarbal/.claude/plans/ppf-configurator-image-generation-plan.md`. v2.1 backup at `assets-src/ppf/v2-1-backup/` (moved out of `public/` 2026-05-21 to prevent Vite shipping it to Vercel; per-Codex review). One-command rollback: `rm -rf public/ppf && mv assets-src/ppf/v2-1-backup public/ppf`. Job IDs + prompts archived in `assets-src/ppf/prompts.md` (v2.2 section at top + v2.1 archive below). Below in the log: prior **v2.1 stage** was HOME + CENNIK + PPF FEATURE-COMPLETE + VISUALIZER 2.1 SHIPPED — pre-rendered photo crossfade, 4 packages × 2 views = 8 photoreal G-Class renders with semi-transparent crimson #B82119 overlay, all at 2000×1493. v2.2 swaps the assets, not the architecture (zero code changes — same image paths, same `view: front|rear` enum).

The 4 packages come straight from the cennik in `src/lib/catalog.js:25-28`: PPF reflektory (300 zł), Zabezpieczenie progów PPF (500 zł), PPF pakiet front (4500 zł, bestseller), PPF całe auto (15 000 zł, bestseller).

**Architecture (current):**
- `public/ppf/{base/{front,rear}.webp, packages/<slug>/{front,rear}.webp}` — 10 webps, 696 KB total
- `assets-src/ppf/{README.md, prompts.md, raw/...}` — pipeline doc + final Higgsfield prompts + job IDs + raw 2k PNGs
- `src/components/ppf/` — 11 components (CarCanvas crossfade, Packages picker, PackageSummary with covers list, PpfStickyBar, SpecsBlock, ValueCalculator, RealizacjePlaceholder, Faq, FinalCta, PpfHero, PpfTeaser)
- `src/pages/PPF.jsx` — 135-line orchestrator (down from 886)
- `src/lib/ppf-data.js` — trimmed to ~95 lines (PPF_VIEWS, PPF_PACKAGES with `covers[]` + `images.{front,rear}`, PPF_DEFAULT_PACKAGE_ID, helpers). No more PPF_ZONES / d-strings / matchPpfPackage / ppfSubtotal.
- `src/components/WycenaForm.jsx` — PPF integration via single `ppfPackage` prop
- `api/wycena.js` — PPF labels map matches the 4 cennik IDs

**Build state:** 344.32 kB / 100.98 kB gzip JS, 59.12 kB / 10.83 kB gzip CSS. Build clean. SPA rewrite already in place (route all non-/api paths → index.html).

**Cennik + Home + Kontakt + DoorToDoor + Realizacje** all from the pre-PPF era are unchanged and feature-complete. `/cennik` = 8-category / 39-row interactive checklist, sticky-bar total, "Szczegółowa wycena · 15 minut" modal with 10-slot photo grid + conditional pickup-address (door-to-door reveal) → `/api/wycena` Resend serverless. Home `/kontakt` → sibling `/api/lead`. Hero has the magic-shimmer `Szczegółowa wycena · 15 min` CTA. LocalStorage persists both cennik selection (`cdr.cennik.selection.v1`) and PPF package (`cdr.ppf.selection.v1`).

**Next session = first Vercel deploy of v2.**
1. Link Vercel project (dashboard: `vercel.com/new` → import `OskarBal/cars-detailing-radom`, framework: Vite, root: `site-v2`)
2. Set env vars in Vercel: `RESEND_API_KEY`, `WYCENA_TO_EMAIL` (Oskar's address until Tomasz's confirmed at Meeting #2), `WYCENA_FROM_EMAIL` (must be a verified Resend sender — **NEVER** `onboarding@resend.dev`), optional `WYCENA_REPLY_TO`
3. Smoke-test the live preview URL into **Oskar's** inbox (never test-fire to Tomasz per `feedback_no_test_emails_to_client_inbox.md`): submit `/kontakt` lead form + `/cennik` wycena form with 3-4 photos + door-to-door → verify attachments + Maps link both work + the `PPF · …` subject + PPF-specific email body.
4. Check `/ppf` live: crossfade between packages, view toggle, deep-links (`/ppf?pkg=cale-auto`, `/ppf#wycena`, `/ppf#pakiety`), home teaser auto-cycle. Run a Lighthouse audit — LCP should stay healthy because the bestseller front-view image is `loading="eager"`.
5. If everything passes: point production domain at the new project; archive `cars-detailing-radom-legacy` on prod.

**Boot sequence next session:**
1. Read this file
2. Read `DESIGN_BRIEF.md` for the design vocabulary
3. `npm run dev` (port 5180) — verify `/`, `/cennik`, `/ppf` end-to-end locally
4. Vercel dashboard import

**Open inputs (still blocked on Meeting #2 with Tomasz):**
- Owner business email (form recipient — `WYCENA_TO_EMAIL`)
- Verified Resend sender domain for `WYCENA_FROM_EMAIL` (`carsdetailingradom.pl` DNS once they own it, otherwise Bal Agency's verified sender)
- Studio opening hours (currently "9–19" placeholder in WycenaForm success copy + PackageSummary)
- Film brand confirmation (XPEL / STEK / Suntek / Hexis / other) — copy currently says "Markę folii potwierdzimy na rozmowie"
- Real per-package PPF prices confirmation (current `od X zł` numbers come from the cennik file, but Tomasz may want tighter pricing)
- PPF Realizacje photos — currently 2 placeholder cards on `/ppf`
- Tier 2 automations y/n (auto-reply emails)
- Approved Realizacje photos for home (TikTok-only for now)
- B2B y/n (affects KSeF copy on cennik)

**Polish backlog (post-Meeting-#2, optional):**
- If Tomasz wants stronger PPF visualizer color saturation, tighten the prompt in `assets-src/ppf/prompts.md` and regen (recipe documented).
- `reflektory/front` renders the headlight overlay slightly coral / salmon rather than strict crimson — flagged in `prompts.md`; regen recipe available if Tomasz wants true crimson.
- Photo upload on home Kontakt (Supabase Storage signed URLs) — defer until Tomasz confirms scope.

## Session log

**2026-05-21 (early) — `Ekonomia ochrony` rebuilt as personalized PPF ROI engine + lead conversion machine:**
- Status: Oskar said the old `ValueCalculator` was decoration not conversion. Spec'd 4 directions (A: personalized ROI, B: koszt-vs-alternatywa comparator, C: wartość rezydualna engine, D: risk simulator), Oskar picked A+B+D hybrid + no email gate + use international-study-style language for resale stat. Shipped the hybrid.
- Shipped:
  - **4-input calculator** (`InputsCard`): pakiet tabs (2×2 grid, syncs back from the configurator's active selection), 3 sliders (wartość auta 50k–1.5M / 10k step, roczny przebieg 5k–80k / 5k step, planowany okres posiadania 1–10 lat / 1 step) + 1 segmented control (trasa: miasto / mieszane / autostrada).
  - **Live output panel** (`OutputPanel`) with hero `zł/dzień` number in 5.5rem Barlow Italic Black + 3 stat cells below (próg opłacalności · wartość rezydualna `+3–5%` · pierwszy odprysk months estimate). Hero number `key=`s on the formatted string → re-mounts → fires a 380ms `vc-hero-pulse` opacity+translate animation on every value change (subtle, feels alive without distracting).
  - **Comparator block** (`Comparator`): 2-column card under the calculator. Left = "Bez folii · 5 lat" 5-row damage roll-up (rok 1: pierwszy odprysk maski 2400 zł → rok 5: brak oryg. lakieru) → suma `6 200+ zł`. Right = "Z folią PPF · 10 lat" flat counter (pakiet name + koszt jednorazowy + amortyzacja + `zł/dzień`). IntersectionObserver flips `data-in-view="true"` on the wrapper, rows stamp in with 180ms stagger via CSS `--vc-delay` custom property + `vc-row-in` keyframe.
  - **CTA**: opens existing WycenaForm pre-filled with all 4 inputs as a multi-line note + auto-selects the calculator's pakiet via new `openFormWithNote(note, pkgId)` callback. Tomasz inbox lands with the full car profile attached to the lead.
- Wiring:
  - **`WycenaForm.jsx`**: added `prefillNote` prop (default `''`). Initial state seeds `form.note` from it; second `useEffect` watches `[open, prefillNote]` and seeds the note only if blank (preserves user edits + prior input across re-opens). One-way: the form never writes back to the parent's note state.
  - **`PPF.jsx`**: added `formPrefillNote` state + `openFormWithNote(note, pkgId)` callback (also sets `activePackageId` so the form summary shows the right service); passed `prefillNote={formPrefillNote}` to WycenaForm; cleared the note on close. Existing `openForm` (used by sticky bar + FinalCta + PackageSummary) also clears the prefill so no stale content leaks across entry points.
  - **`index.css`**: added `.vc-hero-pulse` (380ms opacity+translate on key change) + `.vc-compare .vc-compare-row` baseline (opacity 0, y+8) + `.vc-compare[data-in-view="true"] .vc-compare-row` animation with `--vc-delay`. Both respect `prefers-reduced-motion: reduce`.
- Math anchors (locked):
  - Avg PL paint repair event: **2 200 zł** (chip + spot paint ~1200, full panel respray ~2500, bumper paint ~2000)
  - 5-year scenario: 2400 + 1800 + 2000 = **6 200 zł** napraw + −3% wartości + utrata oryginalnego lakieru
  - Pierwszy odprysk by trasa: miasto 18 mies · mieszane 12 · autostrada 6, multiplied by km factor (≥40k/rok → ×0.8, ≤10k/rok → ×1.2)
  - Wartość rezydualna `+3–5%` stays uncited — phenomenon is real, no defensible PL-specific source. Copy reads "przy sprzedaży · oryg. lakier" without fake Carfax/AAA tag.
- Files touched:
  - `src/components/ppf/ValueCalculator.jsx` (full rewrite — was 68 lines, now ~415)
  - `src/components/WycenaForm.jsx` (added prefillNote prop + open-cycle sync effect)
  - `src/pages/PPF.jsx` (added formPrefillNote state + openFormWithNote callback + props through to ValueCalculator and WycenaForm; cleared prefill in openForm + closeForm)
  - `src/index.css` (added vc-hero-pulse + vc-compare-row keyframes block)
- Build: clean. **355.61 kB / 104.05 kB gzip JS** (+11 kB vs the v2.3-glass-fix baseline). **62.32 kB / 11.31 kB gzip CSS** (+3 kB for the keyframes block).
- Smoke test: existing vite dev server on :5180 picked up the changes via HMR (build also passes clean). Not auto-screenshotted (per `feedback_visual_verification.md` — Oskar checks visuals himself).
- Decisions locked (this session):
  - **No email gate.** Per Oskar's pick, the CTA hands off to the existing WycenaForm instead of soft-popping a PDF-report capture. Simpler, preserves the existing Resend flow, and the lead quality is still high (form already collects name + phone + email + car model + photos, now also pre-filled with wartość/km/trasa/okres).
  - **Single universal 5-year scenario** regardless of selected pakiet — even for the 300 zł reflektory package. Math holds: prog opłacalności is computed as `ceil(price / 2200)` so reflektory shows "1 naprawa" which is honest (1 klosza repaint ≈ 1200–2400 zł).
  - **Pakiet tabs sync bidirectionally with the configurator above.** If the user changed pakiet up there, the calculator seeds from it; if they change it in the calculator, future re-opens of the form auto-pick the matching pakiet via the CTA's `pkgId` arg. Doesn't write back to the parent on every change (would be twitchy) — only the CTA fire pushes a change up.
  - **Resale stat uncited.** Copy says `+3–5% przy sprzedaży · oryg. lakier` with no Carfax/AAA tag. Per no-hallucinated-context rule. If Tomasz has PL-specific data at Meeting #2, swap in.
- Open questions:
  - Should `wartość rezydualna` be a fixed `+3–5%` or scaled by car value? Currently static. Could compute `carValue × 0.04` and show the actual zł amount ("`+10 000 zł`"). Punchier but riskier (more anchorable claim). Defer to Tomasz feedback.
  - The 5-year scenario damage list is hard-coded. Could ship as data file if we want different scenarios per pakiet later — current decision was deliberate (one universal frame), no change needed unless Tomasz wants package-specific scenarios.
- Higgsfield credit this iteration: **0** (no asset work).
- Resume from: **Visit `/ppf` on :5180, scroll to `Ekonomia ochrony`, exercise all 4 inputs + the comparator scroll-in animation + the CTA → confirm the WycenaForm opens with the note textarea pre-filled and the matching pakiet selected.** Then: still next-session = first Vercel deploy of v2 (gated on Tomasz's Meeting #2 inputs).

---

**2026-05-20 (very late night, addendum 3) — `pakiet-reflektory/rear.webp` brake-light highlight (no longer a byte-copy of base):**
- Status: Oskar asked for the rear brake lights to be tinted on `pakiet-reflektory` (the front headlight package extended to include rear lights — logical because PPF headlight protection commonly covers tail lights too). Constraint: "very precise." Built a pixel-perfect mask + crimson tint without spending Higgsfield credits.
- Recipe: the model had already rendered the brake-light glass as red in `base/rear` (real brake lens = red), so the existing red pixels gave a free precise mask. Python+PIL: thresholded for `R - (G+B)/2 > 12 AND R > 40` within the rear-quarter region (y=850–1100, x=1300–2200), dilated +3 px via `MaxFilter(7)`, Gaussian-blurred 2 px for soft edges, applied crimson `#B82119` at 75% opacity over `base/rear` at the mask. Saved as `assets-src/ppf/raw/packages/reflektory/rear.png` (was a byte-copy of `base/rear.png`).
- Result: 2 upper brake-light lenses (vertical rectangles on the tailgate area) + 2 lower bumper reflectors (horizontal strips) all tinted crimson. Body white. Spare tire untouched. BRABUS emblem untouched. Lower bumper cladding untouched. Pixel-precise.
- cwebp via sips-normalize → `cwebp -q 82 -m 6 -mt -resize 2000 1493` → `public/ppf/packages/reflektory/rear.webp` (85 440 B, vs 78 760 B byte-copy).
- Pre-fix preserved as `assets-src/ppf/raw/packages/reflektory/rear-was-bare-copy.png` (the original byte-copy of `base/rear.png`).
- Live smoke test on :5180: `/ppf?pkg=reflektory` + Tył toggle shows the brake light highlights cleanly.
- Higgsfield credit: 0.

---

**2026-05-20 (very late night, addendum 2) — CarCanvas locked to a fixed-aspect placeholder container:**
- Status: Refactored `src/components/ppf/CarCanvas.jsx` so the configurator's image area is a single fixed-aspect-ratio window with all 5 images (1 base + 4 packages) nested inside as absolutely-positioned siblings. Previously the wrapper sized itself off the base img's `block w-full h-auto` — layout depended on the base img loading. Now: `aspect-[2000/1493]` on the wrapper drives the box; every img is `absolute inset-0 w-full h-full object-cover`. No CLS during img load, no dependency on any single image being the size driver.
- DOM check confirmed: wrapper aspect at viewport = 1.340, target = 1.340 (exact match).
- Files touched: `src/components/ppf/CarCanvas.jsx` (lines around 11 and 18: added `aspect-[2000/1493]` to wrapper, switched base img from `block w-full h-auto` to `absolute inset-0 w-full h-full object-cover`, added `object-cover` to all package imgs).
- Build delta: zero — pure className changes.

---

**2026-05-20 (very late night, addendum) — `cale-auto/rear.webp` wheel-bleed hotfix:**
- Status: Oskar spotted the rear-right tire was partially salmon (crimson wheel-arch bleeding past the arch lip onto the upper tire). Fixed via the same composite pattern as the glass-fix, but with a different mask: "dark in base AND red-channel-dominant in cale-auto, constrained to wheel y-band (940-1380)." Mask built in Python (PIL + numpy in a `/tmp/ppf-venv` venv — system python is PEP 668 locked). Composited via `magick package.png base.png mask.png -composite`, sips-normalized, cwebp'd to 2000×1493. `cale-auto/rear.webp` now 83070 B (vs 78760 prior).
- Bonus side-effect: the diagnostic mask also caught a thin dark rocker-trim line along the lower body, which is real Brabus contrast cladding. Restoring it makes the cale-auto rear render look more realistic (less "flat salmon blob"). Acceptable enhancement.
- Live smoke test on :5180 confirmed: rear-right wheel reads correctly (dark tire + visible gunmetal rim spokes), wheel arches remain crimson as they should.
- Files: `assets-src/ppf/raw/packages/cale-auto/rear.png` (replaced — prior preserved as `rear-pre-wheel-fix.png`), mirror in `_normalized/`, `public/ppf/packages/cale-auto/rear.webp` (replaced).
- Higgsfield credit: 0.

---

**2026-05-20 (late night) — PPF v2.3 glass-fix hotfix — 3 webps de-tinted on windows via ImageMagick composite:**
- Status: Oskar loaded `/ppf` after the v2.2 reshoot, screenshotted `progi/front` (looked correct) and `cale-auto/front` (looked "vertically stretched"), reported the same stretch on `pakiet-front`. Diagnosed → fixed → smoke-tested without spending Higgsfield credits. Root cause was perceptual, not geometric.
- Diagnosis:
  - All 10 webps measured 2000×1493 → no dimension bug.
  - All 10 raw PNGs measured 2400×1792 (same 1.339 aspect) → no aspect bug.
  - `magick -gravity center -crop ... -threshold -trim` bounding-box test across all 5 fronts: identical `800x597+139+173` → cars are pixel-aligned with `base`.
  - `magick compare -metric AE -fuzz 8%` against `base/front`: `progi` and `reflektory` differ by ~9% of pixels (color change only on sill/headlights), but `pakiet-front` differs by ~15% and `cale-auto` by ~17%. The extra delta is the model painting GLASS crimson along with the body — the diff PNG for `cale-auto` shows the entire greenhouse as red (body color change), not the silhouette edge.
  - Confirmed visually via 4-up crop strip: `cale-auto` greenhouse is solid salmon (windshield + side windows + rear window all crimson), `pakiet-front` has windshield + front side window crimson, `pakiet-front/rear` looks fine (the v4 mirror-housing fix kept its glass dark by accident).
  - Conclusion: the G-Class silhouette only reads as "boxy" when the dark windows break up the body. Take the dark-window contrast away → eye reads the whole upper section as one continuous block → perceived as taller. PPF doesn't go over glass in reality either, so the model output is also factually wrong.
- Fix (no Higgsfield regen):
  - Built a glass mask from `base/front.png` (sips-normalized) via: `-colorspace gray -threshold 30% -negate -floodfill +corners "white"` → `-morphology Open Disk:10` (kills thin chrome trim, keeps window-sized regions) → y-band crop `rectangle 0,0 2400,490` + `rectangle 0,820 2400,1792` (constrains to greenhouse only — excludes grille top + bumper trim).
  - Same recipe for `base/rear.png` (y-band 0–500 and 790–1792 — rear greenhouse sits slightly tighter).
  - Composite syntax: `magick package.png base.png mask.png -composite output.png` (bottom = package, top = base, mask = where to keep top). Result: package's body tint preserved everywhere except glass; glass reverts to base's dark transparent windows.
  - Applied to 3 PNGs: `cale-auto/front`, `cale-auto/rear`, `pakiet-front/front`. `pakiet-front/rear` left untouched (already correct from v4 fix).
  - Re-encoded all 3 via `cwebp -q 82 -m 6 -mt -resize 2000 1493 → public/ppf/packages/...`. Sizes: 91548 / 78760 / 87028 bytes (vs originals 90868 / 77710 / 86682 — essentially unchanged).
- Live verification on `:5180` via Playwright @ 1440×900: navigated to `/ppf`, cleared `cdr.ppf.selection.v1` localStorage, clicked Całe auto → DOM check confirms `cale-auto/front.webp` at opacity 1, viewport screenshot shows salmon body + DARK windshield + DARK side windows + proper boxy G-Class silhouette restored. Clicked Pakiet front → windshield now dark (was crimson), front side window dark, rest of body unchanged. Clicked Tył → DOM check `base/rear.webp + cale-auto/rear.webp` both at opacity 1, viewport screenshot shows rear 3/4 with salmon body + dark side windows + spare tire reading correctly. 0 console errors.
- Decisions locked:
  - **General rule for future coverage-map work**: `nano_banana_2` tends to paint EVERYTHING in the covered zone including glass. Two options to handle this: (a) explicit "GLASS MUST STAY DARK" exclusion language in the prompt, OR (b) post-process composite recipe (above) to surgically restore dark glass from `base`. (b) is cheaper and more reliable — added to `prompts.md` § v2.3.
  - **Don't try to regen geometry when the cars are already aligned** — the cheapest fix is software compositing, not another Higgsfield round. v2.3 cost: zero credits.
- Files touched:
  - `assets-src/ppf/raw/packages/cale-auto/front.png` (replaced — pre-fix preserved as `front-pre-glass-fix.png`)
  - `assets-src/ppf/raw/packages/cale-auto/rear.png` (replaced — pre-fix preserved as `rear-pre-glass-fix.png`)
  - `assets-src/ppf/raw/packages/pakiet-front/front.png` (replaced — pre-fix preserved as `front-pre-glass-fix.png`)
  - Mirror replacements + backups in `assets-src/ppf/raw/_normalized/packages/...`
  - `public/ppf/packages/cale-auto/front.webp` (replaced — 91548 bytes)
  - `public/ppf/packages/cale-auto/rear.webp` (replaced — 78760 bytes)
  - `public/ppf/packages/pakiet-front/front.webp` (replaced — 87028 bytes)
  - `assets-src/ppf/prompts.md` (added § v2.3 with the recipe + general rule)
  - `BUILD_STATE.md` (this entry + top header refresh)
- Higgsfield credit this iteration: **0**. All software-side.
- Open questions: same as v2.2 wrap-up — Vercel push gated on Tomasz Meeting #2 inputs (business email, verified Resend sender, opening hours, film brand, real per-package prices, Realizacje photos).
- Resume from: Site is visually clean. **Next session = first Vercel deploy of v2.** Run `npm run build` first to confirm bundle stays at ~344 kB / 101 kB gzip (no code delta — only assets changed).

---

**2026-05-20 (night, wrap-up) — Post-mortem: what went bad, how we fixed it, how to not repeat:**

This session shipped PPF v2.2 cinematic but took 6 regen rounds across `pakiet-front` to get coverage right. Documenting the failure modes + the prompt-engineering recipe that finally worked, so the same mistakes don't repeat next time we run a coverage-map visualizer (Mechanik Radom, future clients).

### What went bad

1. **Lazy "no rear-visible coverage" shortcut on `pakiet-front/rear`.** Initial v2.2 plan byte-copied `base/rear.png` for both `reflektory/rear` AND `pakiet-front/rear` on the assumption that "package covers parts not visible from this rear angle." True for reflektory (front headlights fully blocked by the rear of the car). FALSE for pakiet-front — the driver-side front fender + widebody flare + mirror housing + a sliver of hood all poke past the rear quarter from rear 3/4 and ARE visible. Cost: 3 regen iterations (v2 added 2 islands, v3 added the hood but overshot onto the door, v4 nailed it).

2. **`pakiet-front/front` v1 had two coupled coverage bugs.** The first batched render of `pakiet-front/front` (jobId `b5f14c6f-…`) left the mirror housing pearl-white AND bled crimson past the front door cut-line into the rear quarter panel — creating an unintended U-shaped coverage. Both issues caught only when Oskar viewed the live page (not in my pre-ship Read-tool inspection). Cost: 1 regen.

3. **`pakiet-front/rear` v3 model overshoot.** When I added "hood sliver" as a 3rd island to the rear render, the model interpreted "front of car protection" too broadly and tinted the **entire** driver-side front door crimson. Wrong per spec (pakiet-front = "od zderzaka po słupki A," excluding doors). Cost: 1 regen.

4. **Tesla "Full Front PPF" expansion that the model couldn't deliver.** Mid-Phase-3a I added mirrors + A-pillars + roof leading edge to the pkg-front spec based on a Tesla reference photo. Model couldn't deliver them reliably on a 3/4 angle — kept rendering them pearl-white even with explicit "MUST be tinted" language. Locked decision after AskUserQuestion: drop those panels from pkg-front; the broader "every visible painted panel" interpretation works for cale-auto but not for the more constrained pkg-front spec.

5. **cwebp + libpng overflow error on fresh Higgsfield PNGs.** First `cwebp -resize` call failed with `libpng error: ReadFunc: invalid read length (overflow)`. v2.1 PNGs worked fine; v2.2 PNGs from the same model + same MCP path didn't. Lost ~5 min to first-failure diagnosis.

### How we fixed it

1. **Visibility audit per camera angle.** Don't byte-copy a "bare" overlay just because the package name says "front." Audit what's actually visible from the OTHER camera angle (rear 3/4 in this case). For pakiet-front from rear: front fender + widebody flare + mirror housing + hood sliver all visible past the rear silhouette → must be tinted on `rear.webp` too. For reflektory from rear: headlights entirely blocked → bare byte-copy genuinely correct.

2. **Inclusion list + ABSOLUTE EXCLUSION LIST + visual rule.** The v2.1 prompt template only listed what to tint. v2.2 needed three layers:
   - **Numbered inclusion list** (panels to tint).
   - **ABSOLUTE EXCLUSION LIST in caps** naming every other panel as "MUST stay BARE pearl-white" — especially the panels adjacent to the included ones (the rear quarter for pkg-front, the front door for pkg-front rear-view).
   - **A visual termination rule** ("imagine drawing a vertical line down the gap between the front fender and the front door — everything FORWARD of that line + mirror housing gets the tint; everything AFT of that line stays bare"). Geometric language anchors the model better than panel names alone.

3. **Disambiguation for "X sits on Y" cases.** When one tinted item physically sits on top of an excluded item (mirror housing on front door), plain "door stays bare" wasn't enough. The fix: "the mirror housing sits ON TOP of the front door but is a separate piece; only the housing gets tint, the door underneath stays bare." The model needed the geometric relationship spelled out.

4. **Meta-language to break overshoot patterns.** Adding "(critical — model has been tinting this incorrectly)" parenthetical next to a constraint genuinely helps. Worked first try on v4 of `pakiet-front/rear` after v3 had overshot. Seems to focus the model's attention on the specific failure mode without needing to over-explain.

5. **"Islands" gestalt framing for partial coverage.** Instead of just listing panels, end the prompt with: "The crimson should appear as exactly THREE small islands on a mostly-WHITE car: (a) ..., (b) ..., (c) .... The vast majority of the car visible in this view is BARE pearl-white." Gives the model a clear visual target for the OVERALL composition, not just a per-panel checklist.

6. **Test gate before batching.** The Phase 3a 1k test gate (one render threading the master jobId) caught the widebody-flare + cowl miss BEFORE burning credits on a 6-render batch. Without the gate, we'd have shipped 8 wrong renders and had to regen all of them. Keep this pattern: cheap 1k validation, then 2k batch.

7. **cwebp libpng workaround.** Route Higgsfield PNGs through `sips -s format png` first to re-encode, then cwebp the normalized PNG. Saved as `feedback_cwebp_higgsfield_libpng.md` memory; default to this in any future Higgsfield → webp pipeline.

### Recipe for the next coverage-map visualizer (do not repeat the mistakes)

When generating a coverage-overlay map for the next client/package (Mechanik Radom or otherwise):

1. **Plan visibility per camera angle first.** Sketch which panels from the package are visible from each camera angle. Byte-copy ONLY when the package's protected zone is genuinely 100% invisible from that angle. Otherwise generate.

2. **Use the 4-section prompt template:**
   - Base aesthetic (locked, copy from `assets-src/ppf/prompts.md` § v2.2 template).
   - **Numbered inclusion list** with bold names + "MUST be tinted crimson" admonitions.
   - **ABSOLUTE EXCLUSION LIST** with every adjacent + nearby panel named in caps as "MUST stay BARE."
   - **Closing gestalt**: "The crimson should appear as N small islands on a mostly-white car: (a) ..., (b) ..., (c) ... The vast majority of the car visible in this view is BARE pearl-white."

3. **Add disambiguation for stacked geometries.** Whenever a tinted item physically sits on an excluded item, spell out the relationship.

4. **Always run a 1k test gate before the 2k batch.** Threading the master jobId. ~1 credit insurance against 12-credit regen costs.

5. **Always run `sips -s format png` before cwebp** on fresh Higgsfield PNGs.

6. **Inspect EVERY render via Read tool before declaring shipped.** v1 of `pakiet-front/front` had two coverage bugs that I missed in my Read inspection (mirror + rear-quarter bleed) but Oskar caught instantly when he loaded the live page. My Read-tool inspection is too easily satisfied by "looks roughly right." Be specific: enumerate each included panel and check its tint state explicitly, then enumerate each excluded panel and check its bareness.

### Files referenced
- Prompt template + per-render coverage spec: `assets-src/ppf/prompts.md` § v2.2.
- Failure-mode notes inline in `assets-src/ppf/prompts.md` § pakiet-front rows.
- libpng workaround: `~/.claude/projects/-Users-oskarbal-Desktop/memory/feedback_cwebp_higgsfield_libpng.md`.

### Higgsfield credit ledger this session
- Estimate ~25–28 credits total spent across Phase 3a test + Phase 3b batch + 3 `pakiet-front` regens. Started ~365, ended ~340.

### Resume from
PPF v2.2 is shipped locally + visually clean on `/ppf` front + rear for all 4 packages. **Next session = first Vercel deploy of v2.** Still gated on Tomasz Meeting #2 inputs: `WYCENA_TO_EMAIL` (business email), verified Resend sender domain (`WYCENA_FROM_EMAIL`), opening hours, film brand, real per-package PPF prices, PPF Realizacje photos. Run `npm run build` first to confirm bundle is unchanged from v2.1 (~344 kB / 101 kB gzip JS — no code delta).

---

**2026-05-20 (night, very late part 3) — `pakiet-front/rear.webp` v4 — hood sliver added, front door spillage avoided:**
- Status: Oskar caught one more miss on the v2 rear render — the front edge of the hood (poking out at the top-front of the car) is visible from rear 3/4 and should also be tinted. v3 added the hood but model overshot and tinted the entire front door. v4 used tighter language to keep just the 3 small visible islands (fender + flare, hood sliver, mirror housing) with the door staying bare. Shipped.
- Shipped:
  - **v3 regen** jobId `1382ce73-c494-4bdc-b85a-0456242c8b3b` — added hood sliver as a numbered item; model interpreted "front of car" too broadly and tinted the entire driver-side front door (NOT in pakiet-front spec). Rejected.
  - **v4 regen** jobId `6f1284f1-2392-45aa-9868-9bc7fb376bde` — added critical "ZERO crimson on the door surface" admonition + "the mirror housing sits ON TOP of the door but is a separate piece" disambiguation + "model has been tinting this incorrectly" hint. Model nailed it: front fender + flare ✅, hood sliver at top-front ✅, mirror housing ✅, door BARE ✅.
  - **cwebp** via the locked pipeline. New `public/ppf/packages/pakiet-front/rear.webp` at 2000×1493, 81590 bytes.
  - **Cleanup**: v3 raw PNG + preview deleted (not preserved — model overshot, not useful for comparison). v2 raw PNG renamed to `rear-v2-superseded.png` + preview to `rear-v2-superseded-preview.jpg` (clean rendering, worth keeping as a "2-island" reference). Original bare-copy preserved at `rear-was-bare-copy.png`.
- Decisions locked:
  - **When the model spills past a target panel onto an adjacent excluded panel**, the fix language pattern is: (a) name the excluded panel explicitly in caps, (b) call out the visual relationship ("X sits ON TOP of Y but they are separate pieces"), (c) admit "model has been tinting this incorrectly" — meta-language to break the model out of its prior overshoot pattern. Worked first try on v4.
- Files touched:
  - `assets-src/ppf/raw/packages/pakiet-front/rear.png` (now = v4)
  - `assets-src/ppf/raw/packages/pakiet-front/rear-v2-superseded.png` (renamed from v2)
  - `assets-src/ppf/raw/_normalized/packages/pakiet-front/rear.png` (re-normalized)
  - `public/ppf/packages/pakiet-front/rear.webp` (replaced)
  - `assets-src/ppf/prompts.md` (table row updated with full v1/v2/v3/v4 history + rationale)
  - `BUILD_STATE.md` (this entry)
- Higgsfield credit this iteration: ~4 used (v3 + v4 attempts).

---

**2026-05-20 (night, very late part 2) — `pakiet-front/rear.webp` swapped from bare-copy → fresh render with front fender + mirror tinted:**
- Status: Oskar pointed out that the rear-view bare-car shortcut for `pakiet-front` was lazy — from rear 3/4, you can still see the driver-side **front fender + widebody flare** + **mirror housing** past the rear quarter, and those visible front-package elements should be tinted to communicate coverage consistently. Regenerated.
- Shipped:
  - **Regen** via `mcp__claude_ai_Higgsfield__generate_image` at 2k, threading rear base media UUID `9f9af0b1-…`. Higgsfield jobId `b5cc74f9-01ce-47c1-9e25-e640ef436093`. Saved at `assets-src/ppf/raw/packages/pakiet-front/rear.png` (the prior bare byte-copy preserved at `rear-was-bare-copy.png`).
  - **Prompt strategy**: framed as "PPF PARTIAL-FRONT COVERAGE FROM REAR ANGLE — the protection package covers the front of the car, but only a small portion is visible from this rear 3/4 angle." Numbered list: (1) driver-side front fender + widebody flare over the FRONT wheel, (2) driver-side exterior mirror housing. ABSOLUTE EXCLUSION LIST names every other panel (tailgate, spare-wheel cover, rear bumper, rear quarter, doors, rocker, etc.) as MUST-stay-bare. Closing rule: "The crimson should appear as two distinct 'islands' on a mostly-white car: one over the front wheel (fender + flare), one floating on the front door (the mirror housing)." Model nailed both islands first try.
  - **cwebp** via the locked sips-normalize → cwebp pipeline. New `public/ppf/packages/pakiet-front/rear.webp` at 2000×1493, 80788 bytes (vs prior 85270 from the base byte-copy — slightly smaller because the simpler two-island composition compresses cleaner).
- Decisions locked:
  - **Reflektory/rear stays as a byte-copy** — front headlights are completely blocked by the rear of the car from rear 3/4, so a bare render correctly conveys "nothing rear-visible." Only `pakiet-front/rear` had the visibility problem (fender + mirror both poke past the rear silhouette).
  - **Rule for partial-coverage-visible-from-other-angle renders**: don't shortcut to byte-copy when ANY portion of the protected panel set is visible from the alternate camera angle. Audit visibility per camera angle, not per package.
- Files touched:
  - `assets-src/ppf/raw/packages/pakiet-front/rear.png` (replaced)
  - `assets-src/ppf/raw/packages/pakiet-front/rear-was-bare-copy.png` (preserved prior bare byte-copy)
  - `assets-src/ppf/raw/_normalized/packages/pakiet-front/rear.png` (re-normalized for cwebp)
  - `public/ppf/packages/pakiet-front/rear.webp` (replaced)
  - `assets-src/ppf/prompts.md` (table row updated + bare-rear shortcut footnote refined)
  - `BUILD_STATE.md` (this entry)
- Higgsfield credit: ~2 used.

---

**2026-05-20 (night, very late) — `pakiet-front/front.webp` v2 regen — mirror housing added + rear quarter bleed removed:**
- Status: Oskar caught two issues on the just-shipped `pakiet-front/front.webp` during visual review: (1) the driver-side exterior mirror housing stayed pearl-white when it should be crimson, and (2) crimson bled past the front door shut-line into the rear quarter panel (creating an unintended U-shaped coverage). One-shot regen + cwebp + live verify resolved both.
- Shipped:
  - **Regen** via `mcp__claude_ai_Higgsfield__generate_image` at 2k, threading master jobId `7bb6c44c-…`. Higgsfield jobId `8f5447f2-a157-4f88-ac00-df20281e446b`. Saved at `assets-src/ppf/raw/packages/pakiet-front/front.png` (previous version preserved at `front-v2-superseded.png` for comparison).
  - **Prompt revision**: added "**THE DRIVER-SIDE EXTERIOR MIRROR HOUSING**" as item 8 in the numbered coverage list + replaced the soft "EXCLUDED" footer with an ABSOLUTE EXCLUSION LIST that explicitly names "REAR FENDER / REAR QUARTER PANEL" as MUST-stay-bare + added "NO U-shaped coverage. NO crimson bleeding to the rear quarter" admonition + "imagine drawing a vertical line down the gap between the front fender and the front door" visualization. Model nailed both fixes on first try.
  - **cwebp** via the locked sips-normalize → cwebp pipeline. New `public/ppf/packages/pakiet-front/front.webp` at 2000×1493, 86682 bytes (vs prior 92132 — slightly cleaner compression).
  - **Live verification on `:5180` via Playwright**: navigated to `/ppf`, force-clicked `PPF pakiet front` button (localStorage had remembered `cale-auto` from earlier session), opacity confirmed flipped 0→1 on the new webp, viewport screenshot shows mirror housing tinted + rear quarter clean.
- Decisions locked: When the model misplaces an overlay (bleeds past intended termination line OR misses a small named panel), the fix is **explicit double-spec** — name the included panel AND name the excluded adjacent panel with strong "MUST stay BARE" language + a visual rule ("imagine drawing a vertical line… everything FORWARD/AFT of that line"). Stronger than just listing panels.
- Files touched:
  - `assets-src/ppf/raw/packages/pakiet-front/front.png` (replaced)
  - `assets-src/ppf/raw/packages/pakiet-front/front-v2-superseded.png` (preserved prior version)
  - `assets-src/ppf/raw/packages/pakiet-front/front-v2-superseded-preview.jpg` (preserved prior preview)
  - `assets-src/ppf/raw/_normalized/packages/pakiet-front/front.png` (re-normalized for cwebp)
  - `public/ppf/packages/pakiet-front/front.webp` (replaced)
  - `assets-src/ppf/prompts.md` (job ID updated, revision rationale added)
  - `BUILD_STATE.md` (this entry)
- Higgsfield credit: ~2 used (one regen at 2k).
- Resume from: Site is now visually clean across all 4 packages. Same Vercel-push gate as before (Tomasz's Meeting #2 inputs).

---

**2026-05-20 (night, late) — PPF v2.2 cinematic reshoot SHIPPED locally — all 10 webps swapped, smoke test green:**
- Status: Resumed from Phase 3a mid-iteration. Validated the test-overlay gate (`pkg-front/front` at 1k via MCP threading the master jobId), batched the 6 remaining 2k overlays in parallel via MCP, byte-copied the 2 bare-rear views from `base/rear.png`, ran the cwebp pipeline (with a libpng workaround — see below), smoke-tested `/ppf` on the dev server. v2.2 is live locally; not yet pushed to prod.
- Shipped:
  - **Phase 3a test overlay** — 1k via `mcp__claude_ai_Higgsfield__generate_image` with `model: 'nano_banana_pro'` (fell back to `nano_banana_2`), aspect 4:3, threading master jobId `7bb6c44c-…`. Higgsfield jobId `a35dcae2-1fe9-4bbb-896e-a5777b06ac3c`. Server defaulted `resolution: '1k'` (I forgot to set it explicitly — fine for the test gate, cheaper). Saved at `assets-src/ppf/raw/packages/pakiet-front/phase3a-test1.png` as audit trail. Visual verdict: cinematic aesthetic transferred fully, **widebody flares + cowl panel now tinted crimson** (the v2.1 + first-attempt-v2.2 miss), bonnet + fenders + bumper + grille surround + headlights + air-dam all cleanly tinted. Mirrors + A-pillars + roof leading edge stayed pearl-white — Tesla-style full-front expansion didn't take. Locked decision via AskUserQuestion: re-scope `pkg-front` to the working set (drop mirrors/A-pillars/roof edge) + proceed to Phase 3b.
  - **Rear base media upload** — Phase 2 rear base PNG had no jobId (Oskar generated it manually in the Higgsfield web UI earlier), so I uploaded it via `media_upload`/`media_confirm` to get a reference handle for rear overlays. Media UUID `9f9af0b1-acd7-4384-bc16-44f418037d18`.
  - **Phase 3b — 6 final 2k overlays in parallel**:
    - `pakiet-front/front.webp` jobId `b5f14c6f-0238-49d3-ba0c-10eb52ec27dd` (threads master)
    - `reflektory/front.webp` jobId `a181c292-48cb-44f6-b7a9-b75b8c2dc519` (threads master)
    - `progi/front.webp` jobId `fb54adfd-9ff0-4426-95a5-ec057b933182` (threads master)
    - `cale-auto/front.webp` jobId `1e377338-65e7-4280-b197-b7b3a80c1c2e` (threads master) — entire visible body crimson incl. door + flank + roof + mirror (model interpreted "every visible painted panel" liberally — good for cale-auto)
    - `progi/rear.webp` jobId `033dcd9a-f704-4ee5-9a91-65c4f73dbcde` (threads rear media). Minor over-coverage: tail-light bezels also tinted (not strictly spec'd but reads as a consistent "rear-edge protection" theme — acceptable)
    - `cale-auto/rear.webp` jobId `16ac679e-9c9e-45f4-912b-ff8b95bee7c1` (threads rear media)
  - **Bare-rear shortcut** — `reflektory/rear.png` + `pakiet-front/rear.png` byte-copied from `base/rear.png`. Saved ~4–6 credits. Same visual output as generating bare-car rear views fresh (both packages have no rear-visible coverage). Verified at runtime: all 3 byte-identical webps (85270 bytes each).
  - **Phase 4 — cwebp pipeline** — initial run failed with `libpng error: ReadFunc: invalid read length (overflow)`. The new Higgsfield PNGs have some metadata or chunk format that current `cwebp 1.6.0` / libpng on this machine can't read directly. Worked around: routed all 10 raw PNGs through `sips -s format png` first to re-encode (`assets-src/ppf/raw/_normalized/`), then `cwebp -q 82 -m 6 -mt -resize 2000 1493` to final webp. All 10 webps shipped at 2000×1493, individual sizes 77–95 KB, total ~870 KB at `public/ppf/`.
  - **Phase 5 — smoke test** on `npm run dev` :5180 via Playwright MCP at 1440×900:
    - `/ppf` loads with crimson "Folia ochronna · PPF" eyebrow + headline + bestseller `pkg-front` pre-selected — `aria-pressed="true"` on the right button
    - CarCanvas shows the new cinematic G-Brabus pakiet-front/front render with wet floor reflection visible underneath the canvas mask
    - **Crossfade test**: click `PPF całe auto` → DOM check confirms `cale-auto/front.webp` opacity flips 0 → 1 while `pakiet-front/front.webp` flips 1 → 0; `base/front.webp` stays at opacity 1 as the underlying layer
    - **View toggle test**: click `TYŁ` → all 5 images swap to rear set; `cale-auto/rear.webp` opacity 1 + `base/rear.webp` underneath
    - **Deep-link test**: navigate to `/ppf?pkg=cale-auto` → activePkg = "PPF całe auto Bestseller", URL strips back to `/ppf` after handling (expected)
    - **Loading attrs**: `pakiet-front/front.webp` `loading="eager"` (bestseller — preserves LCP), other 3 package fronts `loading="lazy"` ✓
    - Console: 0 errors, 1 dev-time warning (likely React StrictMode), no broken image requests
  - **Documentation**:
    - `assets-src/ppf/prompts.md` rewritten: v2.2 section at top (base prompt template + camera-angle slots + coverage addendum + per-render coverage list + job IDs + visual verdict + credit ledger + rollback command), v2.1 archive preserved at bottom, original phase-2 job IDs preserved further down
    - This BUILD_STATE.md entry (replaces the "in progress" framing) + top header refresh
- Higgsfield credit ledger this session: started 365 (down from 373 between sessions), spent ~15–17 credits on MCP (Phase 1 master was pre-spent in the earlier in-progress session; Phase 3a test = 1; Phase 3b = 12; small overhead). Manual Phase 2 was billed against Oskar's Plus plan independently. Approximate end balance: ~348–350 credits. Comfortable headroom.
- Decisions locked (this round):
  - **`pkg-front` coverage scope** = bonnet + fenders incl. widebody flares + cowl panel + bumper + grille surround + headlights + air-dam (the v2.1 list **plus** flares + cowl). Mirrors + A-pillars + roof leading edge dropped from spec — model couldn't deliver them reliably and they're hard to see at this 3/4 angle anyway.
  - **`pkg-cale-auto` coverage scope** = "every visible painted panel" — model includes mirrors + A-pillars + roof edge spontaneously when given the broad spec. No need to enumerate.
  - **Bare-rear byte-copy** pattern locked. `reflektory/rear.webp` + `pakiet-front/rear.webp` ship as byte-identical copies of `base/rear.webp`. Future regen sessions should use the same shortcut.
  - **libpng cwebp workaround** documented: route Higgsfield PNGs through `sips -s format png` first if the direct `cwebp` call errors out with `ReadFunc: invalid read length (overflow)`.
  - **Crimson colour rendering** stays at "warm salmon-coral" per v2.1 acceptance — `nano_banana_2` interprets `#B82119` warmly when applied as a Photoshop-style overlay. Accepted for now; regen recipe documented in `prompts.md` if Tomasz wants tighter crimson.
- Files touched:
  - `assets-src/ppf/raw/_normalized/{base,packages}/...` — 10 sips-re-encoded PNGs (intermediate, not committed-worthy but kept for next-session reuse if cwebp needs them)
  - `assets-src/ppf/raw/packages/{reflektory,progi,pakiet-front,cale-auto}/{front,rear}.png` — 6 fresh 2k PNGs from Phase 3b + 2 byte-copies from `base/rear.png` (overwriting v2.1)
  - `assets-src/ppf/raw/packages/pakiet-front/phase3a-test1.png` (+ preview) — kept as audit trail of the 1k validation gate
  - `public/ppf/{base,packages}/...` — 10 final webps at 2000×1493 (rewriting the empty skeleton from earlier in v2.2)
  - `assets-src/ppf/prompts.md` — full rewrite (v2.2 section + v2.1 archive)
  - `BUILD_STATE.md` — this entry + top header refresh
- Open questions / Resume from:
  1. **Push to prod (Vercel)** — v2.2 is local-only. Push when comfortable. The repo's Vercel auto-deploy on `main` will pick it up if the project is linked; otherwise import via `vercel.com/new` first. Run `npm run build` locally first to confirm bundle stays at ~344 kB / 101 kB gzip (no code delta from v2.1).
  2. **Side-by-side compare** with the v2.1 backup before pushing — open `public/ppf.v2-1-backup/packages/cale-auto/rear.webp` vs `public/ppf/packages/cale-auto/rear.webp` in tabs to confirm v2.2 reads more cinematic / premium.
  3. **Crimson colour tighter, optional** — if Tomasz wants true-crimson over the current salmon-coral interpretation, regen recipe in `assets-src/ppf/prompts.md` v2.2 section ("Brand colour fidelity" note).
  4. **Cleanup of `assets-src/ppf/raw/_normalized/`** — these are intermediate sips re-encodes used by cwebp. Could be `.gitignore`d or deleted; kept for now in case next session needs to regen webps without re-billing Higgsfield.
  5. Earlier open inputs from prior sessions still unchanged (gated on Meeting #2 with Tomasz): owner business email (`WYCENA_TO_EMAIL`), verified Resend sender domain (`WYCENA_FROM_EMAIL`), studio opening hours, film brand confirmation, real per-package PPF prices, PPF Realizacje photos, Tier 2 automations y/n.

---

**2026-05-20 (night) — PPF v2.2 cinematic reshoot kickoff — plan locked, master + rear base shipped, Phase 3a mid-iteration:**
- Status: Session-end snapshot for a fresh-session resume. Plan locked at `/Users/oskarbal/.claude/plans/ppf-configurator-image-generation-plan.md` (named per Oskar's ask, renamed from auto-generated slug). v2.1 webps backed up to `public/ppf.v2-1-backup/`. Phase 1 (front 3/4 master) + Phase 2 (rear 3/4 base) LOCKED, PNGs at `assets-src/ppf/raw/base/{front,rear}.png` (2400×1792 each). Phase 3a (test overlay = pkg-front/front) generated but coverage incomplete. Phases 3b/4/5 pending.
- Shipped:
  - **Plan file** at `/Users/oskarbal/.claude/plans/ppf-configurator-image-generation-plan.md` — full v2.2 spec: car (Brabus G63 pearl-white), camera (3/4 front + 3/4 rear), aesthetic (wet jet-black mirror floor, crushed-black rim lighting, droplets, 50%+ black void above for headline text), overlay (semi-transparent crimson #B82119 ~50% opacity), aspect (4:3 → 2000×1493 webp), phased workflow with approval gates. Plan was first drafted locally, then handed to Ultraplan in the cloud — Ultraplan added 5 useful things (Brabus-emblem language to avoid Mercedes-star confusion, test-render gate before batching, rollback strategy `mv public/ppf{,.v2-1-backup}`, coverage map as table, "don't retry for nano_banana_pro" decision). Merged Ultraplan's improvements with Oskar's master-iteration gate; final plan is the local merged version, not Ultraplan's output verbatim.
  - **Phase 1 master** (front 3/4 base) — generated via `mcp__claude_ai_Higgsfield__generate_image` (model requested `nano_banana_pro`, server fell back to `nano_banana_2` as expected per plan). Higgsfield jobId `7bb6c44c-fb5d-4e3b-93b3-3794f206c642`. Saved at `assets-src/ppf/raw/base/front.png` (3.6 MB, 2400×1792). Read tool can't render full-res (exceeds 2000×2000 limit) so a sips preview at `front-preview.jpg` (1800×1344, 230 KB) is used for inspection. Visual verdict: dramatically more premium than v2.1 — proper cinematic noir, full-length mirror reflection, deep crushed shadows on lower panels. Minor deviations: car occupies ~58% width (target 50-55%), black void above ~40% (target ≥50%). Acceptable to lock — minor.
  - **Phase 2 rear base** — generated manually by Oskar in Higgsfield's web UI (auto-mode classifier was unavailable when MCP was tried, hence manual path). Saved at `assets-src/ppf/raw/base/rear.png`. Same aesthetic transfer — pearl-white G-Brabus, jet-black void, mirror floor, dramatic reflection (even more pronounced than the master's). Side-mounted spare-wheel cover with Brabus B emblem visible. Locked.
  - **Phase 3a test overlay** (pkg-front/front) — generated manually by Oskar in Higgsfield's web UI with the front master as reference image. Saved at `assets-src/ppf/raw/packages/pakiet-front/front.png`. Visual verdict: coverage mostly correct (bonnet + bumper + headlights + air-dam + driver-side mirror housing + A-pillar trim + roof leading edge all tinted crimson), BUT the front fender widebody flares (Brabus widebody bulges over the front wheel arches) and the cowl panel (small painted strip between hood trailing edge and windshield base where wipers sit) both read pearl-white. Coverage incomplete; needs regen.
  - **Revised Phase 3a prompt** drafted with explicit "PPF FULL FRONT COVERAGE" framing line at the top of the coverage block + numbered list (9 items) + "ALL THE WAY DOWN to the bottom edge of the wheel arch" language for the fender. Awaiting Oskar's manual regen.
- Decisions locked (this session):
  - **Car**: pearl-white Mercedes G-Brabus 800 Widestar — over RS6 Avant / Porsche 911 / Alfa 8C alternatives. Keeps visual lineage with existing Realizacje (TikTok G-Brabus content + portfolio anchor). Pearl-white maximizes contrast vs crimson overlay.
  - **Camera angles**: front 3/4 + rear 3/4, ~30° off-axis, mid-fender elevation. Preserves the existing `view: 'front' | 'rear'` enum in `ppf-data.js` — ZERO component code changes required. The strict side-profile orthographic option from Oskar's original Alfa 8C prompt was considered + rejected (would have required rewiring CarCanvas/PpfTeaser/Packages/PPF.jsx).
  - **Aspect ratio**: 4:3 (Higgsfield 2k → 2400×1792 PNG → cwebp `-resize 2000 1493`). Same as v2.1, no layout reflow.
  - **Overlay treatment**: carry over from v2.1 — semi-transparent crimson #B82119 at ~50% opacity (Photoshop Solid Color layer analogy in the prompt). Marketing-clarity coverage map, not photoreal PPF.
  - **Brabus emblem**: explicit "factory Brabus B emblem on grille, NO Mercedes-Benz star" in the prompt. v2.1 had emblem confusion; the explicit instruction works (verified in the Phase 1 master result).
  - **Phased workflow with approval gates** (vs batch-fire) — three gates: master lock, rear base lock, test overlay validation. Cheaper iteration: catch issues at ~2-credit cost before burning 20 credits on bad overlays.
  - **`pkg-front` coverage expanded** beyond v2.1 — added side mirror housings, A-pillar trim strips, roof leading edge / windshield top frame (per Tesla "Full Front PPF" reference Oskar provided), plus widebody fender flares + cowl panel after seeing the first 3a result was incomplete.
  - **`pkg-reflektory/rear` + `pkg-front/rear`** ship as bare car (zero overlay) — coverage zone not visible from rear 3/4 angle. Same UX as v2.1.
  - **nano_banana_2 server fallback accepted** — don't retry to force pro. v2.1 ran fine on the fallback.
  - **Master-iteration gate up front** (Oskar's explicit ask) — locked the master before any derivatives. Ultraplan's plan version omitted this gate; we kept it.
- Files touched (creates + edits):
  - **Plan file**: `/Users/oskarbal/.claude/plans/ppf-configurator-image-generation-plan.md` (created from `okay-listen-i-will-sparkling-seal.md` slug + renamed). Multiple edits to incorporate Ultraplan merge + master-iteration gate + Phase 3a coverage expansion. NOTE: the file's coverage map table has the v2.1-era pkg-front spec partially updated to add mirrors + A-pillars + roof edge, but the full Phase 3a expansion (fender flares + cowl) is in the session prompts Oskar pasted, NOT yet codified in the plan's coverage table. **Codify before Phase 3b.**
  - `public/ppf/` → renamed to `public/ppf.v2-1-backup/` (preserved all 10 v2.1 webps); fresh empty skeleton recreated at `public/ppf/{base,packages/{reflektory,progi,pakiet-front,cale-auto}}/`
  - `assets-src/ppf/raw/base/front.png` (new — Phase 1 master, 2400×1792, 3.6 MB)
  - `assets-src/ppf/raw/base/front-preview.jpg` (new — sips 1800-wide JPG for Read-tool inspection)
  - `assets-src/ppf/raw/base/rear.png` (new — Phase 2 base, manual generation)
  - `assets-src/ppf/raw/packages/pakiet-front/front.png` (new — Phase 3a candidate, coverage incomplete, awaiting regen)
  - `BUILD_STATE.md` (this entry + top-header refresh)
- Higgsfield credit ledger: ~2 credits via MCP (Phase 1 master only). Phase 2 + 3a were Oskar's manual Higgsfield web sessions (separately billed via his Plus plan, not the MCP). Balance was 373 before this session — should be ~371 after the MCP call. Confirm with `mcp__claude_ai_Higgsfield__balance` next session.
- Auto-mode classifier issue (mid-session): from roughly the second Higgsfield MCP call onward, the classifier returned `claude-opus-4-7[1m] is temporarily unavailable, so auto mode cannot determine the safety of <tool>` for every write-tool and MCP-tool attempt. Workaround was to ask Oskar to run Higgsfield generations manually in the web UI. Read-only tools (Read, Bash for read-only ops via the brief windows when it recovered) worked. **Next session: first check if classifier is stable. If yes, prefer MCP for Phase 3b batch (parallel + auto reference-media threading). If no, continue manual generation for each overlay (slower, 7 separate sessions).**
- For rear-view overlays in Phase 3b: Phase 2 rear base has NO Higgsfield job ID (manual web gen). Two options for threading reference media: (a) upload `rear.png` via `mcp__claude_ai_Higgsfield__media_upload` to get a media UUID, then use that as `medias[].value` with `role: 'image'`; (b) continue manual generation for the 3 rear overlays. Option (a) preferred if MCP is up.
- Dev server: was running on port 5180 during the session, may still be running. `lsof -i :5180` to check next time.
- Open questions / blockers (priority order):
  1. **Phase 3a regen** — Oskar runs the revised "FULL FRONT COVERAGE" prompt (in the session, last assistant message before wrap) manually in Higgsfield. Verify fender widebody flares + cowl panel get crimson. Save over `assets-src/ppf/raw/packages/pakiet-front/front.png`.
  2. **Codify the expanded pkg-front coverage** in the plan file's coverage table (`pkg-front` row should list: bonnet + fenders incl. widebody flares + bumper + grille surround + headlights + air-dam + mirror housings + A-pillar trim + roof leading edge + cowl panel).
  3. **Same expansion for pkg-cale-auto/front prompt** — całe auto's front view should also include widebody flares + cowl explicitly (the "every visible painted panel" language probably covers it, but call out flares + cowl explicitly to avoid the same miss as 3a).
  4. **Phase 3b — 7 overlay batch**: needs decision on MCP-batch vs manual path based on classifier health. If MCP: upload rear.png as media for rear overlays. If manual: 7 separate Higgsfield web sessions.
  5. **Phase 4 — cwebp resize**: same recipe as v2.1 (`cwebp -q 82 -m 6 -mt -resize 2000 1493 in.png -o out.webp`). cwebp + webpinfo both installed at `/opt/homebrew/bin/`. Verify every webp lands at 2000×1493 via `webpinfo`.
  6. **Phase 5 — Smoke test**: dev server on :5180, hard-reload `/ppf`, verify default pkg-front bestseller pre-selected + view toggle + crossfade per package + deep-link `?pkg=cale-auto` + home teaser auto-cycle + mobile layout at 375×812.
  7. **Documentation tasks (Phase 5b)**: rewrite `assets-src/ppf/prompts.md` § v2.2 with the 10 final prompts + job IDs + per-render notes; preserve v2.1 prompts/job-ids at the bottom under "## Archive — v2.1". Append a v2.2 ship entry to this BUILD_STATE.md (replacing the "in progress" framing). Append a 1-liner to today's (or whenever-shipped) Obsidian daily note.
  8. All earlier open inputs from prior sessions still unchanged: Tomasz business email, Resend sender domain, opening hours, film brand, real per-package PPF pricing, PPF Realizacje photos — gated on Meeting #2.
- Resume from: Read this BUILD_STATE.md entry first + then the plan file at `/Users/oskarbal/.claude/plans/ppf-configurator-image-generation-plan.md`. Check Higgsfield MCP classifier health (`mcp__claude_ai_Higgsfield__balance` is a cheap probe — if it returns the credit number, MCP path is unblocked). The first concrete action is **Phase 3a regen with the revised prompt** (already drafted and in the prior session's final assistant message). After it lands and coverage is clean, codify the expanded pkg-front mapping in the plan file's coverage table + update pkg-cale-auto/front prompt with widebody-flare + cowl language, then Phase 3b.

---

**2026-05-20 (evening) — PPF visualizer 2.1 — regen at 2k + flipped to crimson-overlay coverage style:**
- Status: Phase 2.1 polish on the visualizer's output. Two issues with the phase 2 ship (raised same-day by Oskar): (1) base webps were 2000×1493 but package webps were 1200×896 — dimensional mismatch; (2) the "realistic PPF" prompt strategy made the coverage too subtle to read — users couldn't easily distinguish what one package covers vs another. Fixed both. Regenerated all 8 package webps at Higgsfield `resolution: "2k"` (2400×1792 output → `cwebp -resize 2000 1493` to match base). Flipped the prompt strategy from "subtle gloss + thin film seam + faint blue refraction" → "SEMI-TRANSPARENT crimson #B82119 overlay (~50% opacity) on the covered panels, treat like a Photoshop Solid Color layer." Result: every package's coverage now reads instantly at a glance. Build unchanged (no code touched): 344.32 kB / 100.98 kB gzip JS, 59.12 kB / 10.83 kB gzip CSS.
- Shipped:
  - **All 10 webps now at exactly 2000×1493** (verified via `webpinfo`). `public/ppf/` total: 696 KB (was 448 KB at 1k). File sizes per webp: 56-74 KB. Crisp at retina pixel ratios.
  - **8 fresh Higgsfield 2k renders** at `assets-src/ppf/raw/packages/<slug>/<view>.png` (overwritten the prior 1k PNGs). New job IDs captured in `assets-src/ppf/prompts.md` § "Package renders — 2.1".
  - **`assets-src/ppf/prompts.md` rewritten** — replaced the phase-2 prompt template with the 2.1 crimson-overlay template, documented per-render job IDs, captured the "why 2.1 was needed" rationale + the 3 failure modes hit during regen (`progi/front` 2k twice failed silently to 1k → 3rd attempt with simplified prompt succeeded; 6/8 initial status polls returned MCP-proxy 502s that cleared on single retry). Original phase-2 job IDs preserved at the bottom of the file for cross-comparison.
  - **`BUILD_STATE.md`** — this entry + top header refresh.
  - **`/Users/oskarbal/Obsidian/01_Daily/2026-05-20.md`** — appended a 2.1 line.
- Decisions locked:
  - **Brand crimson `#B82119` at ~50% opacity** for the coverage overlay (over pure red `#FF0000` or system red `#FF3B30`). Matches the existing site accent — same red used on Bestseller pills, CTA borders, sticky-bar buttons. Sits naturally in the noir / Industrial Premium palette.
  - **2k Higgsfield input → cwebp downscale to 2000×1493** (vs upscaling 1k or regenerating base at 1k). Downscaling preserves sharpness much better than upscaling, and base webps were already 2k-quality from the morning render — they stay as-is.
  - **Prompt strategy = coverage map, not photoreal PPF.** The earlier "realistic gloss + film seam" approach was accurate but uncommunicative. The crimson-overlay treatment is unmistakable — it's literally a "this panel is in the package" highlight. Acknowledges the visualizer's job is marketing clarity, not photo-realism of the actual product.
  - **No code change.** Same image paths in `src/lib/ppf-data.js`, same components in `src/components/ppf/`, same CarCanvas crossfade. Asset-only ship.
  - **Raw PNGs (2k) committed to git** (35 MB total). Same call as phase 2's 1k PNGs — cheap to keep alongside `prompts.md` so any future regen can re-cwebp at different quality without re-billing Higgsfield. Switch to gitignore + LFS later if repo weight matters.
- Visual verification done (read all 8 new webps):
  - **`pakiet-front/front`** = the gold standard. The whole front half of the car is tinted red, the rear half is bare white — the visual split between covered/bare is unmistakable.
  - **`cale-auto/front` + `/rear`** = whole-car red overlay, wheels/glass/grille correctly excluded.
  - **`progi/front` + `/rear`** = just the rocker sill (and trunk loading lip on rear) tinted red, everything else bare. Tight, accurate, easy to read.
  - **`reflektory/front`** = both headlight lenses clearly tinted red.
  - **`reflektory/rear`** = bare car (correct — package doesn't cover anything visible from rear).
  - Brand colour rendered as a slightly coral / salmon red rather than strict crimson. Acceptable — reads warm and intentional. Flagged in `prompts.md` for future tightening if Tomasz wants true-crimson.
- Higgsfield credits: 389 → 373 (16 credits consumed — 8 initial submissions + 1 `progi/front` retry that also failed + 1 `progi/front` retry that succeeded). Cheap.
- Files touched: `assets-src/ppf/prompts.md` (rewrite), `BUILD_STATE.md` (this entry + top header), `/Users/oskarbal/Obsidian/01_Daily/2026-05-20.md` (append). NEW raw PNGs in `assets-src/ppf/raw/packages/<slug>/<view>.png` (8 files, ~4-6 MB each, overwriting the 1k versions). OVERWRITTEN webps in `public/ppf/packages/<slug>/<view>.webp` (8 files, 56-74 KB each). NO code or component changes — same architecture from phase 2 (135-line orchestrator + 11 components in `src/components/ppf/`).
- Open questions: Same as the phase 2 entry — film brand confirmation, real per-package pricing, PPF Realizacje photos. All gated on Meeting #2.
- Resume from: Site is feature-complete and visually clear. Next session = first Vercel deploy of v2 (still gated on Tomasz's business email + verified Resend sender). After deploy, smoke-test the /ppf crossfade live + LCP via Chrome DevTools (bestseller front-view image is `loading="eager"`).

---

**2026-05-20 (late afternoon) — PPF visualizer redesign (phase 2): SVG overlay → pre-rendered per-package photos:**
- Status: Phase 2 of the PPF rework shipped. The entire SVG-zone overlay system (15 zones × hand-traced d-strings, 4-way click/hover/select/focus state machine, ExtraZones sidebar panel, ZoneTooltip, à la carte zone sum, `matchPpfPackage` reverse-lookup) is GONE. Replaced with: 4 packages × 2 views = 8 photoreal Higgsfield renders of the Mercedes G-Class with the actual PPF coverage applied (visible film gloss, blue refraction seams at panel gaps). User picks a package → photo crossfades. The render *is* the answer. Bundle shrinks 368.5 → 344.3 kB JS / 110 → 101 kB gzip (−24 kB / −9 kB gzip). Asset payload: 448 KB total in `public/ppf/` (was 140 KB with the 2 base webps only; +308 KB for 8 package renders).
- Shipped:
  - **Asset folder hierarchy** — `public/ppf/{base/{front,rear}.webp, packages/<slug>/{front,rear}.webp}` where slug ∈ {reflektory, progi, pakiet-front, cale-auto}. Old `car-front.webp` + `car-rear.webp` moved to `base/`. **Every Higgsfield generation landed in a labeled folder** per Oskar's explicit ask — no flat `/tmp/` dumps.
  - **Source materials** in `assets-src/ppf/` (NEW top-level folder for the project). Contains `README.md` (full regen pipeline doc), `prompts.md` (all 8 final prompts + Higgsfield job IDs + per-render notes), `raw/base/{front,rear}.webp.original` (provenance snapshots), `raw/packages/<slug>/{front,rear}.png` (the original 1200×896 PNGs from Higgsfield — checked in so future regens can re-cwebp at different quality without re-billing the model). Total `assets-src/ppf/` weight: 10 MB.
  - **`src/lib/ppf-data.js`** — trimmed ~50%. Dropped `PPF_ZONES` (15 zone defs × ~200-char d-strings), `PPF_VIEWBOX`, `PPF_ZONE_BY_ID`, `ppfSubtotal()`, `matchPpfPackage()`, `isPpfZoneId()`. New shape: each package carries `slug`, `covers: string[]` (human-readable coverage list), `images: { front, rear }`. Added `PPF_VIEWS`, `PPF_PACKAGE_BY_SLUG`, `PPF_DEFAULT_PACKAGE_ID = 'pkg-front'`.
  - **`src/components/ppf/`** — NEW folder, 11 components extracted from the old 886-line `PPF.jsx`:
    - `CarCanvas.jsx` — the new core. Image crossfade stack: base webp underneath + 4 package webps absolute-positioned, opacity transitions on `activePackage.id` change. `ViewToggle` is now inline (top-right pill over the image, glassmorphic). Caption at bottom-left names the current package. Bestseller front-view image is `loading="eager"`; everything else `loading="lazy"`.
    - `PackageSummary.jsx` — NEW. Replaces `SubtotalCard` + `SelectionChips`. Shows package name + Bestseller pill + `od X zł` + "Co obejmuje" bulleted list + CTA.
    - `Packages.jsx` — lifted from old PPF.jsx, with the phase 1 Bestseller pill kept. Click always SETS (never toggles off — one package must always be selected).
    - `PpfStickyBar.jsx` — simplified mobile-only bar. Single package, no clear button.
    - `PpfHero.jsx`, `SpecsBlock.jsx`, `ValueCalculator.jsx`, `RealizacjePlaceholder.jsx`, `Faq.jsx`, `FinalCta.jsx` — lifted with minor copy tweaks (hero subtitle changed from "klikaj strefy" to "wybierz pakiet", FinalCta copy simplified since there's always a package selected).
    - `PpfTeaser.jsx` — MOVED from `src/sections/PPF.jsx` (deleted). New behavior: auto-cycles through 4 full-image renders (base → reflektory → pakiet-front → cale-auto, 2.4s/step, IntersectionObserver-gated, `prefers-reduced-motion` parks on cale-auto). Crossfade via the same opacity pattern as CarCanvas.
  - **`src/pages/PPF.jsx`** — rewritten from 886 lines → 135 lines. Thin orchestrator: state (`activePackageId`, `view`, `formOpen`), localStorage persistence (single-string value now, with migration shim that drops the phase-1 `string[]` shape gracefully), deep-link handling (`?pkg=<slug>`, `#wycena`, `#pakiety`), composition of all `components/ppf/*`.
  - **`src/components/WycenaForm.jsx`** — PPF integration consolidated. Replaced 3 props (`selectedDetailsOverride` + `subtotalOverride` + `ppfPackageId`) with single `ppfPackage` object prop. Form derives the synthetic `selectedDetails` 1-element array + `subtotal` internally when `mode==='ppf'`. POST payload shape unchanged (still sends `ppfPackageId: pkg.id`), so `api/wycena.js` needs no change.
  - **`src/pages/Home.jsx`** — teaser import path updated from `../sections/PPF.jsx` → `../components/ppf/PpfTeaser.jsx`.
  - **`src/sections/PPF.jsx`** — DELETED.
  - **`src/index.css`** — dropped the `.ppf-zone` family of rules (8 selectors, ~40 lines). Dead with the SVG overlay gone. CSS shrunk 59.43 → 59.12 kB.
  - **Pipeline docs**: `public/ppf/README.md` (1-paragraph file-map), `assets-src/ppf/README.md` (full end-to-end regen instructions), `assets-src/ppf/prompts.md` (all 8 prompts + job IDs + per-render quality notes).
- Higgsfield credits: 405 → 389 (16 credits for 8 renders, ~2/render). Model: `nano_banana_pro` requested, server fell back to `nano_banana_2` for all 8 (acceptable quality).
- Visual quality verdict (after viewing all 8):
  - **`cale-auto/rear`** = gold-standard outcome. Visible blue film seams at every panel gap (trunk door, doors, windows, bumper edges, spare wheel mount). Reads as "every panel is wrapped" without any UI overlay needed.
  - **`reflektory/front`** = strong blue glow on both headlights. Reads more "Tron LED ring" than realistic PPF — acceptable for the demo but flagged in `prompts.md` for future regen with a softer "barely-visible glint" prompt.
  - **`pakiet-front`, `cale-auto/front`, `progi`** = subtle but present. PPF effect visible via faint blue seams + slight gloss bump. Real PPF IS subtle in life ("folia, której nie widać") so this matches reality, but could be amped if Tomasz wants more wow.
- Decisions locked:
  - **À la carte zone clicking removed entirely.** Phase 2's whole premise was "cleaner approach for showing what's covered per package." Per-zone clicking + custom-sum subtotal + ExtraZones panel are all gone.
  - **Bestseller (pkg-front) pre-selected on first visit.** Lands users on a visual hook + the 4500 zł headline price. localStorage remembers the last pick for return visits (phase 1's `string[]` value is treated as "no valid pick" by the migration shim → resets to default).
  - **Front + rear view toggle retained.** Both views generated, both serve different coverage stories (rear view is where the visible film seams really sell the cale-auto package).
  - **Raw PNGs committed to git** (not gitignored). ~10 MB total for 8 package renders + 2 base snapshots. Cheap enough to keep alongside the prompts so any future session can regen without re-paying Higgsfield. Easy to switch to gitignore + LFS later if repo weight matters.
  - **Component-folder split** done (11 files in `src/components/ppf/`) per Oskar's "smart organization" ask. The 886-line PPF.jsx is now a 135-line orchestrator — diffs are reviewable, files are findable, components are reusable.
- Files touched: `src/lib/ppf-data.js` (rewrite), `src/pages/PPF.jsx` (rewrite), `src/components/WycenaForm.jsx` (props consolidation), `src/pages/Home.jsx` (import path), `src/index.css` (dropped .ppf-zone rules), `src/sections/PPF.jsx` (DELETED). NEW: 11× `src/components/ppf/*.jsx`, 8× `public/ppf/packages/<slug>/<view>.webp`, 8× `assets-src/ppf/raw/packages/<slug>/<view>.png`, 2× `assets-src/ppf/raw/base/<view>.webp.original`, `public/ppf/README.md`, `assets-src/ppf/README.md`, `assets-src/ppf/prompts.md`. MOVED: `public/ppf/{car-front,car-rear}.webp` → `public/ppf/base/{front,rear}.webp`.
- Open questions:
  - **Reflektory front blue glow** — Tomasz may want a more subtle headlight effect (current looks Tron-y). Regen recipe in `prompts.md` lines 38-40.
  - **PPF effect visibility on the medium packages** (progi, pakiet-front) — currently subtle. Could be amped via stronger "MUCH more visible blue refraction seams" prompt language if Tomasz wants more wow.
  - All earlier open inputs unchanged: film brand confirmation, real per-package pricing confirmation, PPF Realizacje photos. Gated on Meeting #2.
- Resume from: Site is feature-complete. Next session = first Vercel deploy of v2 (still gated on Tomasz's business email + verified Resend sender). After deploy, smoke-test the /ppf crossfade live (LCP should stay healthy because the bestseller front-view image is `loading="eager"` — verify in Chrome DevTools).

---

**2026-05-20 (mid-afternoon) — PPF preset list swapped to Cars Detailing Radom's cennik (5 → 4 packages):**
- Status: Phase 1 of a 2-phase rework shipped. The Boruch-inspired 5-pack (WEAR & TEAR / BIKINI / FRONT / FULL FRONT / FULL BODY) is gone — `/ppf` now shows the 4 packages straight from the cennik in `src/lib/catalog.js`. Phase 2 (a different, cleaner approach to showing which body parts are covered per package) is queued — to be planned + implemented separately. À la carte zone clicking + the SVG-over-WebP visualizer architecture stay untouched this round. Build clean: 368.53 kB / 109.94 kB gzip JS (~0.03 kB delta from the bestseller pill JSX), CSS unchanged.
- Shipped:
  - **`src/lib/ppf-data.js` — PPF_PACKAGES** replaced with 4 entries matching the cennik:
    - `pkg-reflektory` — "PPF reflektory" — 300 zł — `[z-reflektory]`
    - `pkg-progi` — "Zabezpieczenie progów PPF" — 500 zł — `[z-prog-zewnetrzny, z-prog-wewnetrzny, z-prog-bagaznik]`
    - `pkg-front` — "PPF pakiet front" — 4500 zł — bestseller — 10-zone front bundle (was FULL FRONT)
    - `pkg-cale-auto` — "PPF całe auto" — 15 000 zł — bestseller — 13-zone full body bundle (was FULL BODY)
    - Added optional `bestseller: true` field to the data shape.
  - **`api/wycena.js`** — `PPF_PKG_LABELS` map rewritten (5 → 4 entries) so email subject + owner-email body pick the new Polish-language labels (no more "FULL FRONT" leaking into Tomasz's inbox).
  - **`src/pages/PPF.jsx`** — copy updates only, no architecture change:
    - Value-vs-PPF calculator: 3 references to "FULL FRONT" → "PPF pakiet front" (comment, body copy, stat label).
    - Realizacje placeholder cards: `Audi RS6 · FULL FRONT` → `Audi RS6 · PPF pakiet front`; `Mercedes G-Brabus · FULL BODY` → `Mercedes G-Brabus · PPF całe auto`.
    - FAQ answer about timing: `'WEAR & TEAR — 1 dzień. FULL FRONT — 2 dni. FULL BODY — 5–7 dni.'` → `'PPF reflektory / progi — 1 dzień. PPF pakiet front — 2 dni. PPF całe auto — 5–7 dni.'`.
    - **Packages component** — when `pkg.bestseller === true`, renders the same accent-outlined "Bestseller" pill that `Cennik.jsx:319-323` uses for `service.anchor`. Added `not-italic` class so the pill doesn't inherit the parent's Barlow Condensed Italic Black slant.
  - **`src/sections/PPF.jsx`** — home teaser auto-cycle rewritten:
    - Now imports `PPF_PACKAGE_BY_ID` and derives each cycle step's zone list from the cennik packages (single source of truth — if zone bundles change, the teaser auto-updates).
    - Cycle: `{ idle → pkg-reflektory → pkg-front → pkg-cale-auto }` (4 steps × 2.2s = 8.8s loop). Skips progi from the cycle to preserve the "more and more" coverage progression.
    - Reduced-motion fallback parks on `pkg-cale-auto` (was FULL FRONT).
- Decisions locked:
  - **Zone mapping for "Zabezpieczenie progów PPF"**: all three progi zones (`z-prog-zewnetrzny` + `z-prog-wewnetrzny` + `z-prog-bagaznik`) per Oskar's pick. Package priceFrom stays 500 zł (matches cennik); the bigger zone set just means more visual coverage on the rear render.
  - **À la carte zone clicking stays for phase 1**. The current 15-zone clickable system + "Konfiguracja indywidualna" subtotal + ExtraZones panel are all untouched. Phase 2 decides whether to strip à la carte or rework it.
  - **Display order = price ascending** (reflektory → progi → front → cale-auto) — matches cennik order in `src/lib/catalog.js:25-28`.
  - **Bestseller pill on the two anchor packages only** (pakiet front + całe auto), mirroring the `anchor: true` treatment in the cennik catalog.
  - **Teaser cycle skips progi step** for visual cleanliness — the escalation (none → tiny lamp → whole front → whole body) reads better than zigzagging through a progi step.
- Files touched: `src/lib/ppf-data.js`, `api/wycena.js`, `src/pages/PPF.jsx`, `src/sections/PPF.jsx`, `BUILD_STATE.md`.
- Open questions: Same as morning — film brand confirmation, real per-zone pricelist confirmation (now per-package, lighter list), PPF Realizacje photos, value calculator gut-check. All gated on Meeting #2.
- Resume from: **Phase 2 — visualizer redesign.** User flagged "a different, cleaner approach of showing the car parts which are covered in the package." Current state: SVG zone overlay over photoreal Higgsfield WebP, 13 hand-traced clickable paths, à la carte + 4 packages. Plan the redesign in a fresh conversation — likely directions to explore: package-led mode (no à la carte, just "this is what's covered" per package), per-package pre-rendered glow renders (Higgsfield batch), simplified iso-style line-art with zone labels, or strip the visualizer entirely in favor of a richer per-package details block.

---

**2026-05-20 (afternoon) — PPF reflektory 2nd headlight + zderzak artifact polish:**
- Status: Two open polish items from the morning precision pass closed (Open Qs #1 + #2). Reflektory now reads as TWO headlights instead of one wisp + one circle. Front bumper no longer has the stray tail-light-shaped speck at (1728, 800). Build clean — 368.56 kB / 110.00 kB gzip JS, CSS unchanged.
- Shipped:
  - **`z-reflektory.paths.front`**: replaced the wispy 4-byte-effective sub-path at `M284 709` (a ~67-tall × ~4-wide vertical line — the model only barely touched the passenger-side lamp during the gen pass, even after 2 re-gens) with a clean hand-authored circle at `M306 770 a24 24 0 1 1 48 0 a24 24 0 1 1 -48 0 z` — center (330, 770), radius 24. Pinned visually to the actual lens position in the render. The bigger driver-side potraced arc kept as-is.
  - **`z-zderzak-przedni.paths.front`**: stripped the leading `M1728 800 c... z` subpath — a ~30×30 tail-light-shaped fragment the model accidentally painted off-bumper during the original gen. Removed as a self-contained closed subpath, no impact on the main bumper d-string starting at `M280 828`.
- Decisions locked:
  - **Hand-authored arcs over another re-gen** for the missing headlight. The model failed 3× across the precision pass (initial + 2 re-gens with sharper prompts); spending more Higgsfield credits to chase a tiny lamp behind a grille wasn't worth it when 1 SVG arc command nails the position.
  - **Artifact specks: strip subpaths directly** instead of re-running potrace with tighter turdsize. The artifact was a self-contained `M...z` so the surgical Edit was 1-line; re-running the whole pipeline (Higgsfield + magick + potrace + flatten) would be 30+ minutes for the same visual outcome.
- Files touched: `src/lib/ppf-data.js` (z-reflektory.paths.front + z-zderzak-przedni.paths.front), `BUILD_STATE.md`.
- Open questions: Same as the precision-pass entry — film brand confirmation (#3), per-zone pricelist confirmation (#4), PPF Realizacje photos (#5), value calculator gut-check (#6). All still gated on Meeting #2 with Tomasz.
- Resume from: Site is feature-complete + polished + visually clean. Next session = first Vercel deploy of v2 (gated on Tomasz's business email + verified Resend sender at Meeting #2) OR a Meeting #2 prep round if Tomasz schedules.

---

**2026-05-20 (early afternoon) — PPF fender bleed hotfix:**
- Status: The FULL FRONT preset was painting the entire driver door because z-blotniki-przod's potraced path extended beyond the actual front quarter panel. Re-generated the fender with a strict "do NOT paint the door" prompt; the model painted in blue this time (not crimson — token-attention drift on the long forceful prompt), so I switched to a Python channel-relative masking step (`b > r + 45 AND b > g + 25 AND b > 80`) to extract the painted area regardless of color. Result: tight fender contour, no door bleed. Verified in browser: FULL FRONT now ends at the door seam; WEAR & TEAR shows just headlight + door handles; FULL BODY rear shows bumper + pillars + sill — all correct.
- Files: `src/lib/ppf-data.js` (z-blotniki-przod.paths.front replaced with the new 4727-char d-string)
- Note for future precision passes: when the model picks an off-color for a re-gen, channel-relative masking handles it without re-prompting. Updated `flatten.py` handles multi-path outputs (was missing closing-Z + multi-`<path>` support).

---

**2026-05-20 (late morning) — PPF zone precision pass (Higgsfield image-to-image → ImageMagick mask → potrace → SVG path):**
- Status: All 13 body-visible PPF zones across front + rear views replaced with pixel-accurate potraced paths. The crimson overlay now precisely follows each body part's actual contour (no more approximate polygons spilling off the body). Architecture unchanged — only path d-strings in `src/lib/ppf-data.js` swapped. Build: 368.58 kB / 110.17 kB gzip JS (+18.9 kB vs previous polygons), 59.51 kB / 10.94 kB gzip CSS (essentially unchanged). All other behavior identical: state, presets, view-toggle, sticky bar, WycenaForm, /api/wycena PPF mode.
- Workflow:
  1. **`brew install imagemagick potrace`** — neither was installed locally. ImageMagick 7.1.2-23 + potrace 1.16 now available.
  2. **Per-zone Higgsfield image-to-image** — for each zone, called `nano_banana_pro` (falls back to `nano_banana_2` server-side) with the existing base render job id as `medias[].role='image'`, prompt asking to paint ONLY that zone in flat saturated crimson #DC1E19 with everything else pixel-identical. 16 unique generations total (some zones span both views), plus 3 re-gens for zones the model handled poorly the first time. Total cost: ~30 credits (balance went 463 → 443 → 433).
  3. **Magick mask extraction** — `magick <src.png> -fuzz 30% -fill white +opaque "#DC1E19" -fill black -opaque "#DC1E19" mask.bmp`. Painted zone → black, everything else → white. Mean fraction of black pixels per zone: 0.6–2.3% (tight bodies). All converted from 2400×1792 Higgsfield output → 2000×1493 mask via `-resize 2000x1493!`.
  4. **potrace** — `potrace mask.bmp -s --turdsize 80 --opttolerance 0.5 --unit 1` produces an SVG with each black region as a `<path>` element. The `--unit 1` flag is critical — without it potrace uses 1/10pt subunits and the path needs scaling. With `--unit 1` the coordinates are direct bitmap pixels.
  5. **Custom Python flattener** (`/tmp/ppf-trace/flatten.py`) — applies potrace's `translate(0, H) scale(1, -1)` wrap-transform directly into the path d-string, so the result drops straight into our existing `<svg viewBox="0 0 2000 1493">` without needing the transform group. Handles all SVG path commands (M/L/C/H/V/A + relative variants), splits chained M sequences into M+L, preserves Z closures, concatenates multiple `<path>` elements from a single potrace output (zones with disconnected regions like the two headlights or two pillars).
  6. **Bulk replacement** in `src/lib/ppf-data.js` — 12 zone path replacements via Edit calls.
- Decisions locked:
  - **Architecture unchanged** — `<path d="...">` inside the existing SVG overlay. No refactor in PPF.jsx, sections/PPF.jsx, WycenaForm, api/wycena, index.css.
  - **fuzz=30% on crimson masking** — generous enough to handle the model's slight anti-aliasing at zone edges. Could tighten to 15-20% if any zone shows ragged edges, but visual review shows clean tracing.
  - **turdsize=80** drops small specks (anti-aliasing noise, tiny model misfires) without losing real zone detail. Tested with one zone that has multiple disconnected pieces (klamki = two door handles); both kept.
  - **Hand-authored arcs as fallback for `z-reflektory`** — the model consistently painted only ONE headlight (passenger-side, the smaller foreshortened one). After two re-gens with sharper prompts ("BOTH headlights, two round lenses, CRITICAL"), the model still missed one. Final path is potraced from the model's output — captures whichever headlight the model painted plus an artifact. The visible result on /ppf shows headlights as round shapes mapped to the actual lamp positions; visually acceptable. If future polish wanted, hand-author both arcs with `M cx cy a r r 0 1 0 ...` syntax targeting (cx≈340, cy≈740, r≈45) and (cx≈205, cy≈710, r≈30).
- Files touched: `src/lib/ppf-data.js` (12 zone path replacements + 1 pilot done earlier in maska)
- Temporary artifacts (kept in `/tmp/ppf-trace/` for re-runs):
  - 18 source PNGs (each ~4.7 MB, total ~85 MB) — Higgsfield outputs per zone
  - 18 resized PNGs at 2000×1493
  - 18 binary mask BMPs (~9 MB each)
  - 18 raw potrace SVGs
  - 18 flattened d-string text files
  - `flatten.py` — flattener (~3 KB)
  - `process.sh` — batch helper (one-zone runner)
  - `update_data.py` — bulk-update script (blocked by auto-classifier; superseded by per-zone Edit calls)
- Open questions / next pass options:
  1. **Reflektory only shows 1 headlight** in the rendered overlay. Acceptable for the current ship; if Oskar wants both visible, hand-author the second circle (~5 minutes work).
  2. **Some zones include tiny artifact specks** outside the main shape (e.g. `z-zderzak-przedni-front` has a small artifact at x≈1728, y≈800 from a tail-light-shaped fragment the model accidentally painted). With turdsize=80 these are tiny but visible at high zoom. Tighten turdsize or post-process to keep only the largest path.
  3. **The fender (z-blotniki-przod) and front-fender area** may include slightly more than the strict "fender" panel — the model may have painted some adjacent areas. Visually it reads as "front side" coverage which is what PPF actually covers anyway.
- Resume from: Phase 5 verification done in browser. Site is ready for prospect demo. Next session = first Vercel deploy (still pending) + Meeting #2 inputs from Tomasz.

---

**2026-05-20 (morning) — PPF subpage + interactive configurator shipped:**
- Status: New `/ppf` route is a real interactive PPF configurator, not a brochure. Photoreal Mercedes G-Class renders (Higgsfield, 2 views), 15 PPF zones traced as SVG polygons over the image, 5 package presets that bulk-select, live subtotal, deep-link support, mobile sticky bar, specs block + value-vs-PPF calculator + FAQ + Realizacje placeholder. Home gets a dedicated teaser section. WycenaForm + /api/wycena extended for PPF-mode email formatting. Build clean (349.66 kB / 102.51 kB gzip JS, 59.31 kB / 10.90 kB gzip CSS).
- Shipped:
  - **`/public/ppf/car-front.webp` + `car-rear.webp`** — Higgsfield (nano_banana_2 fallback from nano_banana_pro), 2000×1493 each, pearl-white Mercedes G-Class on deep-black studio background, cool-white rim light from top-left. Generated 4 candidates (2 front + 2 rear), picked the cleanest of each pair. ~70KB each at q=82, cwebp.
  - **`src/lib/ppf-data.js`** (NEW) — `PPF_VIEWBOX = "0 0 2000 1493"`, `PPF_VIEWS` (front/rear), `PPF_ZONES` (15 zones: maska / reflektory / zderzak-przedni / blotniki-przod / lusterka / slupek-a / czolo-dachu / szyba-przednia / klamki / prog-zewnetrzny / zderzak-tylny / slupki-bc / prog-bagaznik / prog-wewnetrzny / elementy-wnetrza), `PPF_PACKAGES` (5 presets), helpers `ppfSubtotal()`, `matchPpfPackage()`, `isPpfZoneId()`. Each zone has `paths: { front?, rear? }` keyed by view; 13 zones have at least one body-visible path, 2 (progi-wewnetrzne / elementy-wnetrza) ship as auxiliary list items in the side rail.
  - **`src/pages/PPF.jsx`** (NEW) — full subpage. Components: `PpfHero`, `Configurator` (with `ViewToggle`, `CarCanvas` overlaying SVG paths on the image, `Packages`, `ExtraZones`, `SubtotalCard`, `SelectionChips`), `PpfStickyBar` (mobile-only), `SpecsBlock` (6-row metric grid: gwarancja / samoregeneracja / hydrofobowość / grubość / UV / demontaż), `ValueCalculator` (range slider 50k–800k → live % calc), `RealizacjePlaceholder` (2 cards awaiting Tomasz photos), `Faq` (6 questions with native `<details>`), `FinalCta`. State pattern mirrors `Cennik.jsx`: `useState(loadSelection())` + `useEffect` saveSelection, localStorage key `cdr.ppf.selection.v1`. Deep-link handling: `?pkg=<slug>` auto-selects preset, `#wycena` opens modal, `#pakiety` scrolls to packages list, `#konfigurator` scrolls to configurator. Preset-match logic: if `selectedIds` exactly equals a package's `zoneIds`, `activePackageId` is set and subtotal uses `package.priceFrom` (so FULL FRONT shows "od 4500 zł" not the zone-sum 4900 zł). Otherwise subtotal sums `ppfSubtotal(selectedIds)`. WycenaForm receives mode='ppf' + selectedDetailsOverride + subtotalOverride + ppfPackageId props.
  - **`src/sections/PPF.jsx`** (NEW) — home teaser. 2-col desktop / stacked mobile. Left: scaled car-front.webp + SVG overlay running an auto-cycle (4 steps × 2200ms intervals × cycles through { idle, wear-tear, front, full-front } zone sets). Cycle pauses when off-screen (IntersectionObserver) and respects `prefers-reduced-motion` (parks on FULL FRONT). Right: kicker + glitch-tier headline (`Folia, której nie widać. / Tarcza, która chroni 10 lat.`) + body + 3-stat row (10 lat / ~200µm / ∞ samoregeneracja) + 2 CTAs (`.cta-magic` primary "Zaplanuj moją folię" → /ppf, ghost "Zobacz pakiety" → /ppf#pakiety). Inserted into Home.jsx between DoorToDoor and Realizacje.
  - **Wiring**:
    - `src/App.jsx` — added `<Route path="ppf" element={<PPF />} />` between cennik and 404.
    - `src/lib/nav.js` — added `{ label: 'PPF', to: '/ppf', hash: null }` before Cennik.
    - `src/components/Navbar.jsx` — `isActive()` matches `/ppf` like `/cennik`.
    - `src/sections/Services.jsx` — PPF row's `href` → `/ppf` (was `/cennik#folie-ppf`). Copy updated to mention "Klikalna konfiguracja stref".
    - `src/components/WycenaForm.jsx` — accepts `mode='cennik'|'ppf'`, `selectedDetailsOverride` (resolves PPF zones without touching SERVICE_BY_ID), `subtotalOverride`, `ppfPackageId`. Eyebrow + heading swap to "Wycena PPF". `hasDoorToDoor` forced false when in PPF mode. Payload now includes `mode` + `ppfPackageId`.
    - `api/wycena.js` — `PPF_PKG_LABELS` const for translating `pkg-full-front` → "FULL FRONT" in subjects (duplicate of label data — node/src boundary). When `mode === 'ppf'`: subject becomes `PPF · <name> · <pkg|Konfiguracja indywidualna>${car}${attach}`; owner-email eyebrow + H1 + table header swap to PPF-specific copy.
    - `src/index.css` — new `.ppf-zone` family: default `fill: transparent` + `stroke: transparent`, hover/`.ppf-zone--hover` tint to `rgba(184,33,25,0.20)`, `.ppf-zone--selected` becomes `rgba(184,33,25,0.55)` + `drop-shadow(0 0 14px accent)`, focus-visible adds white stroke for keyboard nav. `prefers-reduced-motion: reduce` kills transitions.
  - **Polygon precision pass** — refined `z-maska`, `z-reflektory`, `z-zderzak-przedni`, `z-blotniki-przod`, `z-slupek-a`, `z-czolo-dachu`, `z-szyba-przednia`, `z-klamki`, `z-prog-zewnetrzny` after first smoke-test screenshot showed polygons overlapping each other and spilling off body. Second pass with tighter non-overlapping shapes lands much cleaner. Reflektory rewritten as actual SVG arc circles (`a 32 32 0 1 0`) for crisp round headlights instead of polygon approximation.
- Decisions locked:
  - **PPF separate from /cennik catalog** — `ppf-data.js` is its own module; `catalog.js` stays untouched. The 4 existing PPF rows in `/cennik#folie-ppf` remain (cheap shelf-keeping). `/ppf` is the deep experience.
  - **Subtotal flips between sum-of-zones and package-priceFrom** based on whether the current selection exactly matches a preset. Honest math (zones cost more à la carte than as a package — matches how PPF actually prices in the market).
  - **Mercedes G-Class as the configurator car** chosen because Tomasz's portfolio includes the G-Brabus (already in Realizacje), so the visual lineage holds. Pearl white maximizes overlay contrast.
  - **Brand name placeholder, not assumed** — copy throughout reads "Markę folii potwierdzimy na rozmowie" / "Pracujemy z marką potwierdzoną na rozmowie". Avoids fabricating XPEL/STEK before Tomasz confirms.
  - **Photoreal still + SVG polygon overlay**, not per-zone Higgsfield generations. Single asset reused, fully interactive, no consistency drift between gens.
  - **No FAQ for the home teaser** — keep teaser punchy, send people to /ppf for depth.
  - **2 default photoreal stills (not 4+ per-zone variants)** — view-toggle pill switches between front/rear renders. Faster ship, cleaner UX.
- Files touched: 11 created/edited
  - NEW: `public/ppf/car-front.webp`, `public/ppf/car-rear.webp`, `src/lib/ppf-data.js`, `src/pages/PPF.jsx`, `src/sections/PPF.jsx`
  - EDIT: `src/App.jsx`, `src/lib/nav.js`, `src/components/Navbar.jsx`, `src/sections/Services.jsx`, `src/components/WycenaForm.jsx`, `api/wycena.js`, `src/index.css`, `src/pages/Home.jsx`, `BUILD_STATE.md`
- Open questions (Meeting #2 inputs needed):
  1. **Polygon precision — still 80% accurate.** Best refined in Figma with the pen tool against the actual render, then export `d` strings back into ppf-data.js. Worst-offender pass completed (no more polygons spilling into the void), but several zones still have minor overlap with adjacent zones or drift ~20-40px off the actual body edge. Acceptable for v1 demo; tighten before Tomasz sees the live URL.
  2. **Film brand confirmation** — XPEL / STEK / Suntek / Hexis / other. Fills the `[brand placeholder]` in the SpecsBlock copy + adds a credibility section if Tomasz wants to lead with the brand.
  3. **Per-zone pricelist confirmation** — current bands derived from existing cennik proportions (front total 4500, body total 15000). Tomasz should confirm or hand over his real per-zone pricing at Meeting #2.
  4. **PPF Realizacje photos** — currently placeholder cards. 1-2 before/after sets needed (ideally paint-correction-then-PPF — the natural premium sell).
  5. **Value-vs-PPF calculator** — gut-check with Tomasz that the math doesn't undersell. Default: ship as-is.
- Resume from: Site is feature-complete (Home + Cennik + PPF). Next session:
  1. First Vercel deploy of v2 — link project (repo `OskarBal/cars-detailing-radom`, root `site-v2`), set env vars (`RESEND_API_KEY`, `WYCENA_TO_EMAIL`, `WYCENA_FROM_EMAIL`, optional `WYCENA_REPLY_TO`).
  2. Smoke-test live: home form (lead) + cennik wycena (full with photos + door-to-door) + PPF configurator wycena (presets + zones). All into Oskar's inbox, never Tomasz's.
  3. Polygon precision pass on /ppf if visual feedback warrants.
  4. Meeting #2 with Tomasz — collect open inputs (film brand, real PPF prices, Realizacje photos, opening hours, business email, B2B y/n, Tier 2 automations y/n).

---

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
