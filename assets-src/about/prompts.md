# About / O nas — image prompts + job IDs

Pattern parallels `assets-src/ppf/prompts.md` — every shipped about/team image in `public/about/` should have a row here with the prompt that built it + the Higgsfield jobId for re-display via `mcp__claude_ai_Higgsfield__job_display`.

## Zespół hero — three detailers + G63 AMG, backs to camera, real studio (2026-05-21)

**Use case:** About / O nas section hero shot. 16:9 landscape, centered, no copy void.

**Crew composition (locked):**
- LEFT: muscular bald adult man, ~30, broad shoulders + biceps. Holds Rupes BigFoot DA polisher at hip-level.
- CENTER: middle-aged man, ~42, neatly cut short dark brown hair (no cap). Holds detailing spray bottle.
- RIGHT: lean 18yo, **short "flow" haircut + wire-frame glasses**, holds folded microfiber towel + foam applicator pad.

**Car:** Stock 2024 Mercedes-AMG G63 (W463A), factory Obsidian Black metallic. NO Brabus markings.

**Setting:** Real Cars Detailing Radom studio — white painted brick walls, **red ribbed interlocking floor tiles**, red rolling tool cart on the left wall, detail-product bottles hanging from wall hooks, industrial overhead fluorescent + LED lighting, exposed wall conduit. Matches the reference photo Oskar provided showing the actual workshop (BMW X7 was the reference subject, but the SETTING is what was sampled). NOT the cinematic noir void — premium-but-honest workshop.

**Lighting:** Workshop fluorescent + cool LED overhead, even illumination with strong specular highlights raking across the G63's roof + fenders. Cool color temperature (5500-6000K). NO warm yellow/orange anywhere.

**T-shirts:** Black fitted crew-neck, cursive "Cars Detailing Radom" wordmark across upper back in cream/off-white. All three identical.

### Generation log

| Output | Job ID | Resolution | Notes |
| --- | --- | --- | --- |
| `assets-src/about/raw/zespol-hero-v1.png` | `e66cd07e-b041-4674-83b7-4bc2f070da48` | 1k (1376×768) | Composition validation gate. Server fell back `nano_banana_pro` → `nano_banana_2` (expected). Verdict: pass — crew + uniforms + studio all read correctly. |
| `assets-src/about/raw/zespol-hero-v2-2k.png` | `404ecf42-d53b-4d8a-925f-f9e6ba79acd9` | 2k (2752×1536) | **SHIPPED.** Same prompt at 2k. Sharper text on backs, sharper floor tiles, every brick texture visible. Re-encoded via `sips -s format png` (per `feedback_cwebp_higgsfield_libpng.md`) → `cwebp -q 82 -m 6 -mt -resize 1920 1080` → 247 KB final at `public/about/zespol-hero.webp`. |

### Submitted prompt (v1 + v2 identical — only resolution changed)

