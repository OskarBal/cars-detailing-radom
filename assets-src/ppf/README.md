# `assets-src/ppf/` — PPF visualiser source materials

Everything needed to regenerate the shipped images in `public/ppf/`. Not bundled, not served — purely a workshop folder for asset production. Commits to git so future regen sessions can diff against the originals.

## What's in here

```
assets-src/ppf/
├── README.md         — this file (the pipeline doc)
├── prompts.md        — final prompts + Higgsfield job IDs for every render
└── raw/              — original Higgsfield PNG outputs (1200×896, ~1.3 MB each)
    ├── base/
    │   ├── front.webp.original  — snapshot of the original car-front.webp (2000×1493)
    │   └── rear.webp.original   — snapshot of the original car-rear.webp (2000×1493)
    └── packages/
        ├── reflektory/{front,rear}.png
        ├── progi/{front,rear}.png
        ├── pakiet-front/{front,rear}.png
        └── cale-auto/{front,rear}.png
```

The two `base/*.webp.original` files exist for provenance — they're the unmodified bare-paint car renders generated in an earlier session (see `BUILD_STATE.md` 2026-05-20 morning entry: Higgsfield `nano_banana_2` + `nano_banana_pro` fallback, base prompt "pearl-white Mercedes G-Class on noir studio background, 2000×1493"). The shipped `public/ppf/base/{front,rear}.webp` are the same files, just renamed when phase 2 moved the assets into the new folder structure.

The 8 PNGs in `raw/packages/` are the package-coverage Higgsfield renders that drive the configurator. They're checked in (~10 MB total) so any future session can re-convert at different webp quality settings without re-billing Higgsfield. If repo weight ever becomes a concern, gitignore `*.png` here and re-pull via `mcp__claude_ai_Higgsfield__job_status` using the job IDs in `prompts.md`.

## Regen pipeline (end to end)

For any single package/view:

1. **Upload the appropriate base webp as the image-to-image reference.**
   ```
   mcp__claude_ai_Higgsfield__media_upload  → returns media_id + presigned URL
   curl PUT <presigned URL>                  → upload the bytes
   mcp__claude_ai_Higgsfield__media_confirm → confirm
   ```

2. **Submit the generation** with `nano_banana_pro` (server may fall back to `nano_banana_2`), passing the uploaded base as `medias: [{role: 'image', value: <media_id>}]`. Use the prompt template captured in `prompts.md` — every prompt anchors on "match reference exactly, only the surface treatment changes" so composition stays stable across packages.

3. **Poll until complete** (~10-20 s).

4. **Download the raw PNG** to `assets-src/ppf/raw/packages/<slug>/<view>.png`.

5. **Convert to webp** at Q82:
   ```bash
   cwebp -q 82 -m 6 -mt -quiet \
     assets-src/ppf/raw/packages/<slug>/<view>.png \
     -o public/ppf/packages/<slug>/<view>.webp
   ```
   Output target: ~30-40 KB per webp (1200×896 source). If you re-gen at higher resolution, expect ~60-80 KB at the same quality.

6. **Update `prompts.md`** with the new job ID + a note on why the regen was needed.

## Prompt design notes (lessons from 2026-05-20 initial batch)

- "Match the reference image EXACTLY for composition, lighting, camera angle, car position, scene" — this is the critical line. Without it the model rotates the car or shifts the lighting between renders, breaking the crossfade illusion.
- "Apply PPF to: [explicit list]" + "Everywhere else: bare paint identical to reference" — this two-clause pattern keeps the model focused. Don't trust it to know which panels belong to which package.
- "PPF visible via: subtly increased gloss / thin film seam at panel gaps / slight blue refraction tint at film edges / wet glassy look" — the four bullets give the model a vocabulary for the PPF effect. The blue refraction tint is what actually reads on screen — without it the PPF is too subtle to spot. The `cale-auto/rear.webp` is the gold-standard outcome (visible film seams at every panel gap).
- The `pkg-reflektory` package only covers front headlight lenses → the rear view shows nothing visibly different from base. The prompt for `reflektory/rear` explicitly tells the model "no PPF visible from this angle" rather than trying to invent rear coverage.

## When to regen

- Tomasz approves a different camera angle or background — regen all 10 images with the new base.
- Tomasz wants the PPF effect more (or less) visually pronounced — adjust the "PPF visible via" bullets and regen.
- Cennik changes a package's coverage list — regen that package's front + rear with the new coverage in the prompt.
- Tomasz picks a specific film brand with a known optical signature (e.g. STEK with a slightly amber tint) — adjust the prompt's "blue refraction tint" to match.

Always update `prompts.md` after a regen so the next session inherits the latest.
