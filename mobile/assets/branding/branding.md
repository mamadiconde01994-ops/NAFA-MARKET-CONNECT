**NAFA Market Connect — Identité Visuelle (Phase 1)**

- Purpose: assets and guidelines for the definitive visual identity. No functionality changes.

Couleurs officielles:
- Primary: Jungle Green: #0B8A5F
- Primary 2 (accent): Mint: #18B28A
- Accent: Sunrise: #FFD166
- Secondary: Gold: #F69E1D
- Neutral dark: #061919
- Neutral light: #FFFFFF

Accessible contrast pairs (recommended):
- Primary on white: #0B8A5F on #FFFFFF
- White on Primary: #FFFFFF on #0B8A5F

Typographie (recommendée):
- Titre: Inter or Poppins (700 / 600)
- Corps de texte: Roboto or Inter (400 / 500)
- Sizes guidance: H1 32-34, H2 24-28, Body 14-16, Small 12

Logo:
- Files included: `logo.svg` (full badge + wordmark), `logo-mark.svg` (compact mark), `app-icon.svg` (square app icon).
- Style: combination of leaf (agriculture), ascending bars (commerce/growth), and subtle circuit accents (technology).
- Usage: use full `logo.svg` for marketing and splash; `logo-mark.svg` for compact contexts (tabs, favicons); `app-icon.svg` as source for generating OS app icons.

Splash & Loading:
- `splash-light.svg` and `splash-dark.svg` provided (vector). Keep logo centered, leave safe margins, avoid cropped elements.
- `loading.svg` is a lightweight animated SVG for loading states (subtle, looped).

Icon export instructions:
- Generate PNGs from `app-icon.svg` at following sizes: see `app-icon-sizes.json`.
- Keep round-corner safe area (do not let logo touch edges). Do not add shadows that crop on small sizes.

Animation guidance:
- Keep animations short (<= 700ms) and loop subtly.
- For splash entry: fade+scale of mark (0.6 -> 1.0) with small ease-out (500ms).

Accessibility & Dark mode:
- Provide both light and dark background variants for splash; ensure wordmark contrast >= 4.5:1.

Files created in: mobile/assets/branding

If you want, I can now generate raster PNG exports from `app-icon.svg` at the required sizes, or create simple RN components showing splash/loading using these assets.
