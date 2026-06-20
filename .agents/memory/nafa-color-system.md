---
name: NAFA color system
description: How the 3-theme color system works and which values to use for the light (default) theme
---

## Rule
The light theme `primary` and `navyHeader` must be `#1a472a` (forest green), NOT navy `#1E293B`.

**Why:** All deep screens (auth, profile, favorites, etc.) hardcode forest green via `BRAND_MID = "#1B4332"`. The home screen uses `colors.navyHeader`. If primary/navyHeader is navy in light theme, the home screen header looks navy while all other screens look green — incoherent brand.

**How to apply:**
- When editing `constants/colors.ts`, keep `light.primary = "#1a472a"` and `light.navyHeader = "#1a472a"`.
- The 3-theme labels in profile.tsx: light → "Vert & Doré", dark → "Mode nuit", green → "Vert nature".
- `branding.ts` already uses `#1a472a` as `NAFA_COLORS.primary.dark` — stay consistent.