```
PHOTOREAL DOCUMENTARY-STYLE STUDIO PHOTOGRAPH, hyperrealistic editorial cinematic style, 16:9 landscape composition, centered framing.

A stock 2024 Mercedes-AMG G63 (G-Class W463A) in factory Obsidian Black metallic paint, parked inside a real working auto-detailing studio. Standard AMG specification: factory Mercedes three-pointed star centered on the vertical slatted grille (NO Brabus emblem, NO Brabus widebody flares, NO Brabus B logo, NO aftermarket badging), factory AMG 22-inch cross-spoke wheels in matte black, factory chrome side-exit quad exhaust, square production fender lines, classic G-wagen stance with stock production ride height. The car is shown at a slight 3/4 angle from the front-driver-side, occupying the upper-right two-thirds of the frame, mid-ground depth, parked square on the workshop floor.

In the foreground, lower-center of the frame, three men stand shoulder-to-shoulder facing the car, BACKS FULLY TO THE CAMERA — no faces, no profiles, no side glances. All three are framed from the upper thighs up to just above the head, taking up the bottom 55% of the frame.

LEFT FIGURE: muscular adult man, ~30 years old, completely bald shaved head (clean scalp, slight 5 o'clock stubble visible on the crown), broad shoulders, visible biceps filling the t-shirt sleeves, athletic build, ~185cm. Standing relaxed but engaged, weight slightly on the back foot. Holding a Rupes BigFoot dual-action polisher in the right hand at hip-level, polisher head pointed down, ready to lift toward the car.

CENTER FIGURE: middle-aged man, ~42 years old, neatly cut short dark brown hair (NO cap, NO hat, short side-parted style with natural texture), average build, ~178cm. Standing squared to the car, both feet planted. Holding a translucent plastic pressure-spray bottle filled with detailing chemical in the left hand at waist-level, nozzle pointed downward.

RIGHT FIGURE: lean 18-year-old young man, slim athletic build, ~180cm. SHORT "flow" haircut — dark blonde hair, ~6-8cm length on top, naturally textured and slightly tousled, falling forward in soft layers (modern short hockey-flow / curtain crop, NOT a long flow, NOT a man-bun, NOT a buzz cut). Wears WIRE-FRAME GLASSES (the temple arms of the glasses just visible from this back-angle, hooked behind the ear). Standing with weight on front foot, slight forward lean. Holding a folded plush microfiber towel (charcoal grey) in the right hand and a foam applicator pad in the left, both at waist-level.

ALL THREE WEAR IDENTICAL UNIFORMS: a fitted plain black cotton crew-neck t-shirt with the cursive script wordmark "Cars Detailing Radom" printed across the upper back in cream/off-white (#F3EFE6) — the wordmark runs in a single line from shoulder blade to shoulder blade, in an elegant italic script font, clearly legible. Dark slim-fit cargo pants (charcoal grey-black), black trainer shoes. No watches, no jewelry visible.

THE REAL STUDIO ENVIRONMENT (this is critical — NOT a cinematic void, NOT an infinite black background):
- FLOOR: bright red ribbed interlocking polypropylene workshop tiles (the kind with raised geometric pattern and small drainage holes), covering the working area where the car sits. The red floor reads vivid and saturated, slightly scuffed and used. Around the perimeter, transition to dark grey/black ribbed tiles forming an L-shaped border.
- WALLS: painted white cinderblock / cinderbrick walls with subtle texture and minor paint imperfections (slightly aged, lived-in industrial feel). Visible wall conduit/cable running horizontally along the upper wall. On the LEFT wall, mounted equipment hooks holding several plastic detail-product spray bottles (various brand labels, hung by their trigger handles). A red rolling mechanic's tool cart (Yato or similar) sits against the left wall with tools and bottles on top.
- CEILING: industrial flat white ceiling with rectangular recessed fluorescent / LED panel fixtures providing strong overhead lighting. Visible ceiling vents and conduit. NO hex-pattern LED ceiling, NO dramatic ceiling reflections on the car.
- BACK WALL behind the car: continues the white painted wall with maybe a doorway opening or natural-light source softly visible. Slightly out of focus.
- The studio feels compact (~6m wide), professional, real, well-used. Premium quality but honest — this is a working detailer's space, not a showroom.

LIGHTING: bright workshop overhead lighting — cool-white (5500-6000K) fluorescent / LED ceiling panels providing even illumination across the whole scene. Strong specular highlights raking across the G63's roof, hood, fenders, and the top of the car's windows — the dark Obsidian Black paint reflects the white ceiling panels as bright sharp lines and rectangles. Soft secondary fill from a window/door (cool natural daylight). Even shadows on the floor under the car. NO warm yellow/orange/amber tones anywhere — strictly cool-white industrial lighting. NO dramatic cinematic noir lighting.

CAMERA: ~4-5 meters behind the trio, ~1.7m eye height (slightly above the men's shoulders, looking down a few degrees), 35mm lens equivalent on full-frame (wider than 50mm to fit the workshop context), f/5.6 (both trio and G63 are sharp, background gently softens), ISO 400, available workshop light. Ultra-sharp commercial automotive photography, photorealistic skin texture on visible forearms and hands, every fabric weave visible on the t-shirts, every drainage hole visible on the red floor tiles, every brick texture on the white walls.

MOOD: anticipation, the moment before work begins. The three men are squared up and ready, tools in hand, but stationary — not moving. Editorial documentary energy. The studio feels lived-in and active — this is where work actually gets done.

STRICT EXCLUSIONS: no text or logos visible anywhere except (a) the cursive "Cars Detailing Radom" wordmark across the t-shirt backs and (b) the factory Mercedes star on the grille. NO Brabus markings anywhere. NO faces, profiles, or side glances from any of the three men. NO watermarks, NO UI elements, NO captions. NO hex LED ceiling fixtures (this is the real workshop, not the PPF noir studio). NO dramatic black void background. NO crimson red overlay on the car. NO wet mirror floor.

OUTPUT: 2048×1152 (16:9), 2k resolution, photorealistic, no painterly artifacts.
```

### Visual verdict (v2-2k, shipped)

- **Composition**: pass. Centered, both car + trio fully visible, classic editorial framing.
- **Crew identity**: pass. Bald muscular L, middle-aged short-hair C, 18yo short flow + glasses R. Glasses temple arm visible from the back-angle on the right figure.
- **Backs to camera**: pass. Zero faces, zero profiles, zero side-glances across all three.
- **T-shirt wordmark**: pass. Cursive "Cars Detailing Radom" reads cleanly in cream-on-black on all three upper backs. Identical layout on all three.
- **Car**: pass. Dark stock G63 AMG (no Brabus widebody flares), Mercedes star centered on grille, AMG-style wheels.
- **Studio**: pass. White brick walls, red ribbed floor with grey perimeter, red tool cart on left, industrial ceiling with LED strips, ceiling vents, doorway right. Reads as real working studio.
- **Lighting**: pass. Cool-white overhead, even, zero warm/yellow contamination, strong specular highlights on the car's dark paint.
- **Tools**: visible in hands but not aggressively foreground. Center figure clearly holds a spray bottle. Right figure shows microfiber + applicator hint. Bald guy's polisher reads as a small handheld tool.
- **No-go list (all clean)**: NO Brabus markings, NO hex LED ceiling, NO crimson overlay, NO wet mirror floor, NO black void.

### Higgsfield credit ledger

- v1 (1k, validation gate): ~1 credit
- v2 (2k, shipped): ~2 credits
- **Total: ~3 credits** for this shoot

### Open / next steps

- Wire `public/about/zespol-hero.webp` into the About / O nas section when that section is built. Suggested usage: full-bleed 16:9 hero card with eyebrow + heading + lede laid out either above or to the side, NOT overlaid on the image (no copy-void was designed in).
- If Tomasz prefers a tighter framing (just the trio, no car visible), or a different angle (3/4 from behind instead of dead-flat), regen with the same crew + studio language and adjusted camera block.
